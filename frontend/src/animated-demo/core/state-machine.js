/**
 * State Machine
 * 
 * Defines animation states and manages state transitions for the animated demo.
 * Each state represents a step in the workflow demonstration.
 * 
 * @module state-machine
 */

import { animationConfig } from '../config/animation-config.js';

/**
 * @typedef {Object} AnimationState
 * @property {string} name - Unique identifier for the state
 * @property {number} duration - Total duration of the state in milliseconds
 * @property {Function} enter - Function called when entering this state
 * @property {Function} exit - Function called when exiting this state
 * @property {string} next - Name of the next state in the sequence
 */

/**
 * State 1: Text Selection
 * Animates text highlight from left to right
 * 
 * @type {AnimationState}
 */
export const textSelectionState = {
  name: 'text-selection',
  duration: animationConfig.timing.selectionDuration + animationConfig.timing.selectionPause,
  enter: async (elements) => {
    // Animate text selection from left to right over 600ms
    // Validates: Requirements 2.1, 2.2, 2.3
    if (!elements || !elements.domManipulator) {
      console.error('DOMManipulator not available in elements');
      return;
    }
    
    const textSelection = elements.domManipulator.getTextSelection();
    if (!textSelection) {
      console.error('Text selection element not found');
      return;
    }
    
    // Add selecting class to indicate animation is in progress
    elements.domManipulator.addClass(textSelection, animationConfig.classes.textSelecting);
    
    // Animate selection from left to right
    await elements.domManipulator.animateSelection(
      textSelection,
      animationConfig.timing.selectionDuration
    );
    
    // Add selected class and remove selecting class
    elements.domManipulator.removeClass(textSelection, animationConfig.classes.textSelecting);
    elements.domManipulator.addClass(textSelection, animationConfig.classes.textSelected);
    
    // Wait for the selection pause duration (1000ms) before transitioning
    if (elements.timingManager) {
      await elements.timingManager.delay(animationConfig.timing.selectionPause);
    }
  },
  exit: async (elements) => {
    // Maintain selection visibility - no action needed
    // The selection should remain visible as we transition to the next state
    // Validates: Requirements 2.3
  },
  next: 'keyboard-shortcut',
};

/**
 * State 2: Keyboard Shortcut
 * Shows and animates the Cmd+` keyboard indicator
 * 
 * @type {AnimationState}
 */
export const keyboardShortcutState = {
  name: 'keyboard-shortcut',
  duration: animationConfig.timing.keyboardPressDuration + animationConfig.timing.keyboardFadeOut,
  enter: async (elements) => {
    // Show indicator, animate press (300ms), fade out (200ms)
    // Validates: Requirements 3.1, 3.2, 3.3
    if (!elements || !elements.domManipulator) {
      console.error('DOMManipulator not available in elements');
      return;
    }
    
    const keyboardIndicator = elements.domManipulator.getKeyboardIndicator();
    if (!keyboardIndicator) {
      console.error('Keyboard indicator element not found');
      return;
    }
    
    // Show the keyboard indicator
    elements.domManipulator.addClass(keyboardIndicator, animationConfig.classes.keyboardVisible);
    
    // Animate the press effect over 300ms
    await elements.domManipulator.animatePress(
      keyboardIndicator,
      animationConfig.timing.keyboardPressDuration
    );
    
    // Fade out the indicator over 200ms
    await elements.domManipulator.animateFadeOut(
      keyboardIndicator,
      animationConfig.timing.keyboardFadeOut
    );
  },
  exit: async (elements) => {
    // Ensure indicator is hidden and clean up classes
    // Validates: Requirements 3.3
    if (!elements || !elements.domManipulator) {
      return;
    }
    
    const keyboardIndicator = elements.domManipulator.getKeyboardIndicator();
    if (!keyboardIndicator) {
      return;
    }
    
    // Remove visibility class to ensure indicator is hidden
    elements.domManipulator.removeClass(keyboardIndicator, animationConfig.classes.keyboardVisible);
    
    // Reset opacity to ensure clean state for next loop
    keyboardIndicator.style.opacity = '';
  },
  next: 'app-appearance',
};

/**
 * State 3: App Appearance
 * Scales and fades in the MenoX app window
 * 
 * @type {AnimationState}
 */
