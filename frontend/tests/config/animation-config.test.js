/**
 * Animation Configuration Tests
 * 
 * Unit tests for the animation configuration module.
 */

import { animationConfig, createConfig } from '../../src/animated-demo/config/animation-config.js';

describe('Animation Configuration', () => {
  describe('Default Configuration', () => {
    test('should have all required timing properties', () => {
      expect(animationConfig.timing).toBeDefined();
      expect(animationConfig.timing.selectionDuration).toBe(600);
      expect(animationConfig.timing.selectionPause).toBe(1000);
      expect(animationConfig.timing.keyboardPressDuration).toBe(300);
      expect(animationConfig.timing.keyboardFadeOut).toBe(200);
      expect(animationConfig.timing.appAppearDuration).toBe(400);
      expect(animationConfig.timing.appPause).toBe(800);
      expect(animationConfig.timing.buttonClickDuration).toBe(200);
      expect(animationConfig.timing.buttonLoadingDuration).toBe(500);
      expect(animationConfig.timing.textFadeOutDuration).toBe(300);
      expect(animationConfig.timing.textFadeInDuration).toBe(300);
      expect(animationConfig.timing.successIndicatorDuration).toBe(800);
      expect(animationConfig.timing.loopDelay).toBe(2000);
      expect(animationConfig.timing.resetDuration).toBe(400);
    });

    test('should have all required CSS class names', () => {
      expect(animationConfig.classes).toBeDefined();
      expect(animationConfig.classes.textSelected).toBe('demo-text-selected');
      expect(animationConfig.classes.textSelecting).toBe('demo-text-selecting');
      expect(animationConfig.classes.keyboardVisible).toBe('demo-keyboard-visible');
      expect(animationConfig.classes.keyboardPressed).toBe('demo-keyboard-pressed');
      expect(animationConfig.classes.appVisible).toBe('demo-app-visible');
      expect(animationConfig.classes.appEntering).toBe('demo-app-entering');
      expect(animationConfig.classes.buttonHighlighted).toBe('demo-button-highlighted');
      expect(animationConfig.classes.buttonPressed).toBe('demo-button-pressed');
      expect(animationConfig.classes.buttonLoading).toBe('demo-button-loading');
      expect(animationConfig.classes.textReplacing).toBe('demo-text-replacing');
      expect(animationConfig.classes.textReplaced).toBe('demo-text-replaced');
      expect(animationConfig.classes.successIndicator).toBe('demo-success');
    });

    test('should have all required selectors', () => {
      expect(animationConfig.selectors).toBeDefined();
      expect(animationConfig.selectors.demoWindow).toBe('.demo-window');
      expect(animationConfig.selectors.textSelection).toBe('.demo-text-selection');
      expect(animationConfig.selectors.keyboardIndicator).toBe('.demo-keyboard-indicator');
      expect(animationConfig.selectors.appWindow).toBe('.demo-app-window');
      expect(animationConfig.selectors.quickActionButton).toBe('.demo-quick-action');
      expect(animationConfig.selectors.replacementText).toBe('.demo-replacement-text');
    });

    test('should have all required feature flags', () => {
      expect(animationConfig.features).toBeDefined();
      expect(animationConfig.features.autoStart).toBe(true);
      expect(animationConfig.features.respectReducedMotion).toBe(true);
      expect(animationConfig.features.pauseOnHidden).toBe(true);
      expect(animationConfig.features.enablePerformanceMonitoring).toBe(false);
    });
  });

  describe('createConfig', () => {
    test('should return default config when no custom config provided', () => {
      const config = createConfig();
      expect(config.timing.selectionDuration).toBe(600);
      expect(config.classes.textSelected).toBe('demo-text-selected');
      expect(config.selectors.demoWindow).toBe('.demo-window');
      expect(config.features.autoStart).toBe(true);
    });

    test('should merge custom timing values', () => {
      const config = createConfig({
        timing: {
          selectionDuration: 800,
          loopDelay: 3000,
        },
      });
      expect(config.timing.selectionDuration).toBe(800);
      expect(config.timing.loopDelay).toBe(3000);
      expect(config.timing.selectionPause).toBe(1000); // unchanged
    });

    test('should merge custom class names', () => {
      const config = createConfig({
        classes: {
          textSelected: 'custom-selected',
        },
      });
      expect(config.classes.textSelected).toBe('custom-selected');
      expect(config.classes.textSelecting).toBe('demo-text-selecting'); // unchanged
    });

    test('should merge custom selectors', () => {
      const config = createConfig({
        selectors: {
          demoWindow: '#custom-demo',
        },
      });
      expect(config.selectors.demoWindow).toBe('#custom-demo');
      expect(config.selectors.textSelection).toBe('.demo-text-selection'); // unchanged
    });

    test('should merge custom feature flags', () => {
      const config = createConfig({
        features: {
          autoStart: false,
          enablePerformanceMonitoring: true,
        },
      });
      expect(config.features.autoStart).toBe(false);
      expect(config.features.enablePerformanceMonitoring).toBe(true);
      expect(config.features.respectReducedMotion).toBe(true); // unchanged
    });
  });
});
