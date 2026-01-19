/**
 * Animation Controller
 * 
 * Orchestrates the entire animation sequence for the animated demo feature.
 * Manages state transitions, handles browser lifecycle events, and coordinates
 * all animation components (StateMachine, TimingManager, DOMManipulator, LifecycleManager).
 * 
 * Validates: Requirements 1.1, 1.2
 * 
 * @module animation-controller
 */

import { StateMachine, animationStates, getInitialState } from './state-machine.js';
import { LifecycleManager } from './lifecycle-manager.js';
import { TimingManager } from '../utils/timing-manager.js';
import { DOMManipulator } from '../utils/dom-manipulator.js';
import { animationConfig as defaultConfig } from '../config/animation-config.js';

/**
 * AnimationController class
 * Central orchestrator for the animated demo feature
 */
export class AnimationController {
  /**
   * Create a new AnimationController
   * @param {Object} config - Animation configuration (optional, uses default if not provided)
   * @param {HTMLElement} rootElement - Root element containing demo (optional, will query from config if not provided)
   */
  constructor(config = defaultConfig, rootElement = null) {
    // Configuration
    this.config = config;
    this.rootElement = rootElement;
    
    // Component references (initialized in init())
    this.stateMachine = null;
    this.timingManager = null;
    this.domManipulator = null;
    this.lifecycleManager = null;
    
    // State tracking
    this.isInitialized = false;
    this.isRunning = false;
    this.isPaused = false;
    this.isReducedMotion = false;
    this.loopCount = 0;
    
    // Internal state
    this._animationLoopActive = false;
    this._currentLoopPromise = null;
  }
  
  /**
   * Initialize all components
   * Sets up StateMachine, TimingManager, DOMManipulator, and LifecycleManager
   * 
   * @throws {Error} If root element cannot be found
   */
  init() {
    if (this.isInitialized) {
      console.warn('AnimationController already initialized');
      return;
    }
    
    // Find root element if not provided
    if (!this.rootElement) {
      const selector = this.config.selectors.demoWindow;
      this.rootElement = document.querySelector(selector);
      
      if (!this.rootElement) {
        throw new Error('AnimationController requires a root element. Could not find element with selector: ' + selector);
      }
    }
    
    // Initialize TimingManager
    this.timingManager = new TimingManager();
    
    // Initialize DOMManipulator
    this.domManipulator = new DOMManipulator(
      this.rootElement,
      this.config.selectors,
      this.timingManager
    );
    
    // Validate DOM elements exist (warn but continue if missing)
    const missingElements = this.domManipulator.getMissingElements();
    if (missingElements.length > 0) {
      console.warn('Missing DOM elements:', missingElements);
    }
    
    // Get DOM elements for state machine
    const elements = {
      textSelection: this.domManipulator.getTextSelection(),
      keyboardIndicator: this.domManipulator.getKeyboardIndicator(),
      appWindow: this.domManipulator.getAppWindow(),
      quickActionButton: this.domManipulator.getQuickActionButton(),
      replacementText: this.domManipulator.getReplacementText(),
    };
    
    // Initialize StateMachine
    const initialState = getInitialState();
    this.stateMachine = new StateMachine(
      animationStates,
      initialState.name,
      elements
    );
    
    // Initialize LifecycleManager
    this.lifecycleManager = new LifecycleManager(this);
    this.lifecycleManager.attachListeners();
    
    // Check initial reduced motion state
    this.isReducedMotion = this.lifecycleManager.isReducedMotion();
    
    this.isInitialized = true;
  }
  
  /**
   * Start the animation sequence
   * Begins the animation loop that cycles through all states
   * 
   * @throws {Error} If controller is not initialized
   */
  start() {
    if (!this.isInitialized) {
      throw new Error('AnimationController must be initialized before starting');
    }
    
    if (this.isRunning) {
      console.warn('Animation is already running');
      return;
    }
    
    if (this.isReducedMotion) {
      console.log('Animation not started: reduced motion is enabled');
      return;
    }
    
    this.isRunning = true;
    this.isPaused = false;
    this._animationLoopActive = true;
    
    // Start the animation loop
    this._runAnimationLoop();
  }
  
  /**
   * Pause the animation
   * Stops the animation loop but maintains current state
   */
  pause() {
    if (!this.isRunning) {
      return;
    }
    
    this.isPaused = true;
    this._animationLoopActive = false;
  }
  
  /**
   * Resume the animation
   * Continues the animation loop from current state
   */
  resume() {
    if (!this.isRunning || !this.isPaused) {
      return;
    }
    
    if (this.isReducedMotion) {
      console.log('Animation not resumed: reduced motion is enabled');
      return;
    }
    
    this.isPaused = false;
    this._animationLoopActive = true;
    
    // Restart the animation loop
    this._runAnimationLoop();
  }
  
