/**
 * Unit tests for LifecycleManager
 * 
 * Tests browser event handling, feature detection, and controller integration.
 * 
 * @module lifecycle-manager.test
 */

import { LifecycleManager } from './lifecycle-manager.js';

describe('LifecycleManager', () => {
  let mockController;
  let lifecycleManager;
  
  // Helper to create a mock function
  function createMockFn() {
    const calls = [];
    const fn = function(...args) {
      calls.push(args);
    };
    fn.calls = calls;
    fn.wasCalled = () => calls.length > 0;
    fn.wasCalledWith = (...expectedArgs) => {
      return calls.some(callArgs => 
        callArgs.length === expectedArgs.length &&
        callArgs.every((arg, i) => arg === expectedArgs[i])
      );
    };
    return fn;
  }
  
  beforeEach(() => {
    // Create mock controller with required methods
    mockController = {
      pause: createMockFn(),
      resume: createMockFn(),
      setReducedMotion: createMockFn(),
    };
  });
  
  afterEach(() => {
    // Clean up any listeners
    if (lifecycleManager) {
      lifecycleManager.detachListeners();
    }
  });
  
  describe('Constructor', () => {
    test('should throw error if controller is not provided', () => {
      expect(() => new LifecycleManager()).toThrow('LifecycleManager requires a controller instance');
    });
    
    test('should initialize with controller', () => {
      lifecycleManager = new LifecycleManager(mockController);
      expect(lifecycleManager.controller).toBe(mockController);
    });
    
    test('should detect Page Visibility API support', () => {
      lifecycleManager = new LifecycleManager(mockController);
      expect(typeof lifecycleManager.hasVisibilityAPI).toBe('boolean');
    });
    
    test('should detect matchMedia support', () => {
      lifecycleManager = new LifecycleManager(mockController);
      expect(typeof lifecycleManager.hasMatchMedia).toBe('boolean');
    });
  });
  
  describe('Feature Detection', () => {
    test('should detect Page Visibility API when available', () => {
      // Page Visibility API is available in test environment (jsdom)
      lifecycleManager = new LifecycleManager(mockController);
      expect(lifecycleManager.hasVisibilityAPI).toBe(true);
    });
    
    test('should detect matchMedia when available', () => {
      // matchMedia is available in test environment (jsdom)
      lifecycleManager = new LifecycleManager(mockController);
      expect(lifecycleManager.hasMatchMedia).toBe(true);
    });
  });
  
  describe('attachListeners', () => {
    test('should attach visibility change listener when API is available', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      expect(lifecycleManager.visibilityChangeHandler).toBeTruthy();
    });
    
    test('should attach reduced motion listener when matchMedia is available', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      expect(lifecycleManager.reducedMotionMediaQuery).toBeTruthy();
      expect(lifecycleManager.reducedMotionChangeHandler).toBeTruthy();
    });
    
    test('should check initial reduced motion state on attach', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      // setReducedMotion should be called with initial state
      expect(mockController.setReducedMotion.wasCalled()).toBe(true);
    });
  });
  
  describe('detachListeners', () => {
    test('should remove visibility change listener', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      lifecycleManager.detachListeners();
      
      expect(lifecycleManager.visibilityChangeHandler).toBeNull();
    });
    
    test('should remove reduced motion listener', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      lifecycleManager.detachListeners();
      
      expect(lifecycleManager.reducedMotionChangeHandler).toBeNull();
      expect(lifecycleManager.reducedMotionMediaQuery).toBeNull();
    });
    
    test('should handle detach when listeners were never attached', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      // Should not throw
      expect(() => lifecycleManager.detachListeners()).not.toThrow();
    });
  });
  
  describe('isPageVisible', () => {
    test('should return true when page is visible', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      // In test environment, document.hidden is false by default
      expect(lifecycleManager.isPageVisible()).toBe(true);
    });
    
    test('should return true if Page Visibility API is not available', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.hasVisibilityAPI = false;
      
      expect(lifecycleManager.isPageVisible()).toBe(true);
    });
  });
  
  describe('isReducedMotion', () => {
    test('should return false if matchMedia is not available', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.hasMatchMedia = false;
      
      expect(lifecycleManager.isReducedMotion()).toBe(false);
    });
    
    test('should handle matchMedia errors gracefully', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      // Save original matchMedia
      const originalMatchMedia = window.matchMedia;
      
      // Mock matchMedia to throw error
      window.matchMedia = () => {
        throw new Error('matchMedia error');
      };
      
      expect(lifecycleManager.isReducedMotion()).toBe(false);
      
      // Restore
      window.matchMedia = originalMatchMedia;
    });
  });
  
  describe('Visibility Change Handler', () => {
    test('should call controller.resume() when page becomes visible', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.attachListeners();
      
      // Trigger visibility change (page is visible by default in jsdom)
      lifecycleManager._onVisibilityChange();
      
      expect(mockController.resume.wasCalled()).toBe(true);
    });
    
    test('should handle missing pause method gracefully', () => {
      const controllerWithoutPause = {
        resume: createMockFn(),
        setReducedMotion: createMockFn(),
      };
      
      lifecycleManager = new LifecycleManager(controllerWithoutPause);
      lifecycleManager.attachListeners();
      
      // Should not throw
      expect(() => lifecycleManager._onVisibilityChange()).not.toThrow();
    });
    
    test('should handle missing resume method gracefully', () => {
      const controllerWithoutResume = {
        pause: createMockFn(),
        setReducedMotion: createMockFn(),
      };
      
      lifecycleManager = new LifecycleManager(controllerWithoutResume);
      lifecycleManager.attachListeners();
      
      // Should not throw
      expect(() => lifecycleManager._onVisibilityChange()).not.toThrow();
    });
  });
  
  describe('Reduced Motion Change Handler', () => {
    test('should call controller.setReducedMotion() with current preference', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      lifecycleManager._onReducedMotionChange();
      
      expect(mockController.setReducedMotion.wasCalled()).toBe(true);
    });
    
    test('should use fallback method onReducedMotionChange if setReducedMotion not available', () => {
      const controllerWithFallback = {
        pause: createMockFn(),
        resume: createMockFn(),
        onReducedMotionChange: createMockFn(),
      };
      
      lifecycleManager = new LifecycleManager(controllerWithFallback);
      
      lifecycleManager._onReducedMotionChange();
      
      expect(controllerWithFallback.onReducedMotionChange.wasCalled()).toBe(true);
    });
    
    test('should handle controller without reduced motion methods gracefully', () => {
      const minimalController = {
        pause: createMockFn(),
        resume: createMockFn(),
      };
      
      lifecycleManager = new LifecycleManager(minimalController);
      
      // Should not throw
      expect(() => lifecycleManager._onReducedMotionChange()).not.toThrow();
    });
  });
  
  describe('Integration', () => {
    test('should properly integrate with controller lifecycle', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      // Attach listeners
      lifecycleManager.attachListeners();
      expect(lifecycleManager.visibilityChangeHandler).toBeTruthy();
      expect(lifecycleManager.reducedMotionChangeHandler).toBeTruthy();
      
      // Detach listeners
      lifecycleManager.detachListeners();
      expect(lifecycleManager.visibilityChangeHandler).toBeNull();
      expect(lifecycleManager.reducedMotionChangeHandler).toBeNull();
    });
    
    test('should handle multiple attach/detach cycles', () => {
      lifecycleManager = new LifecycleManager(mockController);
      
      // First cycle
      lifecycleManager.attachListeners();
      lifecycleManager.detachListeners();
      
      // Second cycle
      lifecycleManager.attachListeners();
      lifecycleManager.detachListeners();
      
      // Should not throw or cause issues
      expect(lifecycleManager.visibilityChangeHandler).toBeNull();
      expect(lifecycleManager.reducedMotionChangeHandler).toBeNull();
    });
  });
  
  describe('Browser Compatibility', () => {
    test('should handle when Page Visibility API is not supported', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.hasVisibilityAPI = false;
      
      // Should not throw
      expect(() => lifecycleManager.attachListeners()).not.toThrow();
    });
    
    test('should handle when matchMedia is not supported', () => {
      lifecycleManager = new LifecycleManager(mockController);
      lifecycleManager.hasMatchMedia = false;
      
      // Should not throw
      expect(() => lifecycleManager.attachListeners()).not.toThrow();
    });
  });
});

