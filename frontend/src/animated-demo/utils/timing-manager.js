/**
 * Timing Manager
 * 
 * Manages animation timing using requestAnimationFrame and provides utilities
 * for delays, easing functions, and FPS monitoring.
 * 
 * @module timing-manager
 */

/**
 * Timing Manager class for animation timing and performance monitoring
 */
export class TimingManager {
  constructor() {
    // FPS monitoring
    this._frameCount = 0;
    this._lastFpsUpdate = 0;
    this._currentFps = 60;
    this._fpsUpdateInterval = 1000; // Update FPS every second
    
    // Active frame requests
    this._activeFrames = new Set();
  }
  
  /**
   * Schedule a callback to run on the next animation frame
   * @param {Function} callback - Function to call on next frame
   * @returns {number} Frame request ID that can be used to cancel
   */
  scheduleFrame(callback) {
    const frameId = requestAnimationFrame((timestamp) => {
      this._activeFrames.delete(frameId);
      this._updateFps(timestamp);
      callback(timestamp);
    });
    
    this._activeFrames.add(frameId);
    return frameId;
  }
  
  /**
   * Cancel a scheduled animation frame
   * @param {number} frameId - Frame request ID returned by scheduleFrame
   */
  cancelFrame(frameId) {
    cancelAnimationFrame(frameId);
    this._activeFrames.delete(frameId);
  }
  
  /**
   * Promise-based delay function
   * @param {number} ms - Milliseconds to delay
   * @returns {Promise<void>} Promise that resolves after the delay
   */
  delay(ms) {
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const checkTime = (currentTime) => {
        const elapsed = currentTime - startTime;
        
        if (elapsed >= ms) {
          resolve();
        } else {
          this.scheduleFrame(checkTime);
        }
      };
      
      this.scheduleFrame(checkTime);
    });
  }
  
  /**
   * Cubic ease-in-out easing function
   * @param {number} t - Time value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  easeInOut(t) {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t));
    
    // Cubic ease-in-out: https://easings.net/#easeInOutCubic
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  /**
   * Cubic ease-out easing function
   * @param {number} t - Time value between 0 and 1
   * @returns {number} Eased value between 0 and 1
   */
  easeOut(t) {
    // Clamp t to [0, 1]
    t = Math.max(0, Math.min(1, t));
    
    // Cubic ease-out: https://easings.net/#easeOutCubic
    return 1 - Math.pow(1 - t, 3);
  }
  
  /**
   * Get current frames per second
   * @returns {number} Current FPS (rounded to nearest integer)
   */
  getFPS() {
    return Math.round(this._currentFps);
  }
  
  /**
   * Update FPS calculation
   * @private
   * @param {number} timestamp - Current timestamp from requestAnimationFrame
   */
  _updateFps(timestamp) {
    this._frameCount++;
    
    if (this._lastFpsUpdate === 0) {
      this._lastFpsUpdate = timestamp;
      return;
    }
    
    const elapsed = timestamp - this._lastFpsUpdate;
    
    if (elapsed >= this._fpsUpdateInterval) {
      // Calculate FPS: frames / seconds
      this._currentFps = (this._frameCount * 1000) / elapsed;
      
      // Reset counters
      this._frameCount = 0;
      this._lastFpsUpdate = timestamp;
    }
  }
  
  /**
   * Reset FPS monitoring
   */
  resetFpsMonitoring() {
    this._frameCount = 0;
    this._lastFpsUpdate = 0;
    this._currentFps = 60;
  }
  
  /**
   * Cancel all active frame requests
   */
  cancelAllFrames() {
    this._activeFrames.forEach(frameId => {
      cancelAnimationFrame(frameId);
    });
    this._activeFrames.clear();
  }
  
  /**
   * Clean up resources
   */
  destroy() {
    this.cancelAllFrames();
    this.resetFpsMonitoring();
  }
}

export default TimingManager;
