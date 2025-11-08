// Geometry module tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  cssNumber,
  unit,
  insetFromA,
  insetFromB,
  smoothstep,
  normToView,
  viewToNorm,
  n2p,
  p2n,
  n2p_view,
  p2n_view,
  clampPx
} from '../scripts/geometry.js';

describe('Geometry - CSS and Math Utilities', () => {
  describe('cssNumber', () => {
    it('should parse valid CSS number', () => {
      expect(cssNumber('42px')).toBe(42);
      expect(cssNumber('3.14')).toBe(3.14);
      expect(cssNumber('0')).toBe(0);
    });

    it('should return default for invalid input', () => {
      expect(cssNumber('invalid', 10)).toBe(10);
      expect(cssNumber(NaN, 5)).toBe(5);
      expect(cssNumber(undefined, 0)).toBe(0);
    });

    it('should handle negative numbers', () => {
      expect(cssNumber('-42')).toBe(-42);
      expect(cssNumber('-3.14px')).toBe(-3.14);
    });
  });

  describe('unit', () => {
    it('should calculate unit vector', () => {
      const result = unit(0, 0, 3, 4);
      expect(result.ux).toBeCloseTo(0.6);
      expect(result.uy).toBeCloseTo(0.8);
    });

    it('should handle vertical line', () => {
      const result = unit(0, 0, 0, 10);
      expect(result.ux).toBeCloseTo(0);
      expect(result.uy).toBeCloseTo(1);
    });

    it('should handle horizontal line', () => {
      const result = unit(0, 0, 10, 0);
      expect(result.ux).toBeCloseTo(1);
      expect(result.uy).toBeCloseTo(0);
    });

    it('should handle zero-length vector', () => {
      const result = unit(5, 5, 5, 5);
      // Should return NaN for zero-length vector
      expect(isNaN(result.ux)).toBe(true);
      expect(isNaN(result.uy)).toBe(true);
    });
  });

  describe('insetFromA', () => {
    it('should inset point from A towards B', () => {
      const result = insetFromA(0, 0, 10, 0, 2);
      expect(result.x).toBeCloseTo(2);
      expect(result.y).toBeCloseTo(0);
    });

    it('should handle vertical inset', () => {
      const result = insetFromA(0, 0, 0, 10, 3);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(3);
    });

    it('should handle diagonal inset', () => {
      const result = insetFromA(0, 0, 3, 4, 1);
      expect(result.x).toBeCloseTo(0.6);
      expect(result.y).toBeCloseTo(0.8);
    });
  });

  describe('insetFromB', () => {
    it('should inset point from B towards A', () => {
      const result = insetFromB(0, 0, 10, 0, 2);
      expect(result.x).toBeCloseTo(8);
      expect(result.y).toBeCloseTo(0);
    });

    it('should handle vertical inset', () => {
      const result = insetFromB(0, 0, 0, 10, 3);
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(7);
    });
  });

  describe('smoothstep', () => {
    it('should return 0 for values below edge0', () => {
      expect(smoothstep(0, 1, -0.5)).toBe(0);
    });

    it('should return 1 for values above edge1', () => {
      expect(smoothstep(0, 1, 1.5)).toBe(1);
    });

    it('should interpolate smoothly between 0 and 1', () => {
      expect(smoothstep(0, 1, 0)).toBe(0);
      expect(smoothstep(0, 1, 1)).toBe(1);
      expect(smoothstep(0, 1, 0.5)).toBeGreaterThan(0);
      expect(smoothstep(0, 1, 0.5)).toBeLessThan(1);
    });

    it('should be symmetrical around midpoint', () => {
      const result1 = smoothstep(0, 1, 0.3);
      const result2 = smoothstep(0, 1, 0.7);
      expect(result1).toBeCloseTo(1 - result2, 1);
    });
  });
});

