/**
 * DOM Manipulator
 * 
 * Encapsulates all DOM interactions and CSS class toggling for the animated demo.
 * Caches element references for performance and validates element existence.
 * 
 * @module dom-manipulator
 */

/**
 * DOM Manipulator class for element queries and class manipulation
 */
export class DOMManipulator {
  /**
   * Create a DOM Manipulator instance
   * @param {HTMLElement} rootElement - Root element containing all demo elements
   * @param {Object} selectors - Object containing CSS selectors for demo elements
   * @param {Object} timingManager - TimingManager instance for animation timing
   * @throws {Error} If rootElement is not provided or is not an HTMLElement
   */
  constructor(rootElement, selectors = {}, timingManager = null) {
    if (!rootElement || !(rootElement instanceof HTMLElement)) {
      throw new Error('DOMManipulator requires a valid HTMLElement as rootElement');
    }
    
    this._root = rootElement;
    this._selectors = selectors;
    this._elementCache = new Map();
    this._timingManager = timingManager;
    
    // Cache all elements on initialization
    this._cacheElements();
  }
  
  /**
   * Cache all DOM element references
   * @private
   */
  _cacheElements() {
    const elements = {
      textSelection: this._selectors.textSelection,
      keyboardIndicator: this._selectors.keyboardIndicator,
      appWindow: this._selectors.appWindow,
      quickActionButton: this._selectors.quickActionButton,
      replacementText: this._selectors.replacementText,
    };
    
    for (const [key, selector] of Object.entries(elements)) {
      if (selector) {
        const element = this._root.querySelector(selector);
        if (element) {
          this._elementCache.set(key, element);
        }
      }
    }
  }
  
  /**
   * Get cached element or query if not cached
   * @private
   * @param {string} key - Element cache key
   * @param {string} selector - CSS selector fallback
   * @returns {HTMLElement|null} Element or null if not found
   */
  _getElement(key, selector) {
    if (this._elementCache.has(key)) {
      return this._elementCache.get(key);
    }
    
    if (selector) {
      const element = this._root.querySelector(selector);
      if (element) {
        this._elementCache.set(key, element);
        return element;
      }
    }
    
    return null;
  }
  
  /**
   * Validate that an element exists
   * @private
   * @param {HTMLElement|null} element - Element to validate
   * @param {string} elementName - Name of element for error message
   * @throws {Error} If element is null
   */
  _validateElement(element, elementName) {
    if (!element) {
      throw new Error(`Element not found: ${elementName}`);
    }
  }
  
  // ============================================================================
  // Element Query Methods
  // ============================================================================
  
  /**
   * Get the text selection element
   * @returns {HTMLElement|null} Text selection element or null if not found
   */
  getTextSelection() {
    return this._getElement('textSelection', this._selectors.textSelection);
  }
  
  /**
   * Get the keyboard indicator element
   * @returns {HTMLElement|null} Keyboard indicator element or null if not found
   */
  getKeyboardIndicator() {
    return this._getElement('keyboardIndicator', this._selectors.keyboardIndicator);
  }
  
  /**
   * Get the app window element
   * @returns {HTMLElement|null} App window element or null if not found
   */
  getAppWindow() {
    return this._getElement('appWindow', this._selectors.appWindow);
  }
  
  /**
   * Get the quick action button element
   * @returns {HTMLElement|null} Quick action button element or null if not found
   */
  getQuickActionButton() {
    return this._getElement('quickActionButton', this._selectors.quickActionButton);
  }
  
  /**
   * Get the replacement text element
   * @returns {HTMLElement|null} Replacement text element or null if not found
   */
  getReplacementText() {
    return this._getElement('replacementText', this._selectors.replacementText);
  }
  
  // ============================================================================
  // Class Manipulation Methods
  // ============================================================================
  
  /**
   * Add a CSS class to an element
   * @param {HTMLElement} element - Element to add class to
   * @param {string} className - Class name to add
   * @throws {Error} If element is null or className is empty
   */
  addClass(element, className) {
    if (!element) {
      throw new Error('Cannot add class to null element');
    }
    if (!className || typeof className !== 'string') {
      throw new Error('className must be a non-empty string');
    }
    
    element.classList.add(className);
  }
  