export const appAppearanceState = {
  name: 'app-appearance',
  duration: animationConfig.timing.appAppearDuration + animationConfig.timing.appPause,
  enter: async (elements) => {
    // Scale and fade in app window over 400ms, then wait 800ms
    // Validates: Requirements 4.1, 4.2, 4.3
    if (!elements || !elements.domManipulator) {
      console.error('DOMManipulator not available in elements');
      return;
    }
    
    const appWindow = elements.domManipulator.getAppWindow();
    if (!appWindow) {
      console.error('App window element not found');
      return;
    }
    
    // Add visibility class to show the app window
    elements.domManipulator.addClass(appWindow, animationConfig.classes.appVisible);
    
    // Add entering class to indicate animation is in progress
    elements.domManipulator.addClass(appWindow, animationConfig.classes.appEntering);
    
    // Run scale and fade animations in parallel
    await Promise.all([
      elements.domManipulator.animateScale(
        appWindow,
        0.8,  // from scale
        1.0,  // to scale
        animationConfig.timing.appAppearDuration
      ),
      elements.domManipulator.animateFadeIn(
        appWindow,
        animationConfig.timing.appAppearDuration
      )
    ]);
    
    // Remove entering class after animation completes
    elements.domManipulator.removeClass(appWindow, animationConfig.classes.appEntering);
    
    // Wait for the app pause duration (800ms) before transitioning
    if (elements.timingManager) {
      await elements.timingManager.delay(animationConfig.timing.appPause);
    }
  },
  exit: async (elements) => {
    // Maintain app visibility - no action needed
    // The app window should remain visible as we transition to the next state
    // Validates: Requirements 4.3
  },
  next: 'quick-action',
};

/**
 * State 4: Quick Action
 * Highlights and clicks the quick action button
 * 
 * @type {AnimationState}
 */
export const quickActionState = {
  name: 'quick-action',
  duration: animationConfig.timing.buttonClickDuration + animationConfig.timing.buttonLoadingDuration,
  enter: async (elements) => {
    // Highlight button, animate click (200ms), show loading (500ms)
    // Validates: Requirements 5.1, 5.2, 5.3, 5.4
    if (!elements || !elements.domManipulator) {
      console.error('DOMManipulator not available in elements');
      return;
    }
    
    const quickActionButton = elements.domManipulator.getQuickActionButton();
    if (!quickActionButton) {
      console.error('Quick action button element not found');
      return;
    }
    
    // Step 1: Highlight the button
    elements.domManipulator.addClass(quickActionButton, animationConfig.classes.buttonHighlighted);
    
    // Step 2: Animate click effect over 200ms
    // Add pressed class to trigger visual press effect
    elements.domManipulator.addClass(quickActionButton, animationConfig.classes.buttonPressed);
    
    // Wait for click animation duration
    if (elements.timingManager) {
      await elements.timingManager.delay(animationConfig.timing.buttonClickDuration);
    }
    
    // Remove pressed class after click animation
    elements.domManipulator.removeClass(quickActionButton, animationConfig.classes.buttonPressed);
    
    // Step 3: Show loading state for 500ms
    elements.domManipulator.addClass(quickActionButton, animationConfig.classes.buttonLoading);
    
    // Wait for loading duration
    if (elements.timingManager) {
      await elements.timingManager.delay(animationConfig.timing.buttonLoadingDuration);
    }
  },
  exit: async (elements) => {
    // Remove loading state
    // Validates: Requirements 5.4
    if (!elements || !elements.domManipulator) {
      return;
    }
    
    const quickActionButton = elements.domManipulator.getQuickActionButton();
    if (!quickActionButton) {
      return;
    }
    
    // Remove loading class
    elements.domManipulator.removeClass(quickActionButton, animationConfig.classes.buttonLoading);
    
    // Remove highlight class to clean up for next loop
    elements.domManipulator.removeClass(quickActionButton, animationConfig.classes.buttonHighlighted);
  },
  next: 'text-replacement',
};

/**
 * State 5: Text Replacement
 * Fades out original text and fades in AI-generated replacement
 * 
 * @type {AnimationState}
 */
export const textReplacementState = {
  name: 'text-replacement',
  duration: animationConfig.timing.textFadeOutDuration + 
            animationConfig.timing.textFadeInDuration + 
            animationConfig.timing.successIndicatorDuration,
  enter: async (elements) => {
    // Fade out original text, fade in replacement, show success indicator
    // Validates: Requirements 6.1, 6.2, 6.3
    if (!elements || !elements.domManipulator) {
      console.error('DOMManipulator not available in elements');
      return;
    }
    
    const textSelection = elements.domManipulator.getTextSelection();
    const replacementText = elements.domManipulator.getReplacementText();
    
    if (!textSelection) {
      console.error('Text selection element not found');
      return;
    }
    
    if (!replacementText) {
      console.error('Replacement text element not found');
      return;
    }
    
    // Step 1: Fade out the original text over 300ms
    await elements.domManipulator.animateFadeOut(
      textSelection,
      animationConfig.timing.textFadeOutDuration
    );
    
    // Step 2: Fade in the replacement text over 300ms
    await elements.domManipulator.animateFadeIn(
      replacementText,
      animationConfig.timing.textFadeInDuration
    );
    
    // Step 3: Show success indicator for 800ms
    elements.domManipulator.addClass(replacementText, animationConfig.classes.successIndicator);
    
    // Wait for success indicator duration
    if (elements.timingManager) {
      await elements.timingManager.delay(animationConfig.timing.successIndicatorDuration);
    }
  },
  exit: async (elements) => {
    // Remove success indicator
    // Validates: Requirements 6.3
    if (!elements || !elements.domManipulator) {
      return;
    }
    
    const replacementText = elements.domManipulator.getReplacementText();
    if (!replacementText) {
      return;
    }
    
    // Remove success indicator class
    elements.domManipulator.removeClass(replacementText, animationConfig.classes.successIndicator);
  },
  next: 'loop-delay',
};

