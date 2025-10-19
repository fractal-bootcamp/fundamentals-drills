/**
 * Functional Programming Approach to Vending Machine
 *
 * Key principles:
 * - Pure functions (no side effects)
 * - Immutability (no mutation of input data)
 * - Function composition
 * - Data transformation pipelines
 * - Explicit state threading
 */

// ============================================================================
// Types
// ============================================================================

type Inventory = { [sku: string]: { price: number; stock: number } };

type CoinPouch = { [denom: number]: number };

type Receipt = {
  dispensed?: string;
  changeCoins: CoinPouch;
  changeTotal: number;
  spent: number;
  errors: string[];
};

type SessionState = {
  credit: number;
  insertedCoins: CoinPouch;
  errors: string[];
  ended: boolean;
  dispensed?: string;
};

type Action = ["insert", number] | ["select", string] | ["cancel"] | ["noop"];

// ============================================================================
// Constants
// ============================================================================

const ALLOWED_DENOMINATIONS = [100, 50, 25, 10, 5, 1] as const;

// ============================================================================
// Pure utility functions
// ============================================================================

const normalizeInventory = (inventory: Inventory): Inventory =>
  Object.fromEntries(
    Object.entries(inventory).map(([sku, item]) => [
      sku,
      {
        price: Math.max(0, Math.trunc(item.price)),
        stock: Math.max(0, Math.trunc(item.stock)),
      },
    ])
  );

const isValidCoin = (coin: number): boolean =>
  ALLOWED_DENOMINATIONS.includes(coin as any);

const addCoinToPouch = (pouch: CoinPouch, coin: number): CoinPouch => ({
  ...pouch,
  [coin]: (pouch[coin] || 0) + 1,
});

const calculateGreedyChange = (amount: number): CoinPouch =>
  ALLOWED_DENOMINATIONS.reduce(
    (acc, denom) => {
      const count = Math.floor(acc.remaining / denom);
      return {
        coins: count > 0 ? { ...acc.coins, [denom]: count } : acc.coins,
        remaining: acc.remaining - count * denom,
      };
    },
    { coins: {} as CoinPouch, remaining: amount }
  ).coins;

const sumCoins = (pouch: CoinPouch): number =>
  Object.entries(pouch).reduce(
    (sum, [denom, count]) => sum + Number(denom) * count,
    0
  );

const createEmptyReceipt = (): Receipt => ({
  changeCoins: {},
  changeTotal: 0,
  spent: 0,
  errors: [],
});

const createInitialSessionState = (): SessionState => ({
  credit: 0,
  insertedCoins: {},
  errors: [],
  ended: false,
});

// ============================================================================
// Action handlers (pure functions that return new state)
// ============================================================================

const handleInsert = (state: SessionState, coin: number): SessionState => {
  if (!isValidCoin(coin)) {
    return {
      ...state,
      errors: [...state.errors, `unsupported coin: ${coin}`],
    };
  }

  return {
    ...state,
    credit: state.credit + coin,
    insertedCoins: addCoinToPouch(state.insertedCoins, coin),
  };
};

const handleSelect = (
  state: SessionState,
  sku: string,
  inventory: Inventory
): { state: SessionState; inventory: Inventory } => {
  // Check if SKU exists
  if (!(sku in inventory)) {
    return {
      state: {
        ...state,
        errors: [...state.errors, `invalid sku: ${sku}`],
      },
      inventory,
    };
  }

  const item = inventory[sku];

  // Check stock
  if (item.stock <= 0) {
    return {
      state: {
        ...state,
        errors: [...state.errors, `out of stock: ${sku}`],
      },
      inventory,
    };
  }

  // Check credit
  if (state.credit < item.price) {
    return {
      state: {
        ...state,
        errors: [
          ...state.errors,
          `insufficient credit: have ${state.credit}, need ${item.price}`,
        ],
      },
      inventory,
    };
  }

  // Success - create new inventory with decremented stock
  const newInventory = {
    ...inventory,
    [sku]: { ...item, stock: item.stock - 1 },
  };

  const newState: SessionState = {
    ...state,
    dispensed: sku,
    ended: true,
  };

  return { state: newState, inventory: newInventory };
};

const handleCancel = (state: SessionState): SessionState => ({
  ...state,
  ended: true,
});

