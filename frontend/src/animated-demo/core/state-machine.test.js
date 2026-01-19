/**
 * Unit tests for StateMachine class
 * 
 * Tests state transition logic, error handling, and state management
 * Validates: Requirements 1.2, 1.3, 7.1
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { 
  StateMachine, 
  animationStates, 
  getInitialState,
  getStateByName,
  validateStateChain 
} from './state-machine.js';

describe('StateMachine', () => {
  let stateMachine;
  let mockElements;
  let testStates;
  
  beforeEach(() => {
    mockElements = {
      textSelection: document.createElement('div'),
      keyboardIndicator: document.createElement('div'),
      appWindow: document.createElement('div'),
    };
    
    // Create fresh copies of states for each test to avoid mutation issues
    testStates = animationStates.map(state => ({
      ...state,
      enter: state.enter,
      exit: state.exit
    }));
    
    stateMachine = new StateMachine(
      testStates,
      'text-selection',
      mockElements
    );
  });
  
  describe('constructor', () => {
    it('should initialize with the correct initial state', () => {
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
    });
    
    it('should throw error if initial state not found', () => {
      expect(() => {
        new StateMachine(animationStates, 'non-existent-state', mockElements);
      }).toThrow('Initial state "non-existent-state" not found');
    });
    
    it('should store elements reference', () => {
      expect(stateMachine.elements).toBe(mockElements);
    });
    
    it('should create state map for fast lookups', () => {
      expect(stateMachine.stateMap.size).toBe(animationStates.length);
      expect(stateMachine.stateMap.has('text-selection')).toBe(true);
      expect(stateMachine.stateMap.has('keyboard-shortcut')).toBe(true);
    });
  });
  
  describe('getCurrentState', () => {
    it('should return the current state', () => {
      const currentState = stateMachine.getCurrentState();
      expect(currentState.name).toBe('text-selection');
      // Check that it's the same state object structure, not identity
      expect(currentState.name).toBe(getInitialState().name);
      expect(currentState.next).toBe(getInitialState().next);
    });
    
    it('should return updated state after transition', async () => {
      await stateMachine.transition();
      const currentState = stateMachine.getCurrentState();
      expect(currentState.name).toBe('keyboard-shortcut');
    });
  });
  
  describe('transition', () => {
    it('should transition to the next state in sequence', async () => {
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
      
      await stateMachine.transition();
      expect(stateMachine.getCurrentState().name).toBe('keyboard-shortcut');
      
      await stateMachine.transition();
      expect(stateMachine.getCurrentState().name).toBe('app-appearance');
    });
    
    it('should call exit on current state before transition', async () => {
      const exitSpy = jest.fn();
      const currentState = stateMachine.getCurrentState();
      currentState.exit = exitSpy;
      
      await stateMachine.transition();
      
      expect(exitSpy).toHaveBeenCalledWith(mockElements);
      expect(exitSpy).toHaveBeenCalledTimes(1);
    });
    
    it('should call enter on next state after transition', async () => {
      // Get the next state from the state machine's map
      const nextState = stateMachine.stateMap.get('keyboard-shortcut');
      const enterSpy = jest.fn();
      nextState.enter = enterSpy;
      
      await stateMachine.transition();
      
      expect(enterSpy).toHaveBeenCalledWith(mockElements);
      expect(enterSpy).toHaveBeenCalledTimes(1);
    });
    
    it('should handle exit errors gracefully and continue transition', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const currentState = stateMachine.getCurrentState();
      const exitError = new Error('Exit failed');
      // Modify the state in the state machine's map
      currentState.exit = jest.fn().mockRejectedValue(exitError);
      
      await stateMachine.transition();
      
      // Should still transition to next state despite error
      expect(stateMachine.getCurrentState().name).toBe('keyboard-shortcut');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error exiting state "text-selection":',
        exitError
      );
      
      consoleErrorSpy.mockRestore();
    });
    
    it('should handle enter errors gracefully and stay in new state', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      // Get the next state from the state machine's map
      const nextState = stateMachine.stateMap.get('keyboard-shortcut');
      const enterError = new Error('Enter failed');
      nextState.enter = jest.fn().mockRejectedValue(enterError);
      
      await stateMachine.transition();
      
      // Should be in new state despite enter error
      expect(stateMachine.getCurrentState().name).toBe('keyboard-shortcut');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error entering state "keyboard-shortcut":',
        enterError
      );
      
      consoleErrorSpy.mockRestore();
    });
    
    it('should handle missing next state gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const currentState = stateMachine.getCurrentState();
      currentState.next = 'non-existent-state';
      
      await stateMachine.transition();
      
      // Should stay in current state
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Next state "non-existent-state" not found. Staying in current state.'
      );
      
      consoleErrorSpy.mockRestore();
    });
    
    it('should complete full cycle and loop back to initial state', async () => {
      // Transition through all states
      await stateMachine.transition(); // -> keyboard-shortcut
      await stateMachine.transition(); // -> app-appearance
      await stateMachine.transition(); // -> quick-action
      await stateMachine.transition(); // -> text-replacement
      await stateMachine.transition(); // -> loop-delay
      await stateMachine.transition(); // -> text-selection (loop back)
      
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
    });
  });
  
  describe('reset', () => {
    it('should return to initial state', async () => {
      // Transition to a different state
      await stateMachine.transition();
      await stateMachine.transition();
      expect(stateMachine.getCurrentState().name).toBe('app-appearance');
      
      // Reset
      stateMachine.reset();
      
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
    });
    
    it('should not call exit or enter functions', () => {
      const currentState = stateMachine.getCurrentState();
      const exitSpy = jest.fn();
      const enterSpy = jest.fn();
      currentState.exit = exitSpy;
      currentState.enter = enterSpy;
      
      stateMachine.reset();
      
      expect(exitSpy).not.toHaveBeenCalled();
      expect(enterSpy).not.toHaveBeenCalled();
    });
    
    it('should work correctly after multiple transitions', async () => {
      // Do several transitions
      await stateMachine.transition();
      await stateMachine.transition();
      await stateMachine.transition();
      
      // Reset
      stateMachine.reset();
      
      // Should be back at start
      expect(stateMachine.getCurrentState().name).toBe('text-selection');
      
      // Should be able to transition normally after reset
      await stateMachine.transition();
      expect(stateMachine.getCurrentState().name).toBe('keyboard-shortcut');
    });
  });
  
  describe('setElements', () => {
    it('should update elements reference', () => {
      const newElements = {
        textSelection: document.createElement('span'),
      };
      
      stateMachine.setElements(newElements);
      
      expect(stateMachine.elements).toBe(newElements);
    });
    
    it('should pass new elements to state functions', async () => {
      const newElements = {
        textSelection: document.createElement('span'),
      };
      
      // Get the next state from the state machine's map
      const nextState = stateMachine.stateMap.get('keyboard-shortcut');
      const enterSpy = jest.fn();
      nextState.enter = enterSpy;
      
      stateMachine.setElements(newElements);
      await stateMachine.transition();
      
      expect(enterSpy).toHaveBeenCalledWith(newElements);
    });
  });
  
  describe('state chain validation', () => {
    it('should have valid state chain that forms complete cycle', () => {
      expect(validateStateChain()).toBe(true);
    });
    
    it('should verify all states are reachable', () => {
      const visited = new Set();
      let current = getInitialState();
      
      // Follow the chain
      while (!visited.has(current.name)) {
        visited.add(current.name);
        current = getStateByName(current.next);
      }
      
      // All states should be visited
      expect(visited.size).toBe(animationStates.length);
    });
  });
});
