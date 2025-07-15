const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const fs = require("node:fs");
const mime = require("mime-types");

// API key rotation - primary and backup keys
const API_KEYS = [
  process.env.NEXT_PUBLIC_GEMINI_API_KEY,
  process.env.NEXT_PUBLIC_GEMINI_BACKUP_KEY // Your provided backup key
].filter(Boolean); // Remove any undefined keys

let currentKeyIndex = 0;

// Function to get current API key
const getCurrentApiKey = () => {
  return API_KEYS[currentKeyIndex];
};

// Function to rotate to next API key
const rotateApiKey = () => {
  if (API_KEYS.length > 1) {
    currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
    console.log(`Rotated to API key index: ${currentKeyIndex}`);
  }
};

// Initialize with current API key
const genAI = new GoogleGenerativeAI(getCurrentApiKey());

// Primary model - using experimental free version
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp-image-generation", // Free experimental model
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 1024,
  responseModalities: ["text"],
  responseMimeType: "text/plain",
};

const CodeGenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoffMultiplier: 2,
  retryableStatusCodes: [429, 500, 502, 503, 504],
};

// Sleep function for delays
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Function to create new genAI instance with rotated key
const createNewGenAI = () => {
  return new GoogleGenerativeAI(getCurrentApiKey());
};

// Retry logic with exponential backoff and API key rotation
async function retryWithBackoff(fn, config = RETRY_CONFIG) {
  let lastError;
  let delay = config.initialDelay;
  
  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      // Check if error is retryable
      const isRetryable = config.retryableStatusCodes.includes(error.status) || 
                         error.message?.includes('503') || 
                         error.message?.includes('overloaded') ||
                         error.message?.includes('503 Service Unavailable') ||
                         error.message?.includes('429') ||
                         error.message?.includes('quota');
      
      if (attempt === config.maxRetries || !isRetryable) {
        throw error;
      }
      
      // Try rotating API key on quota/auth errors
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('403')) {
        console.log('Rotating API key due to quota/auth error...');
        rotateApiKey();
      }
      
      console.log(`Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
      await sleep(delay);
      delay = Math.min(delay * config.backoffMultiplier, config.maxDelay);
    }
  }
  
  throw lastError;
}

export const chatSession = model.startChat({
  generationConfig,
  history: [],
});

export async function GenAiCode(prompt) {
  const result = await retryWithBackoff(async () => {
    // Create fresh genAI instance with current key
    const freshGenAI = createNewGenAI();
    const freshModel = freshGenAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
    });
    
    return await freshModel.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: CodeGenerationConfig,
    });
  });
  
  return result;
}

// Enhanced error handling function
export function handleApiError(error) {
  if (error.message?.includes('503') || error.message?.includes('overloaded')) {
    return {
      type: 'OVERLOADED',
      message: 'The AI service is currently overloaded. Please try again in a few moments.',
      retryAfter: 30000 // 30 seconds
    };
  }
  
  if (error.message?.includes('429') || error.message?.includes('quota')) {
    return {
      type: 'QUOTA_EXCEEDED',
      message: 'API quota exceeded. Trying with backup API key...',
      retryAfter: 60000 // 1 minute
    };
  }
  
  if (error.message?.includes('401') || error.message?.includes('API key')) {
    return {
      type: 'AUTH_ERROR',
      message: 'Authentication failed. Please check your API key.',
      retryAfter: null
    };
  }
  
  return {
    type: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred.',
    retryAfter: 5000 // 5 seconds
  };
}

// Function to get current API key status
export function getApiKeyStatus() {
  return {
    currentIndex: currentKeyIndex,
    totalKeys: API_KEYS.length,
    hasMultipleKeys: API_KEYS.length > 1
  };
}
  