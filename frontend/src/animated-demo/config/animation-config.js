/**
 * Animation Configuration
 * 
 * Central configuration for the animated demo feature.
 * Defines timing values, CSS class names, DOM selectors, and feature flags.
 * 
 * @module animation-config
 */

/**
 * @typedef {Object} AnimationConfig
 * @property {Object} timing - Timing configuration in milliseconds
 * @property {Object} classes - CSS class names for animation states
 * @property {Object} selectors - DOM element selectors
 * @property {Object} features - Feature flags
 */

/**
 * Default animation configuration
 * @type {AnimationConfig}
 */
export const animationConfig = {
  // Timing configuration (milliseconds)
  timing: {
    // Text selection animation
    selectionDuration: 600,
    selectionPause: 1000,
    
    // Keyboard shortcut animation
    keyboardPressDuration: 300,
    keyboardFadeOut: 200,
    
    // App window appearance
    appAppearDuration: 400,
    appPause: 800,
    
    // Quick action button
    buttonClickDuration: 200,
    buttonLoadingDuration: 500,
    
    // Text replacement
    textFadeOutDuration: 300,
    textFadeInDuration: 300,
    successIndicatorDuration: 800,
    
    // Loop control
    loopDelay: 2000,
    resetDuration: 400,
  },
  
  // CSS class names
  classes: {
    // Text selection states
    textSelected: 'demo-text-selected',
    textSelecting: 'demo-text-selecting',
    
    // Keyboard indicator states
    keyboardVisible: 'demo-keyboard-visible',
    keyboardPressed: 'demo-keyboard-pressed',
    
    // App window states
    appVisible: 'demo-app-visible',
    appEntering: 'demo-app-entering',
    
    // Button states
    buttonHighlighted: 'demo-button-highlighted',
    buttonPressed: 'demo-button-pressed',
    buttonLoading: 'demo-button-loading',
    
    // Text replacement states
    textReplacing: 'demo-text-replacing',
    textReplaced: 'demo-text-replaced',
    successIndicator: 'demo-success',
  },
  
  // Element selectors
  selectors: {
    demoWindow: '.demo-window',
    textSelection: '.demo-text-selection',
    keyboardIndicator: '.demo-keyboard-indicator',
    appWindow: '.demo-app-window',
    quickActionButton: '.demo-quick-action',
    replacementText: '.demo-replacement-text',
  },
  
  // Feature flags
  features: {
    autoStart: true,
    respectReducedMotion: true,
    pauseOnHidden: true,
    enablePerformanceMonitoring: false,
  },
};

/**
 * Create a custom configuration by merging with defaults
 * @param {Partial<AnimationConfig>} customConfig - Custom configuration to merge
 * @returns {AnimationConfig} Merged configuration
 */
export function createConfig(customConfig = {}) {
  return {
    timing: { ...animationConfig.timing, ...customConfig.timing },
    classes: { ...animationConfig.classes, ...customConfig.classes },
    selectors: { ...animationConfig.selectors, ...customConfig.selectors },
    features: { ...animationConfig.features, ...customConfig.features },
  };
}

export default animationConfig;
