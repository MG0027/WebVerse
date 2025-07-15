import { GenAiCode, handleApiError } from "@/configs/AiModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    console.log("Generating AI code for prompt...");
    const result = await GenAiCode(prompt);

    const resp = await result.response.text();

    try {
      const parsed = JSON.parse(resp);
      return NextResponse.json(parsed);
    } catch (parseErr) {
      console.error("JSON parsing failed:", parseErr.message);
      console.error("Raw response:", resp.slice(0, 300));
      return NextResponse.json({
        error: "AI returned invalid JSON response",
        details: parseErr.message
      }, { status: 500 });
    }
  } catch (error) {
    console.error("API Error:", error);

    const errorInfo = handleApiError(error);

    return NextResponse.json({
      error: errorInfo.message,
      errorType: errorInfo.type,
      retryAfter: errorInfo.retryAfter,
      timestamp: new Date().toISOString()
    }, {
      status: errorInfo.type === 'OVERLOADED' ? 503 :
        errorInfo.type === 'QUOTA_EXCEEDED' ? 429 :
          errorInfo.type === 'AUTH_ERROR' ? 401 : 500
    });
  }
}
