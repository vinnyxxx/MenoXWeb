/**
 * Unit tests for DOM Manipulator
 * 
 * Tests element queries, class manipulation, validation, and animation helpers.
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { DOMManipulator } from './dom-manipulator.js';
import { TimingManager } from './timing-manager.js';

describe('DOMManipulator', () => {
  let rootElement;
  let selectors;
  let domManipulator;
  
  beforeEach(() => {
    // Create a mock DOM structure
    rootElement = document.createElement('div');
    rootElement.className = 'demo-window';
    
    // Create demo elements
    const textSelection = document.createElement('div');
    textSelection.className = 'demo-text-selection';
    
    const keyboardIndicator = document.createElement('div');
    keyboardIndicator.className = 'demo-keyboard-indicator';
    
    const appWindow = document.createElement('div');
    appWindow.className = 'demo-app-window';
    
    const quickActionButton = document.createElement('button');
    quickActionButton.className = 'demo-quick-action';
    
    const replacementText = document.createElement('div');
    replacementText.className = 'demo-replacement-text';
    
    // Append to root
    rootElement.appendChild(textSelection);
    rootElement.appendChild(keyboardIndicator);
    rootElement.appendChild(appWindow);
    rootElement.appendChild(quickActionButton);
    rootElement.appendChild(replacementText);
    
    // Append root to document body for testing
    document.body.appendChild(rootElement);
    
    // Define selectors
    selectors = {
      textSelection: '.demo-text-selection',
      keyboardIndicator: '.demo-keyboard-indicator',
      appWindow: '.demo-app-window',
      quickActionButton: '.demo-quick-action',
      replacementText: '.demo-replacement-text',
    };
    
    // Create DOM manipulator instance
    domManipulator = new DOMManipulator(rootElement, selectors);
  });
  
  afterEach(() => {
    // Clean up
    document.body.removeChild(rootElement);
  });
  
  // ============================================================================
  // Constructor Tests
  // ============================================================================
  
  describe('constructor', () => {
    it('should throw error if rootElement is not provided', () => {
      expect(() => new DOMManipulator(null, selectors)).toThrow(
        'DOMManipulator requires a valid HTMLElement as rootElement'
      );
    });
    
    it('should throw error if rootElement is not an HTMLElement', () => {
      expect(() => new DOMManipulator({}, selectors)).toThrow(
        'DOMManipulator requires a valid HTMLElement as rootElement'
      );
    });
    
    it('should create instance with valid rootElement', () => {
      expect(domManipulator).toBeInstanceOf(DOMManipulator);
    });
    
    it('should cache elements on initialization', () => {
      expect(domManipulator.getTextSelection()).toBeTruthy();
      expect(domManipulator.getKeyboardIndicator()).toBeTruthy();
      expect(domManipulator.getAppWindow()).toBeTruthy();
      expect(domManipulator.getQuickActionButton()).toBeTruthy();
      expect(domManipulator.getReplacementText()).toBeTruthy();
    });
  });
  
  // ============================================================================
  // Element Query Tests
  // ============================================================================
  
  describe('element queries', () => {
    it('should return text selection element', () => {
      const element = domManipulator.getTextSelection();
      expect(element).toBeTruthy();
      expect(element.classList.contains('demo-text-selection')).toBe(true);
    });
    
    it('should return keyboard indicator element', () => {
      const element = domManipulator.getKeyboardIndicator();
      expect(element).toBeTruthy();
      expect(element.classList.contains('demo-keyboard-indicator')).toBe(true);
    });
    
    it('should return app window element', () => {
      const element = domManipulator.getAppWindow();
      expect(element).toBeTruthy();
      expect(element.classList.contains('demo-app-window')).toBe(true);
    });
    
    it('should return quick action button element', () => {
      const element = domManipulator.getQuickActionButton();
      expect(element).toBeTruthy();
      expect(element.classList.contains('demo-quick-action')).toBe(true);
    });
    
    it('should return replacement text element', () => {
      const element = domManipulator.getReplacementText();
      expect(element).toBeTruthy();
      expect(element.classList.contains('demo-replacement-text')).toBe(true);
    });
    
    it('should return null for missing elements', () => {
      const emptyRoot = document.createElement('div');
      const emptyManipulator = new DOMManipulator(emptyRoot, selectors);
      
      expect(emptyManipulator.getTextSelection()).toBeNull();
      expect(emptyManipulator.getKeyboardIndicator()).toBeNull();
      expect(emptyManipulator.getAppWindow()).toBeNull();
      expect(emptyManipulator.getQuickActionButton()).toBeNull();
      expect(emptyManipulator.getReplacementText()).toBeNull();
    });
    
    it('should use cached elements on subsequent queries', () => {
      const element1 = domManipulator.getTextSelection();
      const element2 = domManipulator.getTextSelection();
      
      expect(element1).toBe(element2);
    });
  });
  
  // ============================================================================
  // Class Manipulation Tests
  // ============================================================================
  
  describe('addClass', () => {
    it('should add class to element', () => {
      const element = domManipulator.getTextSelection();
      domManipulator.addClass(element, 'test-class');
      
      expect(element.classList.contains('test-class')).toBe(true);
    });
    
    it('should throw error if element is null', () => {
      expect(() => domManipulator.addClass(null, 'test-class')).toThrow(
        'Cannot add class to null element'
      );
    });
    
    it('should throw error if className is empty', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.addClass(element, '')).toThrow(
        'className must be a non-empty string'
      );
    });
    
    it('should throw error if className is not a string', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.addClass(element, 123)).toThrow(
        'className must be a non-empty string'
      );
    });
  });
  
  describe('removeClass', () => {
    it('should remove class from element', () => {
      const element = domManipulator.getTextSelection();
      element.classList.add('test-class');
      
      domManipulator.removeClass(element, 'test-class');
      
      expect(element.classList.contains('test-class')).toBe(false);
    });
    
    it('should throw error if element is null', () => {
      expect(() => domManipulator.removeClass(null, 'test-class')).toThrow(
        'Cannot remove class from null element'
      );
    });
    
    it('should throw error if className is empty', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.removeClass(element, '')).toThrow(
        'className must be a non-empty string'
      );
    });
    
    it('should not throw error if class does not exist', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.removeClass(element, 'nonexistent')).not.toThrow();
    });
  });
  
  describe('toggleClass', () => {
    it('should add class if not present', () => {
      const element = domManipulator.getTextSelection();
      const result = domManipulator.toggleClass(element, 'test-class');
      
      expect(result).toBe(true);
      expect(element.classList.contains('test-class')).toBe(true);
    });
    
    it('should remove class if present', () => {
      const element = domManipulator.getTextSelection();
      element.classList.add('test-class');
      
      const result = domManipulator.toggleClass(element, 'test-class');
      
      expect(result).toBe(false);
      expect(element.classList.contains('test-class')).toBe(false);
    });
    
    it('should throw error if element is null', () => {
      expect(() => domManipulator.toggleClass(null, 'test-class')).toThrow(
        'Cannot toggle class on null element'
      );
    });
    
    it('should throw error if className is empty', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.toggleClass(element, '')).toThrow(
        'className must be a non-empty string'
      );
    });
  });
  
  describe('hasClass', () => {
    it('should return true if element has class', () => {
      const element = domManipulator.getTextSelection();
      element.classList.add('test-class');
      
      expect(domManipulator.hasClass(element, 'test-class')).toBe(true);
    });
    
    it('should return false if element does not have class', () => {
      const element = domManipulator.getTextSelection();
      
      expect(domManipulator.hasClass(element, 'test-class')).toBe(false);
    });
    
    it('should throw error if element is null', () => {
      expect(() => domManipulator.hasClass(null, 'test-class')).toThrow(
        'Cannot check class on null element'
      );
    });
    
    it('should throw error if className is empty', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.hasClass(element, '')).toThrow(
        'className must be a non-empty string'
      );
    });
  });
  
  describe('removeClassesWithPrefix', () => {
    it('should remove all classes with matching prefix', () => {
      const element = domManipulator.getTextSelection();
      element.classList.add('demo-state-1');
      element.classList.add('demo-state-2');
      element.classList.add('other-class');
      
      domManipulator.removeClassesWithPrefix(element, 'demo-state-');
      
      expect(element.classList.contains('demo-state-1')).toBe(false);
      expect(element.classList.contains('demo-state-2')).toBe(false);
      expect(element.classList.contains('other-class')).toBe(true);
    });
    
    it('should not throw error if no classes match prefix', () => {
      const element = domManipulator.getTextSelection();
      
      expect(() => domManipulator.removeClassesWithPrefix(element, 'nonexistent-')).not.toThrow();
    });
    
    it('should throw error if element is null', () => {
      expect(() => domManipulator.removeClassesWithPrefix(null, 'demo-')).toThrow(
        'Cannot remove classes from null element'
      );
    });
    
    it('should throw error if prefix is empty', () => {
      const element = domManipulator.getTextSelection();
      expect(() => domManipulator.removeClassesWithPrefix(element, '')).toThrow(
        'prefix must be a non-empty string'
      );
    });
  });
  
  // ============================================================================
  // Utility Method Tests
  // ============================================================================
  
  describe('utility methods', () => {
    it('should clear element cache', () => {
      domManipulator.clearCache();
      
      // Elements should still be queryable (will re-cache)
      expect(domManipulator.getTextSelection()).toBeTruthy();
    });
    
    it('should refresh element cache', () => {
      const oldElement = domManipulator.getTextSelection();
      
      // Remove and re-add element
      const parent = oldElement.parentNode;
      parent.removeChild(oldElement);
      
      const newElement = document.createElement('div');
      newElement.className = 'demo-text-selection';
      parent.appendChild(newElement);
      
      domManipulator.refreshCache();
      
      const refreshedElement = domManipulator.getTextSelection();
      expect(refreshedElement).not.toBe(oldElement);
      expect(refreshedElement).toBe(newElement);
    });
    
    it('should return root element', () => {
      expect(domManipulator.getRoot()).toBe(rootElement);
    });
    
    it('should validate all elements exist', () => {
      const validation = domManipulator.validateElements();
      
      expect(validation.textSelection).toBe(true);
      expect(validation.keyboardIndicator).toBe(true);
      expect(validation.appWindow).toBe(true);
      expect(validation.quickActionButton).toBe(true);
      expect(validation.replacementText).toBe(true);
    });
    
    it('should return missing elements', () => {
      const emptyRoot = document.createElement('div');
      const emptyManipulator = new DOMManipulator(emptyRoot, selectors);
      
      const missing = emptyManipulator.getMissingElements();
      
      expect(missing).toContain('textSelection');
      expect(missing).toContain('keyboardIndicator');
      expect(missing).toContain('appWindow');
      expect(missing).toContain('quickActionButton');
      expect(missing).toContain('replacementText');
      expect(missing.length).toBe(5);
    });
    
    it('should return empty array if no elements are missing', () => {
      const missing = domManipulator.getMissingElements();
      
      expect(missing).toEqual([]);
    });
  });
  
  // ============================================================================
  // Animation Helper Method Tests
  // ============================================================================
  
  describe('animation helper methods', () => {
    let timingManager;
    let domManipulatorWithTiming;
    
    beforeEach(() => {
      timingManager = new TimingManager();
      domManipulatorWithTiming = new DOMManipulator(rootElement, selectors, timingManager);
    });
    
    afterEach(() => {
      timingManager.destroy();
    });
    
    describe('animateSelection', () => {
      it('should throw error if element is null', () => {
        expect(() => {
          domManipulatorWithTiming.animateSelection(null, 300);
        }).toThrow('Cannot animate selection on null element');
      });
      
      it('should throw error if timingManager is not available', () => {
        const manipulatorWithoutTiming = new DOMManipulator(rootElement, selectors);
        const element = manipulatorWithoutTiming.getTextSelection();
        
        expect(() => {
          manipulatorWithoutTiming.animateSelection(element, 300);
        }).toThrow('TimingManager is required for animations');
      });
      
      it('should throw error if duration is not a positive number', () => {
        const element = domManipulatorWithTiming.getTextSelection();
        
        expect(() => {
          domManipulatorWithTiming.animateSelection(element, 0);
        }).toThrow('duration must be a positive number');
        
        expect(() => {
          domManipulatorWithTiming.animateSelection(element, -100);
        }).toThrow('duration must be a positive number');
        
        expect(() => {
          domManipulatorWithTiming.animateSelection(element, 'invalid');
        }).toThrow('duration must be a positive number');
      });
      
      it('should animate selection from 0% to 100%', async () => {
        const element = domManipulatorWithTiming.getTextSelection();
        const duration = 100;
        
        const animationPromise = domManipulatorWithTiming.animateSelection(element, duration);
        
        // Check that animation started
        await timingManager.delay(10);
        const midProgress = element.style.getPropertyValue('--selection-progress');
        expect(midProgress).toBeTruthy();
        
        // Wait for animation to complete
        await animationPromise;
        
        // Check final state
        const finalProgress = element.style.getPropertyValue('--selection-progress');
        expect(finalProgress).toBe('100%');
      });
      
      it('should return a Promise that resolves when animation completes', async () => {
        const element = domManipulatorWithTiming.getTextSelection();
        const startTime = performance.now();
        
        await domManipulatorWithTiming.animateSelection(element, 100);
        
        const elapsed = performance.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90); // Allow some tolerance
        expect(elapsed).toBeLessThan(200); // Should not take too long
      });
    });
    
    describe('animatePress', () => {
      it('should throw error if element is null', () => {
        expect(() => {
          domManipulatorWithTiming.animatePress(null, 300);
        }).toThrow('Cannot animate press on null element');
      });
      
      it('should throw error if timingManager is not available', () => {
        const manipulatorWithoutTiming = new DOMManipulator(rootElement, selectors);
        const element = manipulatorWithoutTiming.getKeyboardIndicator();
        
        expect(() => {
          manipulatorWithoutTiming.animatePress(element, 300);
        }).toThrow('TimingManager is required for animations');
      });
      
      it('should throw error if duration is not a positive number', () => {
        const element = domManipulatorWithTiming.getKeyboardIndicator();
        
        expect(() => {
          domManipulatorWithTiming.animatePress(element, 0);
        }).toThrow('duration must be a positive number');
      });
      
      it('should animate press down and release', async () => {
        const element = domManipulatorWithTiming.getKeyboardIndicator();
        const duration = 100;
        
        const animationPromise = domManipulatorWithTiming.animatePress(element, duration);
        
        // Check that animation started (press down phase)
        await timingManager.delay(25);
        const midProgress = parseFloat(element.style.getPropertyValue('--press-depth'));
        expect(midProgress).toBeGreaterThan(0);
        
        // Wait for animation to complete
        await animationPromise;
        
        // Check final state (should be reset to 0)
        const finalProgress = element.style.getPropertyValue('--press-depth');
        expect(finalProgress).toBe('0');
      });
      
      it('should return a Promise that resolves when animation completes', async () => {
        const element = domManipulatorWithTiming.getKeyboardIndicator();
        const startTime = performance.now();
        
        await domManipulatorWithTiming.animatePress(element, 100);
        
        const elapsed = performance.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(elapsed).toBeLessThan(200);
      });
    });
    
    describe('animateFadeIn', () => {
      it('should throw error if element is null', () => {
        expect(() => {
          domManipulatorWithTiming.animateFadeIn(null, 300);
        }).toThrow('Cannot animate fade in on null element');
      });
      
      it('should throw error if timingManager is not available', () => {
        const manipulatorWithoutTiming = new DOMManipulator(rootElement, selectors);
        const element = manipulatorWithoutTiming.getAppWindow();
        
        expect(() => {
          manipulatorWithoutTiming.animateFadeIn(element, 300);
        }).toThrow('TimingManager is required for animations');
      });
      
      it('should throw error if duration is not a positive number', () => {
        const element = domManipulatorWithTiming.getAppWindow();
        
        expect(() => {
          domManipulatorWithTiming.animateFadeIn(element, -100);
        }).toThrow('duration must be a positive number');
      });
      
      it('should animate opacity from 0 to 1', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        const duration = 100;
        
        const animationPromise = domManipulatorWithTiming.animateFadeIn(element, duration);
        
        // Check initial state
        expect(element.style.opacity).toBe('0');
        
        // Check mid-animation
        await timingManager.delay(50);
        const midOpacity = parseFloat(element.style.opacity);
        expect(midOpacity).toBeGreaterThan(0);
        expect(midOpacity).toBeLessThan(1);
        
        // Wait for animation to complete
        await animationPromise;
        
        // Check final state
        expect(element.style.opacity).toBe('1');
      });
      
      it('should return a Promise that resolves when animation completes', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        const startTime = performance.now();
        
        await domManipulatorWithTiming.animateFadeIn(element, 100);
        
        const elapsed = performance.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(elapsed).toBeLessThan(200);
      });
    });
    
    describe('animateFadeOut', () => {
      it('should throw error if element is null', () => {
        expect(() => {
          domManipulatorWithTiming.animateFadeOut(null, 300);
        }).toThrow('Cannot animate fade out on null element');
      });
      
      it('should throw error if timingManager is not available', () => {
        const manipulatorWithoutTiming = new DOMManipulator(rootElement, selectors);
        const element = manipulatorWithoutTiming.getReplacementText();
        
        expect(() => {
          manipulatorWithoutTiming.animateFadeOut(element, 300);
        }).toThrow('TimingManager is required for animations');
      });
      
      it('should throw error if duration is not a positive number', () => {
        const element = domManipulatorWithTiming.getReplacementText();
        
        expect(() => {
          domManipulatorWithTiming.animateFadeOut(element, 0);
        }).toThrow('duration must be a positive number');
      });
      
      it('should animate opacity from 1 to 0', async () => {
        const element = domManipulatorWithTiming.getReplacementText();
        element.style.opacity = '1'; // Set initial opacity
        const duration = 100;
        
        const animationPromise = domManipulatorWithTiming.animateFadeOut(element, duration);
        
        // Check mid-animation
        await timingManager.delay(50);
        const midOpacity = parseFloat(element.style.opacity);
        expect(midOpacity).toBeGreaterThan(0);
        expect(midOpacity).toBeLessThan(1);
        
        // Wait for animation to complete
        await animationPromise;
        
        // Check final state
        expect(element.style.opacity).toBe('0');
      });
      
      it('should return a Promise that resolves when animation completes', async () => {
        const element = domManipulatorWithTiming.getReplacementText();
        const startTime = performance.now();
        
        await domManipulatorWithTiming.animateFadeOut(element, 100);
        
        const elapsed = performance.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(elapsed).toBeLessThan(200);
      });
    });
    
    describe('animateScale', () => {
      it('should throw error if element is null', () => {
        expect(() => {
          domManipulatorWithTiming.animateScale(null, 0.8, 1.0, 300);
        }).toThrow('Cannot animate scale on null element');
      });
      
      it('should throw error if timingManager is not available', () => {
        const manipulatorWithoutTiming = new DOMManipulator(rootElement, selectors);
        const element = manipulatorWithoutTiming.getAppWindow();
        
        expect(() => {
          manipulatorWithoutTiming.animateScale(element, 0.8, 1.0, 300);
        }).toThrow('TimingManager is required for animations');
      });
      
      it('should throw error if from or to are not numbers', () => {
        const element = domManipulatorWithTiming.getAppWindow();
        
        expect(() => {
          domManipulatorWithTiming.animateScale(element, 'invalid', 1.0, 300);
        }).toThrow('from and to must be numbers');
        
        expect(() => {
          domManipulatorWithTiming.animateScale(element, 0.8, 'invalid', 300);
        }).toThrow('from and to must be numbers');
      });
      
      it('should throw error if duration is not a positive number', () => {
        const element = domManipulatorWithTiming.getAppWindow();
        
        expect(() => {
          domManipulatorWithTiming.animateScale(element, 0.8, 1.0, 0);
        }).toThrow('duration must be a positive number');
      });
      
      it('should animate scale from start to end value', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        const from = 0.5;
        const to = 1.0;
        const duration = 100;
        
        const animationPromise = domManipulatorWithTiming.animateScale(element, from, to, duration);
        
        // Check mid-animation
        await timingManager.delay(50);
        const midTransform = element.style.transform;
        expect(midTransform).toContain('scale');
        
        // Extract scale value from transform
        const scaleMatch = midTransform.match(/scale\(([\d.]+)\)/);
        if (scaleMatch) {
          const midScale = parseFloat(scaleMatch[1]);
          expect(midScale).toBeGreaterThan(from);
          expect(midScale).toBeLessThan(to);
        }
        
        // Wait for animation to complete
        await animationPromise;
        
        // Check final state
        expect(element.style.transform).toBe(`scale(${to})`);
      });
      
      it('should work with scale down animation', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        const from = 1.0;
        const to = 0.5;
        
        await domManipulatorWithTiming.animateScale(element, from, to, 100);
        
        expect(element.style.transform).toBe(`scale(${to})`);
      });
      
      it('should return a Promise that resolves when animation completes', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        const startTime = performance.now();
        
        await domManipulatorWithTiming.animateScale(element, 0.8, 1.0, 100);
        
        const elapsed = performance.now() - startTime;
        expect(elapsed).toBeGreaterThanOrEqual(90);
        expect(elapsed).toBeLessThan(200);
      });
    });
    
    describe('animation integration', () => {
      it('should allow chaining multiple animations', async () => {
        const element = domManipulatorWithTiming.getAppWindow();
        
        // Chain fade in and scale animations
        await domManipulatorWithTiming.animateFadeIn(element, 50);
        await domManipulatorWithTiming.animateScale(element, 0.8, 1.0, 50);
        
        expect(element.style.opacity).toBe('1');
        expect(element.style.transform).toBe('scale(1)');
      });
      
      it('should handle multiple simultaneous animations on different elements', async () => {
        const element1 = domManipulatorWithTiming.getTextSelection();
        const element2 = domManipulatorWithTiming.getAppWindow();
        
        // Start animations simultaneously
        const promise1 = domManipulatorWithTiming.animateSelection(element1, 100);
        const promise2 = domManipulatorWithTiming.animateFadeIn(element2, 100);
        
        // Wait for both to complete
        await Promise.all([promise1, promise2]);
        
        expect(element1.style.getPropertyValue('--selection-progress')).toBe('100%');
        expect(element2.style.opacity).toBe('1');
      });
    });
  });
});
