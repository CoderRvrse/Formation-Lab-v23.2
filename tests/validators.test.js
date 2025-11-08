// Validator module tests
import { describe, it, expect } from 'vitest';
import {
  validatePlayers,
  validatePlayer,
  validateArrows,
  validateArrow,
  validateFormationData,
  validateSettings
} from '../scripts/validators.js';

describe('Validators - Player Validation', () => {
  describe('validatePlayer', () => {
    it('should validate a correct player', () => {
      const player = {
        id: 1,
        role: 'GK',
        nx: 0.1,
        ny: 0.5
      };

      const result = validatePlayer(player);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject player without id', () => {
      const player = {
        role: 'GK',
        nx: 0.1,
        ny: 0.5
      };

      const result = validatePlayer(player);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject player with invalid role', () => {
      const player = {
        id: 1,
        role: 'INVALID',
        nx: 0.1,
        ny: 0.5
      };

      const result = validatePlayer(player);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('role'))).toBe(true);
    });

    it('should reject player with NaN coordinates', () => {
      const player = {
        id: 1,
        role: 'GK',
        nx: NaN,
        ny: 0.5
      };

      const result = validatePlayer(player);
      expect(result.valid).toBe(false);
    });

    it('should reject player with Infinity coordinates', () => {
      const player = {
        id: 1,
        role: 'GK',
        nx: Infinity,
        ny: 0.5
      };

      const result = validatePlayer(player);
      expect(result.valid).toBe(false);
    });

    it('should sanitize out-of-bounds coordinates', () => {
      const player = {
        id: 1,
        role: 'GK',
        nx: 1.5,
        ny: -0.5
      };

      const result = validatePlayer(player);
      expect(result.sanitized.nx).toBeGreaterThanOrEqual(0);
      expect(result.sanitized.nx).toBeLessThanOrEqual(1);
      expect(result.sanitized.ny).toBeGreaterThanOrEqual(0);
      expect(result.sanitized.ny).toBeLessThanOrEqual(1);
    });
  });

  describe('validatePlayers', () => {
    it('should validate an array of correct players', () => {
      const players = [
        { id: 1, role: 'GK', nx: 0.1, ny: 0.5 },
        { id: 2, role: 'DF', nx: 0.3, ny: 0.3 },
        { id: 3, role: 'MF', nx: 0.5, ny: 0.5 }
      ];

      const result = validatePlayers(players);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject non-array input', () => {
      const result = validatePlayers('not an array');
      expect(result.valid).toBe(false);
    });

    it('should reject empty array', () => {
      const result = validatePlayers([]);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('at least one player'))).toBe(true);
    });

    it('should reject duplicate player IDs', () => {
      const players = [
        { id: 1, role: 'GK', nx: 0.1, ny: 0.5 },
        { id: 1, role: 'DF', nx: 0.3, ny: 0.3 }
      ];

      const result = validatePlayers(players);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('duplicate'))).toBe(true);
    });

    it('should sanitize invalid players', () => {
      const players = [
        { id: 1, role: 'GK', nx: 0.1, ny: 0.5 },
        { id: 2, role: 'DF', nx: 1.5, ny: -0.5 }
      ];

      const result = validatePlayers(players);
      expect(result.sanitized).toHaveLength(2);
      expect(result.sanitized[1].nx).toBeGreaterThanOrEqual(0);
      expect(result.sanitized[1].nx).toBeLessThanOrEqual(1);
    });
  });
});

