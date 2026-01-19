/**
 * Animated Demo Feature - Main Entry Point
 * 
 * This module serves as the main entry point for the animated demo feature.
 * It exports the AnimationController and provides automatic initialization
 * when the DOM is ready.
 * 
 * Usage:
 *   // Automatic initialization (default)
 *   import 'animated-demo';
 * 
 *   // Manual initialization
 *   import { AnimationController } from 'animated-demo';
 *   const controller = new AnimationController();
 *   controller.init();
 *   controller.start();
 * 
 *   // Access global instance for debugging
 *   window.demoAnimation.pause();
 *   window.demoAnimation.resume();
 *   window.demoAnimation.getStateData();
 * 
 * Validates: Requirements 1.1, 1.2
 * 
 * @module animated-demo
 */

import { AnimationController } from './core/animation-controller.js';
import { animationConfig } from './config/animation-config.js';

// Export AnimationController for manual usage
export { AnimationController };

// Export configuration utilities
export { animationConfig, createConfig } from './config/animation-config.js';

/**
 * Initialize and start the animation controller
 * Called automatically on DOM ready if autoStart is enabled
 * 
 * @param {Object} config - Optional custom configuration
 * @returns {AnimationController} The initialized controller instance
 */
export function initializeAnimation(config = animationConfig) {
  try {
    // Create controller with provided or default configuration
    const controller = new AnimationController(config);
    
    // Initialize the controller
    controller.init();
    
    // Start animation if autoStart is enabled
    if (config.features.autoStart) {
      // Delay start by 500ms as per requirement 1.1
      setTimeout(() => {
        try {
          controller.start();
        } catch (error) {
          console.error('Failed to start animation:', error);
        }
      }, 500);
    }
    
    // Expose controller instance for debugging
    if (typeof window !== 'undefined') {
      window.demoAnimation = controller;
    }
    
    return controller;
    
  } catch (error) {
    console.error('Failed to initialize animated demo:', error);
    
    // Return null on error but don't throw (graceful degradation)
    return null;
  }
}

/**
 * Auto-initialize on DOM ready
 * Only runs if DOM is not already loaded and autoStart is enabled
 * Can be disabled by setting window.__DISABLE_AUTO_INIT__ = true (for testing)
 */
function autoInitialize() {
  // Skip auto-initialization if disabled (for testing)
  if (typeof window !== 'undefined' && window.__DISABLE_AUTO_INIT__) {
    return;
  }
  
  // Check if we should auto-initialize
  if (!animationConfig.features.autoStart) {
    return;
  }
  
  // Check if DOM is already ready
  if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
      initializeAnimation();
    });
  } else {
    // DOM is already ready, initialize immediately
    initializeAnimation();
  }
}

// Run auto-initialization if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  autoInitialize();
}

// Default export for convenience
export default AnimationController;
