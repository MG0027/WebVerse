class ApiQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.maxConcurrent = 1; // Only allow 1 concurrent request to avoid overloading
    this.requestDelay = 2000; // 2 seconds between requests
  }

  async add(requestFn, priority = 0) {
    return new Promise((resolve, reject) => {
      const request = {
        fn: requestFn,
        priority,
        resolve,
        reject,
        id: Date.now() + Math.random(),
        timestamp: Date.now()
      };

      // Add to queue based on priority
      const insertIndex = this.queue.findIndex(item => item.priority < priority);
      if (insertIndex === -1) {
        this.queue.push(request);
      } else {
        this.queue.splice(insertIndex, 0, request);
      }

      this.process();
    });
  }

  async process() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const request = this.queue.shift();

      try {
        // Add delay between requests
        const timeSinceLastRequest = Date.now() - this.lastRequestTime;
        if (this.lastRequestTime && timeSinceLastRequest < this.requestDelay) {
          await new Promise(resolve => setTimeout(resolve, this.requestDelay - timeSinceLastRequest));
        }

        const result = await request.fn();
        this.lastRequestTime = Date.now();
        request.resolve(result);
      } catch (error) {
        request.reject(error);
      }

      // Small delay between processing queue items
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.isProcessing = false;
  }

  getQueueSize() {
    return this.queue.length;
  }

  clear() {
    this.queue.forEach(request => {
      request.reject(new Error('Queue cleared'));
    });
    this.queue = [];
    this.isProcessing = false;
  }
}

// Export singleton instance
export const apiQueue = new ApiQueue();

// Helper function to queue API requests
export const queueApiRequest = async (requestFn, priority = 0) => {
  return apiQueue.add(requestFn, priority);
};

// Status monitoring
export const getQueueStatus = () => {
  return {
    queueSize: apiQueue.getQueueSize(),
    isProcessing: apiQueue.isProcessing,
    lastRequestTime: apiQueue.lastRequestTime
  };
}; 