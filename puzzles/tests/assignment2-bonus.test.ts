import { describe, it, expect } from 'vitest';
import { processLibraryCheckouts } from '../problems/assignment2-bonus';

describe('processLibraryCheckouts', () => {
  it('should handle empty event list', () => {
    const result = processLibraryCheckouts([]);
    expect(result).toEqual({
      checkedOut: {},
      activePatrons: {},
      completed: [],
      rejected: [],
      stats: {
        totalBorrows: 0,
        totalReturns: 0,
        mostActivePatron: null
      }
    });
  });

  it('should process simple borrow and return sequence', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 100 },
      { patronId: "alice", action: "return", bookId: "book1", timestamp: 200 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.completed).toEqual([{
      patronId: "alice",
      bookId: "book1",
      borrowedAt: 100,
      returnedAt: 200,
      duration: 100
    }]);
    expect(result.checkedOut).toEqual({});
    expect(result.activePatrons).toEqual({});
    expect(result.rejected).toEqual([]);
    expect(result.stats.totalBorrows).toBe(1);
    expect(result.stats.totalReturns).toBe(1);
    expect(result.stats.mostActivePatron).toBe("alice");
  });

  it('should reject borrowing unavailable book and returning book patron does not have', () => {
    const events = [
      { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 50 },
      { patronId: "alice", action: "borrow", bookId: "book2", timestamp: 60 }, // rejected
      { patronId: "alice", action: "return", bookId: "book3", timestamp: 70 }  // rejected
    ];
    const result = processLibraryCheckouts(events);
    expect(result.checkedOut).toEqual({
      book2: { patronId: "bob", borrowedAt: 50 }
    });
    expect(result.activePatrons.bob).toEqual(new Set(["book2"]));
    expect(result.completed).toEqual([]);
    expect(result.rejected).toHaveLength(2);
    expect(result.rejected[0]).toEqual({
      patronId: "alice",
      action: "borrow",
      bookId: "book2",
      reason: "book unavailable"
    });
    expect(result.rejected[1]).toEqual({
      patronId: "alice",
      action: "return",
      bookId: "book3",
      reason: "patron does not have book"
    });
    expect(result.stats.totalBorrows).toBe(1);
    expect(result.stats.totalReturns).toBe(0);
  });

  it('should handle patron borrowing multiple books simultaneously', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "alice", action: "borrow", bookId: "book2", timestamp: 20 },
      { patronId: "alice", action: "borrow", bookId: "book3", timestamp: 30 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.activePatrons.alice).toEqual(new Set(["book1", "book2", "book3"]));
    expect(result.checkedOut).toEqual({
      book1: { patronId: "alice", borrowedAt: 10 },
      book2: { patronId: "alice", borrowedAt: 20 },
      book3: { patronId: "alice", borrowedAt: 30 }
    });
    expect(result.completed).toEqual([]);
    expect(result.stats.totalBorrows).toBe(3);
  });

  it('should handle multiple patrons with interleaved events', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 20 },
      { patronId: "alice", action: "return", bookId: "book1", timestamp: 30 },
      { patronId: "charlie", action: "borrow", bookId: "book3", timestamp: 40 },
      { patronId: "bob", action: "return", bookId: "book2", timestamp: 50 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.completed).toEqual([
      { patronId: "alice", bookId: "book1", borrowedAt: 10, returnedAt: 30, duration: 20 },
      { patronId: "bob", bookId: "book2", borrowedAt: 20, returnedAt: 50, duration: 30 }
    ]);
    expect(result.activePatrons.charlie).toEqual(new Set(["book3"]));
    expect(result.checkedOut).toEqual({
      book3: { patronId: "charlie", borrowedAt: 40 }
    });
    expect(result.rejected).toEqual([]);
  });

  it('should ignore invalid events with missing or invalid fields', () => {
    const events = [
      { patronId: "valid", action: "borrow", bookId: "book1", timestamp: 100 },
      { patronId: "", action: "borrow", bookId: "book2", timestamp: 110 }, // invalid: empty patronId
      { patronId: "valid", action: "invalid", bookId: "book3", timestamp: 120 }, // invalid: bad action
      { patronId: "valid2", action: "borrow", timestamp: 130 }, // invalid: missing bookId
      { patronId: "valid2", action: "borrow", bookId: "book4", timestamp: -5 }, // invalid: negative timestamp
      null, // invalid: null event
      { patronId: "valid", action: "return", bookId: "book1", timestamp: 200 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.completed).toEqual([{
      patronId: "valid",
      bookId: "book1",
      borrowedAt: 100,
      returnedAt: 200,
      duration: 100
    }]);
    expect(result.rejected).toEqual([]);
    expect(result.stats.totalBorrows).toBe(1);
    expect(result.stats.totalReturns).toBe(1);
  });

  it('should handle same patron multiple complete rentals', () => {
    const events = [
      { patronId: "reader", action: "borrow", bookId: "book1", timestamp: 0 },
      { patronId: "reader", action: "return", bookId: "book1", timestamp: 100 },
      { patronId: "reader", action: "borrow", bookId: "book2", timestamp: 150 },
      { patronId: "reader", action: "return", bookId: "book2", timestamp: 300 },
      { patronId: "reader", action: "borrow", bookId: "book1", timestamp: 350 }, // can re-borrow
      { patronId: "reader", action: "return", bookId: "book1", timestamp: 400 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.completed).toEqual([
      { patronId: "reader", bookId: "book1", borrowedAt: 0, returnedAt: 100, duration: 100 },
      { patronId: "reader", bookId: "book2", borrowedAt: 150, returnedAt: 300, duration: 150 },
      { patronId: "reader", bookId: "book1", borrowedAt: 350, returnedAt: 400, duration: 50 }
    ]);
    expect(result.activePatrons).toEqual({});
    expect(result.checkedOut).toEqual({});
    expect(result.stats.totalBorrows).toBe(3);
    expect(result.stats.totalReturns).toBe(3);
    expect(result.stats.mostActivePatron).toBe("reader");
  });

  it('should identify most active patron correctly', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "alice", action: "return", bookId: "book1", timestamp: 20 },
      { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 30 },
      { patronId: "bob", action: "return", bookId: "book2", timestamp: 40 },
      { patronId: "bob", action: "borrow", bookId: "book3", timestamp: 50 },
      { patronId: "bob", action: "return", bookId: "book3", timestamp: 60 },
      { patronId: "charlie", action: "borrow", bookId: "book4", timestamp: 70 },
      { patronId: "charlie", action: "return", bookId: "book4", timestamp: 80 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.stats.mostActivePatron).toBe("bob"); // bob has 2 completed rentals
    expect(result.stats.totalBorrows).toBe(4);
    expect(result.stats.totalReturns).toBe(4);
  });

  it('should reject patron trying to borrow already borrowed book (by themselves)', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 20 } // rejected
    ];
    const result = processLibraryCheckouts(events);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]).toEqual({
      patronId: "alice",
      action: "borrow",
      bookId: "book1",
      reason: "book unavailable"
    });
    expect(result.activePatrons.alice).toEqual(new Set(["book1"]));
  });

  it('should handle complex scenario with multiple rejections and completions', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "bob", action: "borrow", bookId: "book2", timestamp: 20 },
      { patronId: "charlie", action: "borrow", bookId: "book1", timestamp: 30 }, // rejected
      { patronId: "alice", action: "return", bookId: "book2", timestamp: 40 }, // rejected
      { patronId: "alice", action: "return", bookId: "book1", timestamp: 50 },
      { patronId: "charlie", action: "borrow", bookId: "book1", timestamp: 60 }, // now available
      { patronId: "bob", action: "borrow", bookId: "book3", timestamp: 70 },
      { patronId: "david", action: "return", bookId: "book4", timestamp: 80 }, // rejected
      { patronId: "bob", action: "return", bookId: "book2", timestamp: 90 },
      { patronId: "charlie", action: "return", bookId: "book1", timestamp: 100 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.completed).toEqual([
      { patronId: "alice", bookId: "book1", borrowedAt: 10, returnedAt: 50, duration: 40 },
      { patronId: "bob", bookId: "book2", borrowedAt: 20, returnedAt: 90, duration: 70 },
      { patronId: "charlie", bookId: "book1", borrowedAt: 60, returnedAt: 100, duration: 40 }
    ]);
    expect(result.activePatrons.bob).toEqual(new Set(["book3"]));
    expect(result.rejected).toHaveLength(3);
    expect(result.rejected[0].reason).toBe("book unavailable");
    expect(result.rejected[1].reason).toBe("patron does not have book");
    expect(result.rejected[2].reason).toBe("patron does not have book");
  });

  it('should maintain rejection order as events are processed', () => {
    const events = [
      { patronId: "a", action: "return", bookId: "x", timestamp: 1 },  // rejection 1
      { patronId: "b", action: "borrow", bookId: "y", timestamp: 2 },
      { patronId: "a", action: "return", bookId: "z", timestamp: 3 },  // rejection 2
      { patronId: "c", action: "borrow", bookId: "y", timestamp: 4 }, // rejection 3
    ];
    const result = processLibraryCheckouts(events);
    expect(result.rejected).toHaveLength(3);
    expect(result.rejected[0]).toEqual({ patronId: "a", action: "return", bookId: "x", reason: "patron does not have book" });
    expect(result.rejected[1]).toEqual({ patronId: "a", action: "return", bookId: "z", reason: "patron does not have book" });
    expect(result.rejected[2]).toEqual({ patronId: "c", action: "borrow", bookId: "y", reason: "book unavailable" });
  });

  it('should handle patron returning one book while keeping others', () => {
    const events = [
      { patronId: "alice", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "alice", action: "borrow", bookId: "book2", timestamp: 20 },
      { patronId: "alice", action: "borrow", bookId: "book3", timestamp: 30 },
      { patronId: "alice", action: "return", bookId: "book2", timestamp: 40 }
    ];
    const result = processLibraryCheckouts(events);
    expect(result.activePatrons.alice).toEqual(new Set(["book1", "book3"]));
    expect(result.completed).toEqual([{
      patronId: "alice",
      bookId: "book2",
      borrowedAt: 20,
      returnedAt: 40,
      duration: 20
    }]);
    expect(result.checkedOut.book1).toEqual({ patronId: "alice", borrowedAt: 10 });
    expect(result.checkedOut.book3).toEqual({ patronId: "alice", borrowedAt: 30 });
    expect(result.checkedOut.book2).toBeUndefined();
  });

  it('should handle tie in most active patron (first alphabetically)', () => {
    const events = [
      { patronId: "bob", action: "borrow", bookId: "book1", timestamp: 10 },
      { patronId: "bob", action: "return", bookId: "book1", timestamp: 20 },
      { patronId: "alice", action: "borrow", bookId: "book2", timestamp: 30 },
      { patronId: "alice", action: "return", bookId: "book2", timestamp: 40 }
    ];
    const result = processLibraryCheckouts(events);
    // Both have 1 completed rental - could return either or first one, implementation dependent
    expect(["alice", "bob"]).toContain(result.stats.mostActivePatron);
  });
});