describe('Validators - Arrow Validation', () => {
  describe('validateArrow', () => {
    it('should validate a correct arrow', () => {
      const arrow = {
        id: 1,
        fromId: 5,
        to: { x: 100, y: 100 },
        curved: false,
        control: null
      };

      const result = validateArrow(arrow);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject arrow without id', () => {
      const arrow = {
        fromId: 5,
        to: { x: 100, y: 100 }
      };

      const result = validateArrow(arrow);
      expect(result.valid).toBe(false);
    });

    it('should reject arrow without fromId', () => {
      const arrow = {
        id: 1,
        to: { x: 100, y: 100 }
      };

      const result = validateArrow(arrow);
      expect(result.valid).toBe(false);
    });

    it('should reject arrow without to coordinates', () => {
      const arrow = {
        id: 1,
        fromId: 5
      };

      const result = validateArrow(arrow);
      expect(result.valid).toBe(false);
    });

    it('should validate curved arrow with control point', () => {
      const arrow = {
        id: 1,
        fromId: 5,
        to: { x: 100, y: 100 },
        curved: true,
        control: { x: 50, y: 50 }
      };

      const result = validateArrow(arrow);
      expect(result.valid).toBe(true);
    });

    it('should sanitize NaN coordinates', () => {
      const arrow = {
        id: 1,
        fromId: 5,
        to: { x: NaN, y: 100 }
      };

      const result = validateArrow(arrow);
      expect(result.sanitized.to.x).not.toBeNaN();
    });
  });

  describe('validateArrows', () => {
    it('should validate an array of correct arrows', () => {
      const arrows = [
        { id: 1, fromId: 5, to: { x: 100, y: 100 } },
        { id: 2, fromId: 6, to: { x: 150, y: 150 } }
      ];

      const result = validateArrows(arrows);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should accept empty array', () => {
      const result = validateArrows([]);
      expect(result.valid).toBe(true);
    });

    it('should reject non-array input', () => {
      const result = validateArrows('not an array');
      expect(result.valid).toBe(false);
    });

    it('should reject duplicate arrow IDs', () => {
      const arrows = [
        { id: 1, fromId: 5, to: { x: 100, y: 100 } },
        { id: 1, fromId: 6, to: { x: 150, y: 150 } }
      ];

      const result = validateArrows(arrows);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('duplicate'))).toBe(true);
    });
  });
});

describe('Validators - Formation Data', () => {
  describe('validateFormationData', () => {
    it('should validate complete formation data', () => {
      const data = {
        players: [
          { id: 1, role: 'GK', nx: 0.1, ny: 0.5 },
          { id: 2, role: 'DF', nx: 0.3, ny: 0.3 }
        ],
        arrows: [
          { id: 1, fromId: 1, to: { x: 100, y: 100 } }
        ],
        orientation: 'landscape'
      };

      const result = validateFormationData(data);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid players', () => {
      const data = {
        players: [
          { id: 1, role: 'INVALID', nx: 0.1, ny: 0.5 }
        ],
        arrows: []
      };

      const result = validateFormationData(data);
      expect(result.valid).toBe(false);
    });

    it('should reject invalid arrows', () => {
      const data = {
        players: [
          { id: 1, role: 'GK', nx: 0.1, ny: 0.5 }
        ],
        arrows: [
          { id: 1 } // Missing required fields
        ]
      };

      const result = validateFormationData(data);
      expect(result.valid).toBe(false);
    });

    it('should sanitize both players and arrows', () => {
      const data = {
        players: [
          { id: 1, role: 'GK', nx: 1.5, ny: 0.5 }
        ],
        arrows: [
          { id: 1, fromId: 1, to: { x: NaN, y: 100 } }
        ]
      };

      const result = validateFormationData(data);
      expect(result.sanitized.players[0].nx).toBeLessThanOrEqual(1);
      expect(result.sanitized.arrows[0].to.x).not.toBeNaN();
    });
  });
});

describe('Validators - Settings', () => {
  describe('validateSettings', () => {
    it('should validate correct settings', () => {
      const settings = {
        orientation: 'landscape',
        passStyle: 'solid',
        theme: 'dark'
      };

      const result = validateSettings(settings);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid orientation', () => {
      const settings = {
        orientation: 'invalid'
      };

      const result = validateSettings(settings);
      expect(result.valid).toBe(false);
    });

    it('should sanitize invalid settings', () => {
      const settings = {
        orientation: 'invalid',
        passStyle: 'unknown'
      };

      const result = validateSettings(settings);
      expect(result.sanitized.orientation).toMatch(/landscape|portrait/);
    });

    it('should handle missing settings', () => {
      const result = validateSettings({});
      expect(result.sanitized).toHaveProperty('orientation');
    });
  });
});

describe('Validators - Edge Cases', () => {
  it('should handle null input', () => {
    expect(() => validatePlayer(null)).not.toThrow();
    expect(() => validatePlayers(null)).not.toThrow();
    expect(() => validateArrow(null)).not.toThrow();
    expect(() => validateArrows(null)).not.toThrow();
  });

  it('should handle undefined input', () => {
    expect(() => validatePlayer(undefined)).not.toThrow();
    expect(() => validatePlayers(undefined)).not.toThrow();
  });

  it('should handle extremely large arrays', () => {
    const largePlayers = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      role: 'MF',
      nx: 0.5,
      ny: 0.5
    }));

    const result = validatePlayers(largePlayers);
    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
  });

  it('should handle special characters in strings', () => {
    const settings = {
      orientation: 'landscape<script>alert("xss")</script>'
    };

    const result = validateSettings(settings);
    expect(result.valid).toBe(false);
  });
});
