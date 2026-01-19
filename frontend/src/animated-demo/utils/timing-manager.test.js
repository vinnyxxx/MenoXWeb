/**
 * Unit tests for Timing Manager
 */

import { TimingManager } from './timing-manager.js';

describe('TimingManager', () => {
  let timingManager;
  
  beforeEach(() => {
    timingManager = new TimingManager();
  });
  
  afterEach(() => {
    timingManager.destroy();
  });
  
  describe('scheduleFrame and cancelFrame', () => {
    test('scheduleFrame uses requestAnimationFrame', (done) => {
      let callCount = 0;
      const callback = () => {
        callCount++;
        expect(callCount).toBe(1);
        done();
      };
      
      const frameId = timingManager.scheduleFrame(callback);
      expect(typeof frameId).toBe('number');
    });
    
    test('cancelFrame prevents callback from executing', (done) => {
      let wasCalled = false;
      const callback = () => {
        wasCalled = true;
      };
      
      const frameId = timingManager.scheduleFrame(callback);
      timingManager.cancelFrame(frameId);
      
      // Wait a bit to ensure callback doesn't execute
      setTimeout(() => {
        expect(wasCalled).toBe(false);
        done();
      }, 50);
    });
    
    test('scheduleFrame passes timestamp to callback', (done) => {
      timingManager.scheduleFrame((timestamp) => {
        expect(typeof timestamp).toBe('number');
        expect(timestamp).toBeGreaterThan(0);
        done();
      });
    });
  });
  
  describe('delay', () => {
    test('delay resolves after correct duration', async () => {
      const startTime = performance.now();
      const delayMs = 100;
      
      await timingManager.delay(delayMs);
      
      const elapsed = performance.now() - startTime;
      // Allow 50ms tolerance for timing variations
      expect(elapsed).toBeGreaterThanOrEqual(delayMs - 10);
      expect(elapsed).toBeLessThan(delayMs + 50);
    });
    
    test('delay returns a Promise', () => {
      const result = timingManager.delay(10);
      expect(result).toBeInstanceOf(Promise);
    });
    
    test('multiple delays can run concurrently', async () => {
      const startTime = performance.now();
      
      await Promise.all([
        timingManager.delay(50),
        timingManager.delay(50),
        timingManager.delay(50),
      ]);
      
      const elapsed = performance.now() - startTime;
      // Should take ~50ms, not 150ms (concurrent, not sequential)
      expect(elapsed).toBeLessThan(100);
    });
  });
  
  describe('easing functions', () => {
    test('easeInOut returns values in [0, 1] range', () => {
      const testValues = [0, 0.25, 0.5, 0.75, 1];
      
      testValues.forEach(t => {
        const result = timingManager.easeInOut(t);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      });
    });
    
    test('easeInOut returns 0 for t=0 and 1 for t=1', () => {
      expect(timingManager.easeInOut(0)).toBe(0);
      expect(timingManager.easeInOut(1)).toBe(1);
    });
    
    test('easeInOut is symmetric around 0.5', () => {
      const t1 = 0.3;
      const t2 = 0.7;
      const result1 = timingManager.easeInOut(t1);
      const result2 = timingManager.easeInOut(t2);
      
      // For ease-in-out, f(t) + f(1-t) should equal 1
      expect(result1 + result2).toBeCloseTo(1, 5);
    });
    
    test('easeInOut clamps values outside [0, 1]', () => {
      expect(timingManager.easeInOut(-0.5)).toBe(0);
      expect(timingManager.easeInOut(1.5)).toBe(1);
    });
    
    test('easeOut returns values in [0, 1] range', () => {
      const testValues = [0, 0.25, 0.5, 0.75, 1];
      
      testValues.forEach(t => {
        const result = timingManager.easeOut(t);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(1);
      });
    });
    
    test('easeOut returns 0 for t=0 and 1 for t=1', () => {
      expect(timingManager.easeOut(0)).toBe(0);
      expect(timingManager.easeOut(1)).toBe(1);
    });
    
    test('easeOut clamps values outside [0, 1]', () => {
      expect(timingManager.easeOut(-0.5)).toBe(0);
      expect(timingManager.easeOut(1.5)).toBe(1);
    });
    
    test('easeOut accelerates faster than easeInOut at start', () => {
      const t = 0.2;
      const easeOutValue = timingManager.easeOut(t);
      const easeInOutValue = timingManager.easeInOut(t);
      
      // Ease-out should be further along at t=0.2
      expect(easeOutValue).toBeGreaterThan(easeInOutValue);
    });
  });
  
  describe('FPS monitoring', () => {
    test('getFPS returns a number', () => {
      const fps = timingManager.getFPS();
      expect(typeof fps).toBe('number');
    });
    
    test('getFPS returns initial value of 60', () => {
      const fps = timingManager.getFPS();
      expect(fps).toBe(60);
    });
    
    test('resetFpsMonitoring resets FPS to 60', () => {
      // Trigger some frames to change FPS
      timingManager._currentFps = 45;
      
      timingManager.resetFpsMonitoring();
      
      expect(timingManager.getFPS()).toBe(60);
    });
  });
  
  describe('cleanup', () => {
    test('cancelAllFrames cancels all active frames', (done) => {
      let callCount = 0;
      const callback1 = () => { callCount++; };
      const callback2 = () => { callCount++; };
      
      timingManager.scheduleFrame(callback1);
      timingManager.scheduleFrame(callback2);
      
      timingManager.cancelAllFrames();
      
      setTimeout(() => {
        expect(callCount).toBe(0);
        done();
      }, 50);
    });
    
    test('destroy cleans up all resources', (done) => {
      let wasCalled = false;
      const callback = () => { wasCalled = true; };
      
      timingManager.scheduleFrame(callback);
      timingManager.destroy();
      
      setTimeout(() => {
        expect(wasCalled).toBe(false);
        expect(timingManager.getFPS()).toBe(60);
        done();
      }, 50);
    });
  });
});
