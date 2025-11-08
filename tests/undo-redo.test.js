// Undo/Redo system tests
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { undoManager } from '../scripts/undo-redo.js';

// Mock FLAB state
global.FLAB = {
  players: [],
  arrows: [],
  orientation: 'landscape',
  mode: 'select',
  selectedPlayer: null,
  passOrigin: null
};

describe('Undo/Redo Manager', () => {
  beforeEach(() => {
    // Reset undo manager state
    undoManager.clear();

    // Reset FLAB state
    global.FLAB = {
      players: [
        { id: 1, role: 'GK', nx: 0.1, ny: 0.5 },
        { id: 2, role: 'DF', nx: 0.3, ny: 0.3 }
      ],
      arrows: [],
      orientation: 'landscape',
      mode: 'select',
      selectedPlayer: null,
      passOrigin: null
    };
  });

  describe('saveState', () => {
    it('should save current state to undo stack', () => {
      undoManager.saveState('Test action');
      expect(undoManager.getUndoStackSize()).toBe(1);
    });

    it('should clear redo stack when saving new state', () => {
      undoManager.saveState('Action 1');
      undoManager.undo();
      undoManager.saveState('Action 2');
      expect(undoManager.getRedoStackSize()).toBe(0);
    });

    it('should limit stack size to MAX_UNDO_STEPS', () => {
      for (let i = 0; i < 60; i++) {
        undoManager.saveState(`Action ${i}`);
      }
      expect(undoManager.getUndoStackSize()).toBeLessThanOrEqual(50);
    });

    it('should not save state during undo/redo operations', () => {
      undoManager.saveState('Action 1');
      const sizeBefore = undoManager.getUndoStackSize();
      undoManager.undo();
      // State should not be saved during undo
      expect(undoManager.getUndoStackSize()).toBe(sizeBefore - 1);
    });
  });

  describe('undo', () => {
    it('should restore previous state', () => {
      const initialPlayers = JSON.parse(JSON.stringify(global.FLAB.players));
      undoManager.saveState('Initial');

      global.FLAB.players.push({ id: 3, role: 'MF', nx: 0.5, ny: 0.5 });
      undoManager.saveState('Add player');

      undoManager.undo();
      expect(global.FLAB.players).toHaveLength(initialPlayers.length);
    });

    it('should return false when undo stack is empty', () => {
      const result = undoManager.undo();
      expect(result).toBe(false);
    });

    it('should move state to redo stack', () => {
      undoManager.saveState('Action 1');
      undoManager.undo();
      expect(undoManager.getRedoStackSize()).toBe(1);
    });

    it('should restore all state properties', () => {
      const initialState = JSON.parse(JSON.stringify(global.FLAB));
      undoManager.saveState('Initial');

      global.FLAB.orientation = 'portrait';
      global.FLAB.mode = 'pass';
      undoManager.saveState('Change orientation and mode');

      undoManager.undo();
      expect(global.FLAB.orientation).toBe(initialState.orientation);
      expect(global.FLAB.mode).toBe(initialState.mode);
    });
  });

  describe('redo', () => {
    it('should restore next state', () => {
      undoManager.saveState('State 1');
      global.FLAB.players.push({ id: 3, role: 'MF', nx: 0.5, ny: 0.5 });
      undoManager.saveState('State 2');

      undoManager.undo();
      const playersAfterUndo = global.FLAB.players.length;

      undoManager.redo();
      expect(global.FLAB.players.length).toBe(playersAfterUndo + 1);
    });

    it('should return false when redo stack is empty', () => {
      const result = undoManager.redo();
      expect(result).toBe(false);
    });

    it('should move state back to undo stack', () => {
      undoManager.saveState('Action 1');
      undoManager.undo();
      const redoSizeBefore = undoManager.getRedoStackSize();
      undoManager.redo();
      expect(undoManager.getRedoStackSize()).toBe(redoSizeBefore - 1);
    });
  });

  describe('canUndo and canRedo', () => {
    it('canUndo should return false when stack is empty', () => {
      expect(undoManager.canUndo()).toBe(false);
    });

    it('canUndo should return true when stack has items', () => {
      undoManager.saveState('Action 1');
      expect(undoManager.canUndo()).toBe(true);
    });

    it('canRedo should return false when stack is empty', () => {
      expect(undoManager.canRedo()).toBe(false);
    });

    it('canRedo should return true after undo', () => {
      undoManager.saveState('Action 1');
      undoManager.undo();
      expect(undoManager.canRedo()).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear both undo and redo stacks', () => {
      undoManager.saveState('Action 1');
      undoManager.saveState('Action 2');
      undoManager.undo();

      undoManager.clear();

      expect(undoManager.getUndoStackSize()).toBe(0);
      expect(undoManager.getRedoStackSize()).toBe(0);
    });
  });

  describe('enable and disable', () => {
    it('should not save state when disabled', () => {
      undoManager.disable();
      undoManager.saveState('Action 1');
      expect(undoManager.getUndoStackSize()).toBe(0);
    });

    it('should save state after re-enabling', () => {
      undoManager.disable();
      undoManager.saveState('Action 1');
      undoManager.enable();
      undoManager.saveState('Action 2');
      expect(undoManager.getUndoStackSize()).toBe(1);
    });
  });

  describe('getRecentActions', () => {
    it('should return recent action names', () => {
      undoManager.saveState('Action 1');
      undoManager.saveState('Action 2');
      undoManager.saveState('Action 3');

      const recent = undoManager.getRecentActions(2);
      expect(recent).toHaveLength(2);
      expect(recent[0]).toBe('Action 3');
      expect(recent[1]).toBe('Action 2');
    });

    it('should handle empty stack', () => {
      const recent = undoManager.getRecentActions(5);
      expect(recent).toHaveLength(0);
    });
  });

  describe('State Integrity', () => {
    it('should deep clone state to prevent mutations', () => {
      const initialPlayers = [{ id: 1, role: 'GK', nx: 0.1, ny: 0.5 }];
      global.FLAB.players = initialPlayers;
      undoManager.saveState('Initial');

      // Mutate current state
      global.FLAB.players[0].nx = 0.9;

      undoManager.undo();

      // Restored state should have original value
      expect(global.FLAB.players[0].nx).toBe(0.1);
    });

    it('should handle nested objects correctly', () => {
      const arrow = {
        id: 1,
        fromId: 1,
        to: { x: 100, y: 100 },
        control: { x: 50, y: 50 }
      };
      global.FLAB.arrows = [arrow];
      undoManager.saveState('Initial');

      // Mutate nested object
      global.FLAB.arrows[0].control.x = 999;

      undoManager.undo();

      // Restored state should have original value
      expect(global.FLAB.arrows[0].control.x).toBe(50);
    });
  });

  describe('Multiple Undo/Redo Operations', () => {
    it('should handle multiple undos in sequence', () => {
      global.FLAB.players = [{ id: 1, role: 'GK', nx: 0.1, ny: 0.5 }];
      undoManager.saveState('State 1');

      global.FLAB.players.push({ id: 2, role: 'DF', nx: 0.3, ny: 0.3 });
      undoManager.saveState('State 2');

      global.FLAB.players.push({ id: 3, role: 'MF', nx: 0.5, ny: 0.5 });
      undoManager.saveState('State 3');

      undoManager.undo();
      expect(global.FLAB.players).toHaveLength(2);

      undoManager.undo();
      expect(global.FLAB.players).toHaveLength(1);

      undoManager.undo();
      expect(global.FLAB.players).toHaveLength(1);
    });

    it('should handle alternating undo/redo', () => {
      undoManager.saveState('State 1');
      global.FLAB.mode = 'pass';
      undoManager.saveState('State 2');

      undoManager.undo();
      expect(global.FLAB.mode).toBe('select');

      undoManager.redo();
      expect(global.FLAB.mode).toBe('pass');

      undoManager.undo();
      expect(global.FLAB.mode).toBe('select');
    });
  });
});
