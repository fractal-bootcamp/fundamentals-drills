# FOR_ETHAN.md: A Director's Log

## The Story So Far

You're building a warehouse order processing system from first principles. Starting with validation functions (Assignment 1), then orchestrating state changes across events (Assignment 2). The goal: Learn design patterns by implementing real business logic.

## Cast & Crew (Architecture)

Think of the system like a film production pipeline:

- **Data Layer** (`InventoryItem`, `OrderedItem`, `Order`): The footage — raw materials
- **Validation Layer** (`validateOrderItems`, `isOrderFulfillable`): The script supervisor — catches errors before they become expensive
- **Action Layer** (`handlePlaceOrder`, `handleRestock`): The director — orchestrates state changes
- **State** (`WarehouseState`): The production log — records what happened

Data flows in → gets validated → triggers actions → state updates → log records what changed.

## Behind the Scenes (Decisions)

### Error Accumulation Pattern

Why return an *array of error strings* instead of an error object with typed keys?

**Trade-off: Flexibility vs. Type Safety**
- Array: Simple, scales easily (add new validation rules without restructuring), user-friendly (show all problems at once)
- Object: Type-safe, but locks you into predefined error types

For this project: Array wins because validation rules might expand, and users need to see *all* problems, not just the first one.

### Multiple Validations Per Item

In `validateOrderItems`, each item can fail *multiple* rules (unknown product ID, invalid quantity, bad price). We check **all conditions per item**, accumulate *all* errors, then return them together. This is how real form validation works.

## Bloopers (Bugs & Fixes)

### Set.has() vs. Direct Comparison

**The Bug:**
```typescript
if (item.productId !== knownProductIds) {  // ❌ TypeScript Error 2367
  // ...
}
```

**Why it breaks:**
You're comparing a `string` directly to a `Set<string>` object. They're different types — TypeScript won't allow it.

**The Fix:**
```typescript
if (!knownProductIds.has(item.productId)) {  // ✅ Correct
  // ...
}
```

**The Pattern:**
- **Arrays** use `.includes()` — `array.includes(value)`
- **Sets** use `.has()` — `set.has(value)`
- **Objects** use `.in` or property access — `key in obj`

Each data structure has its own API for membership checking because they're optimized differently. Sets are built for *fast lookups*, so `.has()` reflects that design.

**Mental Model:** Don't compare a value *to* a collection. Ask the collection "*Do you contain this value?*" using its method.

## Director's Commentary

### Senior Engineer Mindset: Trust Your Types

TypeScript's error messages are trying to help you. When it says "types string and Set<string> have no overlap," it's not being pedantic — it's protecting you from a real logic error. Listen to your types; they're smarter than you think.

### On Validation:

**Rule:** Only validate at system boundaries (user input, external APIs). Trust internal code.

Since `validateOrderItems` is called only from within `assignment2.ts`, you don't need to add parameter validation inside the function. The calling code (`handlePlaceOrder`) is under your control — it will pass valid inputs.

**Where the boolean check lives:** In the caller's responsibility to check `if (errors.length === 0)`, not the validator's responsibility to guard against bad inputs.

---

*Last updated: 2026-04-02 (Assignment 1 deep dive)*
