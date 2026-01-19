/**
 * Animated Demo Bundle - Hero Section Animation
 * Flow: text selection → keyboard → app appears → button click → AI response → variations → replace → text swap
 */

(function() {
  'use strict';

  const config = {
    timing: {
      selectionDuration: 1000,
      selectionPause: 600,
      keyboardShowDuration: 300,
      keyboardPressDuration: 400,
      keyboardHideDuration: 200,
      appAppearDuration: 400,
      greetingDelay: 400,
      buttonHighlightDelay: 600,
      buttonClickDuration: 150,
      buttonLoadingDuration: 1200,
      aiResponseDelay: 400,
      variationsAppearDelay: 300,
      replaceHighlightDelay: 1000,
      replaceClickDuration: 200,
      textReplaceDuration: 400,
      successDuration: 2000,
      loopDelay: 2500,
    },
    classes: {
      textSelecting: 'demo-text-selecting',
      textSelected: 'demo-text-selected',
      textReplaced: 'demo-text-replaced',
      keyboardVisible: 'demo-keyboard-visible',
      keyboardPressed: 'demo-keyboard-pressed',
      appVisible: 'demo-app-visible',
      elementVisible: 'demo-visible',
      buttonHighlighted: 'demo-button-highlighted',
      buttonPressed: 'demo-button-pressed',
      buttonLoading: 'demo-button-loading',
      variationsVisible: 'demo-variations-visible',
    },
  };

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  class HeroDemoAnimation {
    constructor() {
      this.isRunning = false;
      this.isPaused = false;
      this.elements = {};
    }

    init() {
      const root = document.querySelector('.hero-demo[data-demo-animation]');
      if (!root) {
        console.warn('Hero demo container not found');
        return false;
      }

      this.elements = {
        root,
        textSelection: root.querySelector('.demo-text-selection'),
        keyboardIndicator: root.querySelector('.demo-keyboard-indicator'),
        appWindow: root.querySelector('.demo-app-window'),
        aiGreeting: root.querySelector('.demo-ai-greeting'),
        aiResponse: root.querySelector('.demo-ai-response'),
        quickAction: root.querySelector('.demo-quick-action'),
        variations: root.querySelector('.demo-variations'),
        replaceBtn: root.querySelector('.demo-replace-btn'),
      };

      // Check reduced motion
      if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
        this.showStaticState();
        return true;
      }

      console.log('Hero demo animation initialized');
      return true;
    }

    showStaticState() {
      const { textSelection, appWindow, aiGreeting, aiResponse, variations } = this.elements;
      if (textSelection) textSelection.classList.add(config.classes.textSelected);
      if (appWindow) appWindow.classList.add(config.classes.appVisible);
      if (aiGreeting) aiGreeting.classList.add(config.classes.elementVisible);
      if (aiResponse) aiResponse.classList.add(config.classes.elementVisible);
      if (variations) variations.classList.add(config.classes.variationsVisible);
    }

    async start() {
      if (this.isRunning) return;
      this.isRunning = true;
      this.isPaused = false;
      console.log('Hero demo animation started');
      this.runLoop();
    }

    pause() { this.isPaused = true; }
    resume() { if (this.isPaused) { this.isPaused = false; this.runLoop(); } }

    async runLoop() {
      while (this.isRunning && !this.isPaused) {
        await this.runAnimationCycle();
        if (this.isRunning && !this.isPaused) {
          await delay(config.timing.loopDelay);
        }
      }
    }

    async runAnimationCycle() {
      try {
        this.resetAllStates();
        await delay(500);

        // Step 1: Text Selection
        await this.animateTextSelection();
        if (!this.isRunning || this.isPaused) return;

        // Step 2: Keyboard Shortcut
        await this.animateKeyboardShortcut();
        if (!this.isRunning || this.isPaused) return;

        // Step 3: App Window Appears with greeting
        await this.animateAppAppear();
        if (!this.isRunning || this.isPaused) return;

        // Step 4: Quick Action Button Click (Improve Writing)
        await this.animateQuickAction();
        if (!this.isRunning || this.isPaused) return;

        // Step 5: AI Response appears (after button click)
        await this.animateAIResponse();
        if (!this.isRunning || this.isPaused) return;

        // Step 6: Variations Appear
        await this.animateVariationsAppear();
        if (!this.isRunning || this.isPaused) return;

        // Step 7: Replace Text Button Click
        await this.animateReplaceClick();
        if (!this.isRunning || this.isPaused) return;

        // Step 8: Text Gets Replaced
        await this.animateTextReplacement();

      } catch (error) {
        console.error('Animation cycle error:', error);
      }
    }

    resetAllStates() {
      const { textSelection, keyboardIndicator, appWindow, aiGreeting, aiResponse, quickAction, variations, replaceBtn } = this.elements;
      const c = config.classes;

      if (textSelection) {
        textSelection.classList.remove(c.textSelecting, c.textSelected, c.textReplaced);
      }
      if (keyboardIndicator) {
        keyboardIndicator.classList.remove(c.keyboardVisible, c.keyboardPressed);
      }
      if (appWindow) {
        appWindow.classList.remove(c.appVisible);
      }
      if (aiGreeting) {
        aiGreeting.classList.remove(c.elementVisible);
      }
      if (aiResponse) {
        aiResponse.classList.remove(c.elementVisible);
      }
      if (quickAction) {
        quickAction.classList.remove(c.buttonHighlighted, c.buttonPressed, c.buttonLoading);
      }
      if (variations) {
        variations.classList.remove(c.variationsVisible);
      }
      if (replaceBtn) {
        replaceBtn.classList.remove(c.buttonHighlighted, c.buttonPressed);
      }
    }

    async animateTextSelection() {
      const { textSelection } = this.elements;
      if (!textSelection) return;

      textSelection.classList.add(config.classes.textSelecting);
      await delay(config.timing.selectionDuration);
      textSelection.classList.remove(config.classes.textSelecting);
      textSelection.classList.add(config.classes.textSelected);
      await delay(config.timing.selectionPause);
    }

    async animateKeyboardShortcut() {
      const { keyboardIndicator } = this.elements;
      if (!keyboardIndicator) return;

      // Show keyboard
      keyboardIndicator.classList.add(config.classes.keyboardVisible);
      await delay(config.timing.keyboardShowDuration);

      // Press keys
      keyboardIndicator.classList.add(config.classes.keyboardPressed);
      await delay(config.timing.keyboardPressDuration);
      keyboardIndicator.classList.remove(config.classes.keyboardPressed);
      await delay(150);

      // Hide keyboard
      keyboardIndicator.classList.remove(config.classes.keyboardVisible);
      await delay(config.timing.keyboardHideDuration);
    }

    async animateAppAppear() {
      const { appWindow, aiGreeting } = this.elements;
      if (!appWindow) return;

      // App window slides in
      appWindow.classList.add(config.classes.appVisible);
      await delay(config.timing.appAppearDuration);

      // AI greeting appears
      if (aiGreeting) {
        aiGreeting.classList.add(config.classes.elementVisible);
        await delay(config.timing.greetingDelay);
      }
    }

    async animateQuickAction() {
      const { quickAction } = this.elements;
      if (!quickAction) return;

      await delay(config.timing.buttonHighlightDelay);

      // Highlight button
      quickAction.classList.add(config.classes.buttonHighlighted);
      await delay(300);

      // Press button
      quickAction.classList.add(config.classes.buttonPressed);
      await delay(config.timing.buttonClickDuration);
      quickAction.classList.remove(config.classes.buttonPressed);

      // Show loading state
      quickAction.classList.add(config.classes.buttonLoading);
      await delay(config.timing.buttonLoadingDuration);
      quickAction.classList.remove(config.classes.buttonLoading, config.classes.buttonHighlighted);
    }

    async animateAIResponse() {
      const { aiResponse } = this.elements;
      if (!aiResponse) return;

      await delay(config.timing.aiResponseDelay);
      aiResponse.classList.add(config.classes.elementVisible);
      await delay(400);
    }

    async animateVariationsAppear() {
      const { variations } = this.elements;
      if (!variations) return;

      await delay(config.timing.variationsAppearDelay);
      variations.classList.add(config.classes.variationsVisible);
      await delay(600); // Wait for staggered card animations
    }

    async animateReplaceClick() {
      const { replaceBtn } = this.elements;
      if (!replaceBtn) return;

      await delay(config.timing.replaceHighlightDelay);

      // Highlight replace button
      replaceBtn.classList.add(config.classes.buttonHighlighted);
      await delay(400);

      // Press button
      replaceBtn.classList.add(config.classes.buttonPressed);
      await delay(config.timing.replaceClickDuration);
      replaceBtn.classList.remove(config.classes.buttonPressed, config.classes.buttonHighlighted);
    }

    async animateTextReplacement() {
      const { textSelection, appWindow } = this.elements;

      // Hide app window first
      if (appWindow) {
        appWindow.classList.remove(config.classes.appVisible);
      }
      await delay(config.timing.textReplaceDuration);

      // Replace the text - this swaps original with replacement
      if (textSelection) {
        textSelection.classList.remove(config.classes.textSelected);
        textSelection.classList.add(config.classes.textReplaced);
      }
      
      // Hold the success state
      await delay(config.timing.successDuration);
    }

    destroy() {
      this.isRunning = false;
      this.isPaused = false;
    }
  }

  // Initialize on DOM ready
  function init() {
    const demo = new HeroDemoAnimation();
    if (demo.init()) {
      setTimeout(() => demo.start(), 800);
      window.demoAnimation = demo;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