describe('Geometry - Coordinate Transforms', () => {
  describe('normToView', () => {
    it('should transform normalized coords to view coords', () => {
      // Mock field size
      const result = normToView(0.5, 0.5);
      expect(result).toHaveProperty('vx');
      expect(result).toHaveProperty('vy');
      expect(typeof result.vx).toBe('number');
      expect(typeof result.vy).toBe('number');
    });

    it('should handle edge cases', () => {
      const result1 = normToView(0, 0);
      expect(result1.vx).toBeGreaterThanOrEqual(0);
      expect(result1.vy).toBeGreaterThanOrEqual(0);

      const result2 = normToView(1, 1);
      expect(result2.vx).toBeGreaterThanOrEqual(0);
      expect(result2.vy).toBeGreaterThanOrEqual(0);
    });
  });

  describe('viewToNorm', () => {
    it('should transform view coords to normalized coords', () => {
      const result = viewToNorm(100, 100);
      expect(result).toHaveProperty('nx');
      expect(result).toHaveProperty('ny');
      expect(typeof result.nx).toBe('number');
      expect(typeof result.ny).toBe('number');
    });

    it('should be inverse of normToView', () => {
      const original = { nx: 0.5, ny: 0.5 };
      const view = normToView(original.nx, original.ny);
      const back = viewToNorm(view.vx, view.vy);

      // Should be close to original (within tolerance)
      expect(back.nx).toBeCloseTo(original.nx, 1);
      expect(back.ny).toBeCloseTo(original.ny, 1);
    });
  });

  describe('n2p and p2n transforms', () => {
    it('n2p should convert normalized to pixel coords', () => {
      const result = n2p(0.5, 0.5);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(typeof result.x).toBe('number');
      expect(typeof result.y).toBe('number');
    });

    it('p2n should convert pixel to normalized coords', () => {
      const result = p2n(100, 100);
      expect(result).toHaveProperty('nx');
      expect(result).toHaveProperty('ny');
      expect(result.nx).toBeGreaterThanOrEqual(0);
      expect(result.nx).toBeLessThanOrEqual(1);
      expect(result.ny).toBeGreaterThanOrEqual(0);
      expect(result.ny).toBeLessThanOrEqual(1);
    });

    it('should handle boundary values', () => {
      const result1 = n2p(0, 0);
      expect(result1.x).toBeGreaterThanOrEqual(0);
      expect(result1.y).toBeGreaterThanOrEqual(0);

      const result2 = n2p(1, 1);
      expect(result2.x).toBeGreaterThanOrEqual(0);
      expect(result2.y).toBeGreaterThanOrEqual(0);
    });
  });

  describe('n2p_view and p2n_view transforms', () => {
    it('n2p_view should convert normalized to view pixel coords', () => {
      const result = n2p_view(0.5, 0.5);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(typeof result.x).toBe('number');
      expect(typeof result.y).toBe('number');
    });

    it('p2n_view should convert view pixel to normalized coords', () => {
      const result = p2n_view(100, 100);
      expect(result).toHaveProperty('nx');
      expect(result).toHaveProperty('ny');
      expect(typeof result.nx).toBe('number');
      expect(typeof result.ny).toBe('number');
    });

    it('should be inverse operations', () => {
      const original = { nx: 0.3, ny: 0.7 };
      const view = n2p_view(original.nx, original.ny);
      const back = p2n_view(view.x, view.y);

      // Should be close to original
      expect(back.nx).toBeCloseTo(original.nx, 1);
      expect(back.ny).toBeCloseTo(original.ny, 1);
    });
  });

  describe('clampPx', () => {
    it('should return valid coordinates', () => {
      const result = clampPx(100, 100);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(typeof result.x).toBe('number');
      expect(typeof result.y).toBe('number');
    });

    it('should handle boundary values', () => {
      const result1 = clampPx(-1000, -1000);
      expect(result1.x).toBeGreaterThanOrEqual(0);
      expect(result1.y).toBeGreaterThanOrEqual(0);

      const result2 = clampPx(10000, 10000);
      expect(result2.x).toBeGreaterThanOrEqual(0);
      expect(result2.y).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Geometry - Validation and Edge Cases', () => {
  it('should handle NaN inputs gracefully', () => {
    expect(() => cssNumber(NaN, 0)).not.toThrow();
    expect(() => normToView(NaN, 0.5)).not.toThrow();
    expect(() => n2p(NaN, 0.5)).not.toThrow();
  });

  it('should handle Infinity inputs gracefully', () => {
    expect(() => cssNumber(Infinity, 0)).not.toThrow();
    expect(() => normToView(Infinity, 0.5)).not.toThrow();
  });

  it('should handle negative coordinates', () => {
    expect(() => n2p(-0.5, -0.5)).not.toThrow();
    expect(() => normToView(-0.5, -0.5)).not.toThrow();
  });

  it('should handle coordinates > 1', () => {
    expect(() => n2p(1.5, 1.5)).not.toThrow();
    expect(() => normToView(1.5, 1.5)).not.toThrow();
  });
});
