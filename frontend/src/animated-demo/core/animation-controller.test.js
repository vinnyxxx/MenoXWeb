/**
 * Unit tests for AnimationController
 * 
 * Tests initialization, lifecycle methods, state management, and error handling.
 */

import { AnimationController } from './animation-controller.js';
import { animationConfig } from '../config/animation-config.js';

describe('AnimationController', () => {
  let controller;
  let mockRootElement;
  
  beforeEach(() => {
    // Create mock DOM structure
    mockRootElement = document.createElement('div');
    mockRootElement.className = 'demo-window';
    
    // Create mock child elements
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
    
    // Append to document body for querySelector to work
    document.body.appendChild(mockRootElement);
  });
  
  afterEach(() => {
    // Clean up
    if (controller) {
      controller.destroy();
      controller = null;
    }
    
    // Remove mock element from DOM
    if (mockRootElement && mockRootElement.parentNode) {
      mockRootElement.parentNode.removeChild(mockRootElement);
    }
  });
  
  describe('Constructor', () => {
    it('should create controller with default config', () => {
      controller = new AnimationController();
      
      expect(controller).toBeDefined();
      expect(controller.config).toBeDefined();
      expect(controller.isInitialized).toBe(false);
      expect(controller.isRunning).toBe(false);
      expect(controller.isPaused).toBe(false);
    });
    
    it('should create controller with custom config', () => {
      const customConfig = {
        ...animationConfig,
        timing: { ...animationConfig.timing, selectionDuration: 1000 },
      };
      
      controller = new AnimationController(customConfig);
      
      expect(controller.config.timing.selectionDuration).toBe(1000);
    });
    
    it('should create controller with root element', () => {
      controller = new AnimationController(animationConfig, mockRootElement);
      
      expect(controller.rootElement).toBe(mockRootElement);
    });
    
    it('should initialize with null component references', () => {
      controller = new AnimationController();
      
      expect(controller.stateMachine).toBeNull();
      expect(controller.timingManager).toBeNull();
      expect(controller.domManipulator).toBeNull();
      expect(controller.lifecycleManager).toBeNull();
    });
  });
  
  describe('init()', () => {
    it('should initialize all components', () => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      
      expect(controller.isInitialized).toBe(true);
      expect(controller.stateMachine).toBeDefined();
      expect(controller.timingManager).toBeDefined();
      expect(controller.domManipulator).toBeDefined();
      expect(controller.lifecycleManager).toBeDefined();
    });
    
    it('should find root element from config selector if not provided', () => {
      controller = new AnimationController(animationConfig);
      controller.init();
      
      expect(controller.rootElement).toBe(mockRootElement);
      expect(controller.isInitialized).toBe(true);
    });
    
    it('should throw error if root element cannot be found', () => {
      // Remove mock element from DOM
      mockRootElement.parentNode.removeChild(mockRootElement);
      
      controller = new AnimationController(animationConfig);
      
      expect(() => controller.init()).toThrow('AnimationController requires a root element');
    });
    
    it('should warn if already initialized', () => {
      // Mock console.warn to suppress output
      const originalWarn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(args);
      
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      controller.init(); // Second call
      
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0][0]).toBe('AnimationController already initialized');
      
      console.warn = originalWarn;
    });
    
    it('should check initial reduced motion state', () => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      
      expect(typeof controller.isReducedMotion).toBe('boolean');
    });
    
    it('should warn about missing DOM elements but continue', () => {
      // Mock console.warn to suppress output
      const originalWarn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(args);
      
      // Create element with missing children
      const incompleteElement = document.createElement('div');
      incompleteElement.className = 'demo-window';
      document.body.appendChild(incompleteElement);
      
      controller = new AnimationController(animationConfig, incompleteElement);
      controller.init();
      
      expect(controller.isInitialized).toBe(true);
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0][0]).toBe('Missing DOM elements:');
      
      console.warn = originalWarn;
      incompleteElement.parentNode.removeChild(incompleteElement);
    });
  });
  
  describe('start()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
    });
    
    it('should throw error if not initialized', () => {
      const uninitializedController = new AnimationController(animationConfig, mockRootElement);
      
      expect(() => uninitializedController.start()).toThrow(
        'AnimationController must be initialized before starting'
      );
    });
    
    it('should start animation', () => {
      controller.start();
      
      expect(controller.isRunning).toBe(true);
      expect(controller.isPaused).toBe(false);
      expect(controller._animationLoopActive).toBe(true);
    });
    
    it('should warn if already running', () => {
      // Mock console.warn to suppress output
      const originalWarn = console.warn;
      const warnings = [];
      console.warn = (...args) => warnings.push(args);
      
      controller.start();
      controller.start(); // Second call
      
      expect(warnings.length).toBeGreaterThan(0);
      expect(warnings[0][0]).toBe('Animation is already running');
      
      console.warn = originalWarn;
    });
    
    it('should not start if reduced motion is enabled', () => {
      // Mock console.log to suppress output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => logs.push(args);
      
      controller.isReducedMotion = true;
      controller.start();
      
      expect(controller.isRunning).toBe(false);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0][0]).toBe('Animation not started: reduced motion is enabled');
      
      console.log = originalLog;
    });
  });
  
  describe('pause()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      controller.start();
    });
    
    it('should pause running animation', () => {
      controller.pause();
      
      expect(controller.isPaused).toBe(true);
      expect(controller._animationLoopActive).toBe(false);
      expect(controller.isRunning).toBe(true); // Still marked as running
    });
    
    it('should do nothing if not running', () => {
      controller.reset();
      controller.pause();
      
      expect(controller.isPaused).toBe(false);
    });
  });
  
  describe('resume()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      controller.start();
      controller.pause();
    });
    
    it('should resume paused animation', () => {
      controller.resume();
      
      expect(controller.isPaused).toBe(false);
      expect(controller._animationLoopActive).toBe(true);
      expect(controller.isRunning).toBe(true);
    });
    
    it('should do nothing if not paused', () => {
      controller.resume();
      controller.resume(); // Second call when not paused
      
      expect(controller.isPaused).toBe(false);
    });
    
    it('should not resume if reduced motion is enabled', () => {
      // Mock console.log to suppress output
      const originalLog = console.log;
      const logs = [];
      console.log = (...args) => logs.push(args);
      
      controller.isReducedMotion = true;
      controller.resume();
      
      expect(controller.isPaused).toBe(true);
      expect(logs.length).toBeGreaterThan(0);
      expect(logs[0][0]).toBe('Animation not resumed: reduced motion is enabled');
      
      console.log = originalLog;
    });
  });
  
  describe('reset()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      controller.start();
    });
    
    it('should reset animation to initial state', () => {
      controller.loopCount = 5;
      controller.reset();
      
      expect(controller.isRunning).toBe(false);
      expect(controller.isPaused).toBe(false);
      expect(controller._animationLoopActive).toBe(false);
      expect(controller.loopCount).toBe(0);
    });
    
    it('should reset state machine', () => {
      // Track if reset was called by checking state
      const initialState = controller.stateMachine.getCurrentState();
      
      // Manually change state
      controller.stateMachine.currentState = controller.stateMachine.stateMap.get('keyboard-shortcut');
      expect(controller.stateMachine.getCurrentState().name).toBe('keyboard-shortcut');
      
      // Reset should return to initial state
      controller.reset();
      
      expect(controller.stateMachine.getCurrentState().name).toBe(initialState.name);
    });
    
    it('should clear inline styles from elements', () => {
      const textSelection = controller.domManipulator.getTextSelection();
      textSelection.style.opacity = '0.5';
      
      controller.reset();
      
      expect(textSelection.style.cssText).toBe('');
    });
  });
  
  describe('setReducedMotion()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
    });
    
    it('should enable reduced motion and pause animation', () => {
      controller.start();
      controller.setReducedMotion(true);
      
      expect(controller.isReducedMotion).toBe(true);
      expect(controller.isPaused).toBe(true);
    });
    
    it('should disable reduced motion and resume animation', () => {
      controller.start();
      controller.setReducedMotion(true);
      controller.setReducedMotion(false);
      
      expect(controller.isReducedMotion).toBe(false);
      expect(controller.isPaused).toBe(false);
    });
    
    it('should not resume if animation was not running', () => {
      controller.setReducedMotion(true);
      controller.setReducedMotion(false);
      
      expect(controller.isRunning).toBe(false);
    });
  });
  
  describe('transitionTo()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
    });
    
    it('should throw error if state machine not initialized', async () => {
      const uninitializedController = new AnimationController(animationConfig, mockRootElement);
      
      await expect(
        uninitializedController.transitionTo('keyboard-shortcut')
      ).rejects.toThrow('StateMachine not initialized');
    });
    
    it('should throw error for invalid state name', async () => {
      await expect(
        controller.transitionTo('invalid-state')
      ).rejects.toThrow('State "invalid-state" not found');
    });
    
    it('should transition to target state', async () => {
      const initialState = controller.getCurrentState();
      expect(initialState.name).toBe('text-selection');
      
      await controller.transitionTo('keyboard-shortcut');
      
      const currentState = controller.getCurrentState();
      expect(currentState.name).toBe('keyboard-shortcut');
    });
  });
  
  describe('getCurrentState()', () => {
    it('should return null if state machine not initialized', () => {
      controller = new AnimationController(animationConfig, mockRootElement);
      
      expect(controller.getCurrentState()).toBeNull();
    });
    
    it('should return current state', () => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      
      const state = controller.getCurrentState();
      expect(state).toBeDefined();
      expect(state.name).toBe('text-selection');
    });
  });
  
  describe('getStateData()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
    });
    
    it('should return complete state data', () => {
      const stateData = controller.getStateData();
      
      expect(stateData).toEqual({
        currentState: 'text-selection',
        isRunning: false,
        isPaused: false,
        isReducedMotion: expect.any(Boolean),
        loopCount: 0,
        isInitialized: true,
      });
    });
    
    it('should reflect running state', () => {
      controller.start();
      const stateData = controller.getStateData();
      
      expect(stateData.isRunning).toBe(true);
    });
    
    it('should reflect paused state', () => {
      controller.start();
      controller.pause();
      const stateData = controller.getStateData();
      
      expect(stateData.isPaused).toBe(true);
    });
  });
  
  describe('destroy()', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
      controller.start();
    });
    
    it('should stop animation', () => {
      controller.destroy();
      
      expect(controller.isRunning).toBe(false);
      expect(controller._animationLoopActive).toBe(false);
    });
    
    it('should detach lifecycle listeners', () => {
      // Track if detachListeners was called by checking internal state
      const lifecycleManager = controller.lifecycleManager;
      
      // Verify listeners are attached
      expect(lifecycleManager.visibilityChangeHandler).not.toBeNull();
      
      controller.destroy();
      
      // After destroy, handlers should be null
      expect(lifecycleManager.visibilityChangeHandler).toBeNull();
    });
    
    it('should clean up timing manager', () => {
      // Track if destroy was called by checking internal state
      const timingManager = controller.timingManager;
      
      // Add some active frames
      timingManager.scheduleFrame(() => {});
      expect(timingManager._activeFrames.size).toBeGreaterThan(0);
      
      controller.destroy();
      
      // After destroy, active frames should be cleared
      expect(timingManager._activeFrames.size).toBe(0);
    });
    
    it('should clear component references', () => {
      controller.destroy();
      
      expect(controller.stateMachine).toBeNull();
      expect(controller.timingManager).toBeNull();
      expect(controller.domManipulator).toBeNull();
      expect(controller.lifecycleManager).toBeNull();
    });
    
    it('should mark as not initialized', () => {
      controller.destroy();
      
      expect(controller.isInitialized).toBe(false);
    });
  });
  
  describe('Animation Loop', () => {
    beforeEach(() => {
      controller = new AnimationController(animationConfig, mockRootElement);
      controller.init();
    });
    
    it('should increment loop count after completing a cycle', async () => {
      // Directly modify state durations to be very short for testing
      const states = controller.stateMachine.states;
      const originalDurations = states.map(s => s.duration);
      
      // Set all durations to 5ms for fast testing
      states.forEach(state => {
        state.duration = 5;
      });
      
      controller.start();
      
      // Wait for at least one complete loop (6 states * 5ms = 30ms + buffer)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should have completed at least one loop
      expect(controller.loopCount).toBeGreaterThan(0);
      
      controller.reset();
      
      // Restore original durations
      states.forEach((state, i) => {
        state.duration = originalDurations[i];
      });
    });
    
    it('should handle errors in animation loop gracefully', async () => {
      // Mock console.error to capture errors
      const originalError = console.error;
      const errors = [];
      console.error = (...args) => errors.push(args);
      
      // Set very short durations for fast testing
      const states = controller.stateMachine.states;
      const originalDurations = states.map(s => s.duration);
      states.forEach(state => {
        state.duration = 5;
      });
      
      // Make transition throw an error once
      const originalTransition = controller.stateMachine.transition.bind(controller.stateMachine);
      let errorThrown = false;
      controller.stateMachine.transition = async function() {
        if (!errorThrown) {
          errorThrown = true;
          throw new Error('Test error');
        }
        return originalTransition();
      };
      
      controller.start();
      
      // Wait for error to occur (need enough time for at least one transition)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should have captured at least one error
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0][0]).toBe('Error in animation loop:');
      
      console.error = originalError;
      controller.reset();
      
      // Restore original durations
      states.forEach((state, i) => {
        state.duration = originalDurations[i];
      });
    });
    
    it('should stop loop when paused', async () => {
      controller.start();
      
      // Wait a bit then pause
      await new Promise(resolve => setTimeout(resolve, 20));
      controller.pause();
      
      const loopCountAfterPause = controller.loopCount;
      
      // Wait more time
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Loop count should not have increased
      expect(controller.loopCount).toBe(loopCountAfterPause);
      
      controller.reset();
    });
  });
});