  /**
   * Reset the animation to initial state
   * Stops the animation and resets all components
   */
  reset() {
    // Stop animation
    this.isRunning = false;
    this.isPaused = false;
    this._animationLoopActive = false;
    this.loopCount = 0;
    
    // Reset state machine
    if (this.stateMachine) {
      this.stateMachine.reset();
    }
    
    // Clear inline styles from all elements
    if (this.domManipulator) {
      const elements = [
        this.domManipulator.getTextSelection(),
        this.domManipulator.getKeyboardIndicator(),
        this.domManipulator.getAppWindow(),
        this.domManipulator.getQuickActionButton(),
        this.domManipulator.getReplacementText(),
      ];
      
      elements.forEach(element => {
        if (element) {
          element.style.cssText = '';
        }
      });
    }
  }
  
  /**
   * Set reduced motion preference
   * Pauses animation if reduced motion is enabled, resumes if disabled
   * 
   * @param {boolean} isReduced - True if reduced motion is preferred
   */
  setReducedMotion(isReduced) {
    this.isReducedMotion = isReduced;
    
    if (isReduced && this.isRunning) {
      this.pause();
    } else if (!isReduced && this.isRunning && this.isPaused) {
      this.resume();
    }
  }
  
  /**
   * Handle visibility change events
   * Called by LifecycleManager when page visibility changes
   * 
   * @param {boolean} isVisible - True if page is visible
   */
  onVisibilityChange(isVisible) {
    // This method is called by LifecycleManager
    // The LifecycleManager already calls pause/resume, so this is a no-op
    // Kept for potential future use
  }
  
  /**
   * Handle reduced motion change events
   * Called by LifecycleManager when reduced motion preference changes
   * 
   * @param {boolean} isReduced - True if reduced motion is preferred
   */
  onReducedMotionChange(isReduced) {
    this.setReducedMotion(isReduced);
  }
  
  /**
   * Transition to a specific state
   * Delegates to StateMachine for state transition
   * 
   * @param {string} stateName - Name of the state to transition to
   * @throws {Error} If state machine is not initialized or state not found
   */
  async transitionTo(stateName) {
    if (!this.stateMachine) {
      throw new Error('StateMachine not initialized');
    }
    
    // Validate state exists
    const targetState = this.stateMachine.stateMap.get(stateName);
    if (!targetState) {
      throw new Error(`State "${stateName}" not found`);
    }
    
    // Update current state directly
    this.stateMachine.currentState = targetState;
    
    // Call enter function for the new state
    if (typeof targetState.enter === 'function') {
      await targetState.enter(this.stateMachine.elements);
    }
  }
  
  /**
   * Get the current animation state
   * @returns {Object|null} Current state object or null if not initialized
   */
  getCurrentState() {
    if (!this.stateMachine) {
      return null;
    }
    
    return this.stateMachine.getCurrentState();
  }
  
  /**
   * Get complete state data for debugging
   * @returns {Object} State data object
   */
  getStateData() {
    const currentState = this.getCurrentState();
    
    return {
      currentState: currentState ? currentState.name : null,
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      isReducedMotion: this.isReducedMotion,
      loopCount: this.loopCount,
      isInitialized: this.isInitialized,
    };
  }
  
  /**
   * Clean up resources and detach listeners
   */
  destroy() {
    // Stop animation
    this.reset();
    
    // Detach lifecycle listeners
    if (this.lifecycleManager) {
      this.lifecycleManager.detachListeners();
    }
    
    // Clean up timing manager
    if (this.timingManager) {
      this.timingManager.destroy();
    }
    
    // Clear component references
    this.stateMachine = null;
    this.timingManager = null;
    this.domManipulator = null;
    this.lifecycleManager = null;
    
    this.isInitialized = false;
  }
  
  /**
   * Run the animation loop
   * Continuously cycles through states until paused or stopped
   * 
   * @private
   */
  async _runAnimationLoop() {
    while (this._animationLoopActive) {
      try {
        const currentState = this.stateMachine.getCurrentState();
        
        // Wait for state duration
        await this.timingManager.delay(currentState.duration);
        
        // Check if still active (might have been paused during delay)
        if (!this._animationLoopActive) {
          break;
        }
        
        // Transition to next state
        await this.stateMachine.transition();
        
        // Check if we completed a full loop (back to initial state)
        const newState = this.stateMachine.getCurrentState();
        if (newState.name === getInitialState().name) {
          this.loopCount++;
        }
        
      } catch (error) {
        console.error('Error in animation loop:', error);
        // Continue loop despite error
      }
    }
  }
}

export default AnimationController;