  /**
   * Remove a CSS class from an element
   * @param {HTMLElement} element - Element to remove class from
   * @param {string} className - Class name to remove
   * @throws {Error} If element is null or className is empty
   */
  removeClass(element, className) {
    if (!element) {
      throw new Error('Cannot remove class from null element');
    }
    if (!className || typeof className !== 'string') {
      throw new Error('className must be a non-empty string');
    }
    
    element.classList.remove(className);
  }
  
  /**
   * Toggle a CSS class on an element
   * @param {HTMLElement} element - Element to toggle class on
   * @param {string} className - Class name to toggle
   * @returns {boolean} True if class was added, false if removed
   * @throws {Error} If element is null or className is empty
   */
  toggleClass(element, className) {
    if (!element) {
      throw new Error('Cannot toggle class on null element');
    }
    if (!className || typeof className !== 'string') {
      throw new Error('className must be a non-empty string');
    }
    
    return element.classList.toggle(className);
  }
  
  /**
   * Check if an element has a CSS class
   * @param {HTMLElement} element - Element to check
   * @param {string} className - Class name to check for
   * @returns {boolean} True if element has the class
   * @throws {Error} If element is null or className is empty
   */
  hasClass(element, className) {
    if (!element) {
      throw new Error('Cannot check class on null element');
    }
    if (!className || typeof className !== 'string') {
      throw new Error('className must be a non-empty string');
    }
    
    return element.classList.contains(className);
  }
  
  /**
   * Remove all classes from an element that match a prefix
   * @param {HTMLElement} element - Element to remove classes from
   * @param {string} prefix - Class name prefix to match
   * @throws {Error} If element is null or prefix is empty
   */
  removeClassesWithPrefix(element, prefix) {
    if (!element) {
      throw new Error('Cannot remove classes from null element');
    }
    if (!prefix || typeof prefix !== 'string') {
      throw new Error('prefix must be a non-empty string');
    }
    
    const classesToRemove = Array.from(element.classList).filter(
      className => className.startsWith(prefix)
    );
    
    classesToRemove.forEach(className => {
      element.classList.remove(className);
    });
  }
  
  // ============================================================================
  // Utility Methods
  // ============================================================================
  
  /**
   * Clear the element cache
   */
  clearCache() {
    this._elementCache.clear();
  }
  
  /**
   * Refresh the element cache
   */
  refreshCache() {
    this.clearCache();
    this._cacheElements();
  }
  
  /**
   * Get the root element
   * @returns {HTMLElement} Root element
   */
  getRoot() {
    return this._root;
  }
  
  /**
   * Check if all required elements exist
   * @returns {Object} Object with element names as keys and boolean existence as values
   */
  validateElements() {
    const validation = {
      textSelection: !!this.getTextSelection(),
      keyboardIndicator: !!this.getKeyboardIndicator(),
      appWindow: !!this.getAppWindow(),
      quickActionButton: !!this.getQuickActionButton(),
      replacementText: !!this.getReplacementText(),
    };
    
    return validation;
  }
  
  /**
   * Get all missing elements
   * @returns {string[]} Array of missing element names
   */
  getMissingElements() {
    const validation = this.validateElements();
    return Object.entries(validation)
      .filter(([_, exists]) => !exists)
      .map(([name, _]) => name);
  }
  
  // ============================================================================
  // Animation Helper Methods
  // ============================================================================
  
  /**
   * Animate text selection from left to right
   * @param {HTMLElement} element - Element to animate selection on
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @throws {Error} If element is null or timingManager is not available
   */
  animateSelection(element, duration) {
    if (!element) {
      throw new Error('Cannot animate selection on null element');
    }
    if (!this._timingManager) {
      throw new Error('TimingManager is required for animations');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('duration must be a positive number');
    }
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply eased progress for smooth animation
        const easedProgress = this._timingManager.easeOut(progress);
        
        // Set CSS custom property for selection width (0% to 100%)
        element.style.setProperty('--selection-progress', `${easedProgress * 100}%`);
        
        if (progress < 1) {
          this._timingManager.scheduleFrame(animate);
        } else {
          // Ensure final state is set
          element.style.setProperty('--selection-progress', '100%');
          resolve();
        }
      };
      