/**
 * State 6: Loop Delay
 * Waits before restarting the animation sequence
 * 
 * @type {AnimationState}
 */
export const loopDelayState = {
  name: 'loop-delay',
  duration: animationConfig.timing.loopDelay,
  enter: async (elements) => {
    // Placeholder: Wait before restart
    // No visual changes during this state
  },
  exit: async (elements) => {
    // Placeholder: Prepare for reset
    // Implementation will reset all elements to initial state
  },
  next: 'text-selection', // Loop back to the beginning
};

/**
 * All animation states in order
 * @type {AnimationState[]}
 */
export const animationStates = [
  textSelectionState,
  keyboardShortcutState,
  appAppearanceState,
  quickActionState,
  textReplacementState,
  loopDelayState,
];

/**
 * Get a state by name
 * @param {string} stateName - Name of the state to retrieve
 * @returns {AnimationState|undefined} The state object or undefined if not found
 */
export function getStateByName(stateName) {
  return animationStates.find(state => state.name === stateName);
}

/**
 * Get the initial state
 * @returns {AnimationState} The first state in the sequence
 */
export function getInitialState() {
  return textSelectionState;
}

/**
 * Validate that all states form a complete cycle
 * @returns {boolean} True if the state chain is valid
 */
export function validateStateChain() {
  const visited = new Set();
  let current = getInitialState();
  
  while (current && !visited.has(current.name)) {
    visited.add(current.name);
    current = getStateByName(current.next);
  }
  
  // Valid if we visited all states and ended back at the initial state
  return visited.size === animationStates.length && 
         current === getInitialState();
}

/**
 * StateMachine class
 * Manages state transitions and maintains current state for the animation sequence
 * 
 * Validates: Requirements 1.2, 1.3, 7.1
 */
export class StateMachine {
  /**
   * Create a new StateMachine
   * @param {AnimationState[]} states - Array of animation states
   * @param {string} initialStateName - Name of the initial state
   * @param {Object} elements - DOM elements to pass to state enter/exit functions
   */
  constructor(states, initialStateName, elements = null) {
    this.states = states;
    this.stateMap = new Map(states.map(state => [state.name, state]));
    this.initialStateName = initialStateName;
    this.currentState = this.stateMap.get(initialStateName);
    this.elements = elements;
    
    if (!this.currentState) {
      throw new Error(`Initial state "${initialStateName}" not found in states array`);
    }
  }
  
  /**
   * Get the current state
   * @returns {AnimationState} The current animation state
   */
  getCurrentState() {
    return this.currentState;
  }
  
  /**
   * Transition to the next state
   * Calls exit() on current state, then enter() on next state
   * Handles transition errors gracefully by logging and continuing
   * 
   * @returns {Promise<void>} Resolves when transition is complete
   */
  async transition() {
    const currentState = this.currentState;
    const nextStateName = currentState.next;
    const nextState = this.stateMap.get(nextStateName);
    
    if (!nextState) {
      console.error(`Next state "${nextStateName}" not found. Staying in current state.`);
      return;
    }
    
    try {
      // Call exit on current state
      if (typeof currentState.exit === 'function') {
        await currentState.exit(this.elements);
      }
    } catch (error) {
      // Log error but continue with transition
      console.error(`Error exiting state "${currentState.name}":`, error);
    }
    
    // Update current state
    this.currentState = nextState;
    
    try {
      // Call enter on next state
      if (typeof nextState.enter === 'function') {
        await nextState.enter(this.elements);
      }
    } catch (error) {
      // Log error but continue - state has already been updated
      console.error(`Error entering state "${nextState.name}":`, error);
    }
  }
  
  /**
   * Reset the state machine to the initial state
   * Does not call exit/enter functions, just resets the current state pointer
   * 
   * @returns {void}
   */
  reset() {
    this.currentState = this.stateMap.get(this.initialStateName);
  }
  
  /**
   * Set the DOM elements to pass to state functions
   * @param {Object} elements - DOM elements object
   */
  setElements(elements) {
    this.elements = elements;
  }
}
