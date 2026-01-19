/**
 * Tests for Animated Demo Entry Point
 * 
 * Validates: Requirements 1.1, 1.2
 */

// Disable auto-initialization for tests
if (typeof window !== 'undefined') {
  window.__DISABLE_AUTO_INIT__ = true;
}

import { AnimationController, initializeAnimation, animationConfig } from './index.js';

describe('Animated Demo Entry Point', () => {
  let mockRootElement;
  
  beforeEach(() => {
    // Create mock DOM structure
    mockRootElement = document.createElement('div');
    mockRootElement.className = 'demo-window';
    
    // Add required child elements
    const textSelection = document.createElement('div');
    textSelection.className = 'demo-text-selection';
    mockRootElement.appendChild(textSelection);
    
    const keyboardIndicator = document.createElement('div');
    keyboardIndicator.className = 'demo-keyboard-indicator';
    mockRootElement.appendChild(keyboardIndicator);
    
    const appWindow = document.createElement('div');
    appWindow.className = 'demo-app-window';
    mockRootElement.appendChild(appWindow);
    
    const quickActionButton = document.createElement('button');
    quickActionButton.className = 'demo-quick-action';
    mockRootElement.appendChild(quickActionButton);
    
    const replacementText = document.createElement('div');
    replacementText.className = 'demo-replacement-text';
    mockRootElement.appendChild(replacementText);
    
    document.body.appendChild(mockRootElement);
    
    // Clear any existing window.demoAnimation
    if (window.demoAnimation) {
      window.demoAnimation.destroy();
      delete window.demoAnimation;
    }
  });
  
  afterEach(() => {
    // Clean up DOM
    if (mockRootElement && mockRootElement.parentNode) {
      mockRootElement.parentNode.removeChild(mockRootElement);
    }
    
    // Clean up window.demoAnimation
    if (window.demoAnimation) {
      window.demoAnimation.destroy();
      delete window.demoAnimation;
    }
  });
  
  describe('Module Exports', () => {
    it('should export AnimationController class', () => {
      expect(AnimationController).toBeDefined();
      expect(typeof AnimationController).toBe('function');
    });
    
    it('should export animationConfig object', () => {
      expect(animationConfig).toBeDefined();
      expect(typeof animationConfig).toBe('object');
      expect(animationConfig.timing).toBeDefined();
      expect(animationConfig.classes).toBeDefined();
      expect(animationConfig.selectors).toBeDefined();
      expect(animationConfig.features).toBeDefined();
    });
    
    it('should export initializeAnimation function', () => {
      expect(initializeAnimation).toBeDefined();
      expect(typeof initializeAnimation).toBe('function');
    });
  });
  
  describe('initializeAnimation()', () => {
    it('should create and initialize AnimationController', () => {
      const controller = initializeAnimation(animationConfig);
      
      expect(controller).toBeInstanceOf(AnimationController);
      expect(controller.isInitialized).toBe(true);
    });
    
    it('should expose controller instance as window.demoAnimation', () => {
      const controller = initializeAnimation(animationConfig);
      
      expect(window.demoAnimation).toBeDefined();
      expect(window.demoAnimation).toBe(controller);
    });
    
    it('should start animation after 500ms if autoStart is enabled', (done) => {
      const config = {
        ...animationConfig,
        features: { ...animationConfig.features, autoStart: true }
      };
      
      const controller = initializeAnimation(config);
      
      // Animation should not be running immediately
      expect(controller.isRunning).toBe(false);
      
      // Wait 500ms and check
      setTimeout(() => {
        expect(controller.isRunning).toBe(true);
        controller.destroy();
        done();
      }, 550); // Add 50ms buffer
    });
    
    it('should not auto-start animation if autoStart is disabled', (done) => {
      const config = {
        ...animationConfig,
        features: { ...animationConfig.features, autoStart: false }
      };
      
      const controller = initializeAnimation(config);
      
      // Wait 600ms and check animation is still not running
      setTimeout(() => {
        expect(controller.isRunning).toBe(false);
        controller.destroy();
        done();
      }, 600);
    });
    
    it('should handle initialization errors gracefully', () => {
      // Remove demo window to cause initialization error
      mockRootElement.parentNode.removeChild(mockRootElement);
      
      const controller = initializeAnimation(animationConfig);
      
      // Should return null on error
      expect(controller).toBeNull();
      
      // Should not throw error
      expect(() => initializeAnimation(animationConfig)).not.toThrow();
    });
    
    it('should accept custom configuration', () => {
      const customConfig = {
        ...animationConfig,
        timing: {
          ...animationConfig.timing,
          selectionDuration: 1000, // Custom value
        }
      };
      
      const controller = initializeAnimation(customConfig);
      
      expect(controller.config.timing.selectionDuration).toBe(1000);
      
      // Clean up
      controller.destroy();
    });
  });
  
  describe('Manual Initialization', () => {
    it('should allow manual controller creation and initialization', () => {
      const controller = new AnimationController(animationConfig);
      
      expect(controller.isInitialized).toBe(false);
      
      controller.init();
      
      expect(controller.isInitialized).toBe(true);
      
      // Clean up
      controller.destroy();
    });
    
    it('should allow manual start after initialization', () => {
      const controller = new AnimationController(animationConfig);
      controller.init();
      
      expect(controller.isRunning).toBe(false);
      
      controller.start();
      
      expect(controller.isRunning).toBe(true);
      
      // Clean up
      controller.destroy();
    });
  });
  
  describe('Debugging Interface', () => {
    it('should expose controller methods via window.demoAnimation', () => {
      const controller = initializeAnimation(animationConfig);
      
      expect(window.demoAnimation.pause).toBeDefined();
      expect(window.demoAnimation.resume).toBeDefined();
      expect(window.demoAnimation.reset).toBeDefined();
      expect(window.demoAnimation.getStateData).toBeDefined();
      expect(window.demoAnimation.getCurrentState).toBeDefined();
      
      // Clean up
      controller.destroy();
    });
    
    it('should allow pausing animation via window.demoAnimation', (done) => {
      const controller = initializeAnimation(animationConfig);
      
      // Wait for animation to start
      setTimeout(() => {
        expect(controller.isRunning).toBe(true);
        
        // Pause via global instance
        window.demoAnimation.pause();
        expect(controller.isPaused).toBe(true);
        
        controller.destroy();
        done();
      }, 550);
    });
    
    it('should allow getting state data via window.demoAnimation', () => {
      const controller = initializeAnimation(animationConfig);
      
      const stateData = window.demoAnimation.getStateData();
      
      expect(stateData).toBeDefined();
      expect(stateData.isInitialized).toBe(true);
      expect(stateData.loopCount).toBe(0);
      
      // Clean up
      controller.destroy();
    });
  });
  
  describe('Requirements Validation', () => {
    it('should validate Requirement 1.1: Initialize within 500ms', (done) => {
      const controller = initializeAnimation(animationConfig);
      
      // Check animation is not running immediately
      expect(controller.isRunning).toBe(false);
      
      // Check at 450ms - should still not be running
      setTimeout(() => {
        expect(controller.isRunning).toBe(false);
      }, 450);
      
      // Check at 550ms - should be running
      setTimeout(() => {
        expect(controller.isRunning).toBe(true);
        controller.destroy();
        done();
      }, 550);
    });
    
    it('should validate Requirement 1.2: Execute animation sequence', (done) => {
      const controller = initializeAnimation(animationConfig);
      
      // Wait for animation to start
      setTimeout(() => {
        const initialState = controller.getCurrentState();
        expect(initialState).toBeDefined();
        expect(initialState.name).toBe('text-selection');
        
        controller.destroy();
        done();
      }, 550);
    });
  });
});
