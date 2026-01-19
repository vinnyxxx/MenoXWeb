/**
 * Lifecycle Manager
 * 
 * Handles browser lifecycle events for the animated demo.
 * Manages Page Visibility API integration and prefers-reduced-motion media query.
 * Pauses/resumes animation based on page visibility and respects user motion preferences.
 * 
 * Validates: Requirements 7.4, 9.1
 * 
 * @module lifecycle-manager
 */

/**
 * LifecycleManager class
 * Manages browser lifecycle events and user preferences for the animation controller
 */
export class LifecycleManager {
  /**
   * Create a new LifecycleManager
   * @param {Object} controller - Animation controller with pause(), resume(), and setReducedMotion() methods
   */
  constructor(controller) {
    if (!controller) {
      throw new Error('LifecycleManager requires a controller instance');
    }
    
    this.controller = controller;
    this.visibilityChangeHandler = null;
    this.reducedMotionMediaQuery = null;
    this.reducedMotionChangeHandler = null;
    
    // Feature detection flags
    this.hasVisibilityAPI = this._detectVisibilityAPI();
    this.hasMatchMedia = this._detectMatchMedia();
  }
  
  /**
   * Detect if Page Visibility API is available
   * @private
   * @returns {boolean} True if Page Visibility API is supported
   */
  _detectVisibilityAPI() {
    return typeof document !== 'undefined' && 
           typeof document.hidden !== 'undefined';
  }
  
  /**
   * Detect if matchMedia API is available
   * @private
   * @returns {boolean} True if matchMedia is supported
   */
  _detectMatchMedia() {
    return typeof window !== 'undefined' && 
           typeof window.matchMedia === 'function';
  }
  
  /**
   * Attach all lifecycle event listeners
   * Sets up Page Visibility API and prefers-reduced-motion listeners
   * 
   * @returns {void}
   */
  attachListeners() {
    // Attach Page Visibility API listener
    if (this.hasVisibilityAPI) {
      this.visibilityChangeHandler = this._onVisibilityChange.bind(this);
      document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    } else {
      console.warn('Page Visibility API not supported. Animation will not pause when page is hidden.');
    }
    
    // Attach prefers-reduced-motion listener
    if (this.hasMatchMedia) {
      try {
        this.reducedMotionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotionChangeHandler = this._onReducedMotionChange.bind(this);
        
        // Modern browsers support addEventListener on MediaQueryList
        if (typeof this.reducedMotionMediaQuery.addEventListener === 'function') {
          this.reducedMotionMediaQuery.addEventListener('change', this.reducedMotionChangeHandler);
        } 
        // Fallback for older browsers
        else if (typeof this.reducedMotionMediaQuery.addListener === 'function') {
          this.reducedMotionMediaQuery.addListener(this.reducedMotionChangeHandler);
        }
        
        // Check initial state and notify controller
        this._onReducedMotionChange();
      } catch (error) {
        console.warn('Error setting up prefers-reduced-motion listener:', error);
      }
    } else {
      console.warn('matchMedia not supported. Reduced motion preferences will not be detected.');
    }
  }
  
  /**
   * Detach all lifecycle event listeners
   * Cleans up Page Visibility API and prefers-reduced-motion listeners
   * 
   * @returns {void}
   */
  detachListeners() {
    // Detach Page Visibility API listener
    if (this.hasVisibilityAPI && this.visibilityChangeHandler) {
      document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
      this.visibilityChangeHandler = null;
    }
    
    // Detach prefers-reduced-motion listener
    if (this.reducedMotionMediaQuery && this.reducedMotionChangeHandler) {
      // Modern browsers support removeEventListener on MediaQueryList
      if (typeof this.reducedMotionMediaQuery.removeEventListener === 'function') {
        this.reducedMotionMediaQuery.removeEventListener('change', this.reducedMotionChangeHandler);
      }
      // Fallback for older browsers
      else if (typeof this.reducedMotionMediaQuery.removeListener === 'function') {
        this.reducedMotionMediaQuery.removeListener(this.reducedMotionChangeHandler);
      }
      
      this.reducedMotionChangeHandler = null;
      this.reducedMotionMediaQuery = null;
    }
  }
  
  /**
   * Check if the page is currently visible
   * @returns {boolean} True if page is visible, false if hidden
   */
  isPageVisible() {
    if (!this.hasVisibilityAPI) {
      // If API not available, assume page is visible
      return true;
    }
    
    return !document.hidden;
  }
  
  /**
   * Check if user prefers reduced motion
   * @returns {boolean} True if user prefers reduced motion
   */
  isReducedMotion() {
    if (!this.hasMatchMedia) {
      // If matchMedia not available, assume no reduced motion preference
      return false;
    }
    
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      return mediaQuery.matches;
    } catch (error) {
      console.warn('Error checking prefers-reduced-motion:', error);
      return false;
    }
  }
  
  /**
   * Handle page visibility changes
   * Pauses animation when page is hidden, resumes when visible
   * 
   * @private
   * @returns {void}
   */
  _onVisibilityChange() {
    const isVisible = this.isPageVisible();
    
    if (isVisible) {
      // Page became visible - resume animation
      if (typeof this.controller.resume === 'function') {
        this.controller.resume();
      }
    } else {
      // Page became hidden - pause animation
      if (typeof this.controller.pause === 'function') {
        this.controller.pause();
      }
    }
  }
  
  /**
   * Handle prefers-reduced-motion changes
   * Notifies controller when user's motion preference changes
   * 
   * @private
   * @returns {void}
   */
  _onReducedMotionChange() {
    const isReduced = this.isReducedMotion();
    
    // Notify controller of reduced motion preference
    if (typeof this.controller.setReducedMotion === 'function') {
      this.controller.setReducedMotion(isReduced);
    } else if (typeof this.controller.onReducedMotionChange === 'function') {
      // Fallback to alternative method name
      this.controller.onReducedMotionChange(isReduced);
    }
  }
}