// ============================================================================
// Session processing (reduce over actions)
// ============================================================================

const processAction = (
  acc: { state: SessionState; inventory: Inventory },
  action: Action
): { state: SessionState; inventory: Inventory } => {
  // If session already ended, skip remaining actions
  if (acc.state.ended) {
    return acc;
  }

  const [actionType, actionValue] = action;

  switch (actionType) {
    case "insert":
      return {
        ...acc,
        state: handleInsert(acc.state, actionValue),
      };

    case "select":
      return handleSelect(acc.state, actionValue, acc.inventory);

    case "cancel":
      return {
        ...acc,
        state: handleCancel(acc.state),
      };

    case "noop":
      return acc;

    default:
      return {
        ...acc,
        state: {
          ...acc.state,
          errors: [...acc.state.errors, `unknown action: ${actionType}`],
        },
      };
  }
};

const processSession = (
  session: Action[],
  inventory: Inventory
): { receipt: Receipt; inventory: Inventory } => {
  const initialState = createInitialSessionState();

  const { state: finalState, inventory: finalInventory } = session.reduce(
    processAction,
    { state: initialState, inventory }
  );

  // Build receipt from final state (use finalInventory for price lookups)
  const receipt = buildReceipt(finalState, finalInventory);

  return { receipt, inventory: finalInventory };
};

// ============================================================================
// Receipt building
// ============================================================================

const buildReceipt = (state: SessionState, inventory: Inventory): Receipt => {
  const baseReceipt = createEmptyReceipt();

  // Handle dispensed item (successful purchase)
  if (state.dispensed) {
    const item = inventory[state.dispensed];
    const changeAmount = state.credit - item.price;

    return {
      ...baseReceipt,
      dispensed: state.dispensed,
      spent: item.price,
      changeTotal: changeAmount,
      changeCoins: calculateGreedyChange(changeAmount),
      errors: state.errors,
    };
  }

  // Handle cancel (refund inserted coins)
  if (state.ended && !state.dispensed) {
    return {
      ...baseReceipt,
      changeCoins: state.insertedCoins,
      changeTotal: state.credit,
      errors: state.errors,
    };
  }

  // Idle session end (no purchase, no cancel)
  return {
    ...baseReceipt,
    errors: state.errors,
  };
};

// ============================================================================
// Main function (compose everything together)
// ============================================================================

export const processVendingSessionsFunctional = (input: {
  inventory: Inventory;
  sessions: Action[][];
}) => {
  const { inventory, sessions } = input;

  // Normalize inventory (pure function)
  const normalizedInventory = normalizeInventory(inventory || {});

  // Process sessions with inventory threading
  const result = (sessions || []).reduce(
    (acc, session) => {
      const { receipt, inventory: updatedInventory } = processSession(
        session,
        acc.inventory
      );

      return {
        receipts: [...acc.receipts, receipt],
        inventory: updatedInventory,
      };
    },
    { receipts: [] as Receipt[], inventory: normalizedInventory }
  );

  return {
    inventory: result.inventory,
    receipts: result.receipts,
  };
};

// ============================================================================
// Comparison with imperative approach
// ============================================================================

/**
 * Functional Programming Benefits:
 *
 * 1. TESTABILITY:
 *    - Each function is pure and can be tested in isolation
 *    - No hidden state or side effects
 *    - Easy to reason about inputs and outputs
 *
 * 2. COMPOSABILITY:
 *    - Small functions compose into larger ones
 *    - Reducer pattern makes state transitions explicit
 *    - Easy to add new action types
 *
 * 3. IMMUTABILITY:
 *    - No accidental mutations
 *    - State transformations are explicit
 *    - Easier to debug and trace data flow
 *
 * 4. DECLARATIVE:
 *    - Code reads like a description of what to do
 *    - Less focus on "how" (loops, conditionals)
 *    - More focus on "what" (transformations)
 *
 * 5. REUSABILITY:
 *    - Utility functions like `calculateGreedyChange` are reusable
 *    - Action handlers can be tested and used independently
 *    - Easy to extract into a library
 *
 * Trade-offs:
 * - More object spreading (potential performance impact for large objects)
 * - More function calls (negligible performance impact in practice)
 * - Requires understanding of functional concepts (reduce, immutability)
 * - More verbose in some cases
 */