      // Start animation
      this._timingManager.scheduleFrame(animate);
    });
  }
  
  /**
   * Animate keyboard indicator press effect
   * @param {HTMLElement} element - Element to animate press on
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @throws {Error} If element is null or timingManager is not available
   */
  animatePress(element, duration) {
    if (!element) {
      throw new Error('Cannot animate press on null element');
    }
    if (!this._timingManager) {
      throw new Error('TimingManager is required for animations');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('duration must be a positive number');
    }
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      const halfDuration = duration / 2;
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Press down in first half, release in second half
        let pressProgress;
        if (elapsed < halfDuration) {
          // Press down: 0 to 1
          pressProgress = (elapsed / halfDuration);
        } else {
          // Release: 1 to 0
          pressProgress = 1 - ((elapsed - halfDuration) / halfDuration);
        }
        
        // Apply easing for smooth press effect
        const easedProgress = this._timingManager.easeInOut(pressProgress);
        
        // Set CSS custom property for press depth (0 to 1)
        element.style.setProperty('--press-depth', easedProgress);
        
        if (progress < 1) {
          this._timingManager.scheduleFrame(animate);
        } else {
          // Ensure final state is reset
          element.style.setProperty('--press-depth', '0');
          resolve();
        }
      };
      
      // Start animation
      this._timingManager.scheduleFrame(animate);
    });
  }
  
  /**
   * Animate element fade in
   * @param {HTMLElement} element - Element to fade in
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @throws {Error} If element is null or timingManager is not available
   */
  animateFadeIn(element, duration) {
    if (!element) {
      throw new Error('Cannot animate fade in on null element');
    }
    if (!this._timingManager) {
      throw new Error('TimingManager is required for animations');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('duration must be a positive number');
    }
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing for smooth fade
        const easedProgress = this._timingManager.easeOut(progress);
        
        // Set opacity from 0 to 1
        element.style.opacity = easedProgress;
        
        if (progress < 1) {
          this._timingManager.scheduleFrame(animate);
        } else {
          // Ensure final state is set
          element.style.opacity = '1';
          resolve();
        }
      };
      
      // Set initial state
      element.style.opacity = '0';
      
      // Start animation
      this._timingManager.scheduleFrame(animate);
    });
  }
  
  /**
   * Animate element fade out
   * @param {HTMLElement} element - Element to fade out
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @throws {Error} If element is null or timingManager is not available
   */
  animateFadeOut(element, duration) {
    if (!element) {
      throw new Error('Cannot animate fade out on null element');
    }
    if (!this._timingManager) {
      throw new Error('TimingManager is required for animations');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('duration must be a positive number');
    }
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing for smooth fade
        const easedProgress = this._timingManager.easeOut(progress);
        
        // Set opacity from 1 to 0
        element.style.opacity = 1 - easedProgress;
        
        if (progress < 1) {
          this._timingManager.scheduleFrame(animate);
        } else {
          // Ensure final state is set
          element.style.opacity = '0';
          resolve();
        }
      };
      
      // Start animation
      this._timingManager.scheduleFrame(animate);
    });
  }
  
  /**
   * Animate element scale
   * @param {HTMLElement} element - Element to scale
   * @param {number} from - Starting scale value (e.g., 0.8)
   * @param {number} to - Ending scale value (e.g., 1.0)
   * @param {number} duration - Animation duration in milliseconds
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @throws {Error} If element is null, timingManager is not available, or scale values are invalid
   */
  animateScale(element, from, to, duration) {
    if (!element) {
      throw new Error('Cannot animate scale on null element');
    }
    if (!this._timingManager) {
      throw new Error('TimingManager is required for animations');
    }
    if (typeof from !== 'number' || typeof to !== 'number') {
      throw new Error('from and to must be numbers');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('duration must be a positive number');
    }
    
    return new Promise((resolve) => {
      const startTime = performance.now();
      const scaleRange = to - from;
      
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Apply easing for smooth scale
        const easedProgress = this._timingManager.easeOut(progress);
        
        // Calculate current scale value
        const currentScale = from + (scaleRange * easedProgress);
        
        // Apply transform using GPU-accelerated property
        element.style.transform = `scale(${currentScale})`;
        
        if (progress < 1) {
          this._timingManager.scheduleFrame(animate);
        } else {
          // Ensure final state is set
          element.style.transform = `scale(${to})`;
          resolve();
        }
      };
      
      // Start animation
      this._timingManager.scheduleFrame(animate);
    });
  }
}

export default DOMManipulator;
