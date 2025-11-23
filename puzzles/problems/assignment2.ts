/*
Assignment 2 — Parcel Packer

Context:
You operate a small packing system that places incoming parcels into boxes.
Each incoming item has an id, a non-negative integer `volume`, and an optional
`fragile` boolean. There are predefined `boxTypes` with integer capacity and an
optional limit for how many fragile items they may contain. The task is to model
a deterministic packing strategy that opens boxes on demand and places items
respecting capacities and fragile limits.

Input (informal, not typed):
{
  boxTypes: Array<{ type: string; capacity: number; fragileLimit?: number }>,
  items: Array<{ id: string; volume: number; fragile?: boolean }>
}

Rules / Behavior:
- Process `items` in the given order.
- Validate each item:
  - `id` must be a non-empty string.
  - `volume` must be a finite integer >= 0.
  - Invalid items are not packed and are placed into `leftovers` with an error entry.
- For a valid item:
  1. Try to place it into the first already-open box (in order of creation) that
     has remaining capacity (usedVolume + volume <= capacity) and whose fragile
     count + (fragile?1:0) <= fragileLimit (fragileLimit defaults to Infinity).
  2. If none of the open boxes can accept it, try to open a new box:
     - Consider boxTypes whose `capacity >= volume` and whose `fragileLimit` (if present)
       is >= required fragile count (1 if fragile true, else 0).
     - If multiple box types can be used, choose the one with the smallest capacity.
       If capacities tie, choose by lexicographic `type` ascending to be deterministic.
     - If no box type can accommodate the item, place the item into `leftovers`.
- After placing, update the box's `usedVolume` and `fragileCount` and record the item id.

- Return object:
  {
    boxes: Array<{ boxId: number, type: string, items: string[], usedVolume: number, fragileCount: number }>,
    leftovers: string[], // item ids that couldn't be packed or were invalid
    errors: Array<{ id?: string, error: string }> // validation/packing errors (id optional for global errors)
  }

Edge cases spelled out:
- Empty `items` -> return no boxes, empty leftovers and errors.
- Empty `boxTypes` -> no items can be packed (all valid items go to leftovers).
- Items with volume 0 are packable (they consume no capacity but count toward fragile limits).
- Negative or non-integer volumes are invalid items and go to leftovers with an error.
- Fragile limits default to unlimited if not provided.
- Deterministic tie-breakers: choose smallest capacity, then lexicographic `type`.

Examples:
- boxTypes=[{type:'S',capacity:5},{type:'L',capacity:10}], items=[{id:'a',volume:3},{id:'b',volume:4}]
  -> 'a' placed in S (used 3), 'b' does not fit S (3+4>5) so open L and place b.
- item with volume larger than any box type -> goes to leftovers.

Implementational note:
- The exported function intentionally uses no input/output type annotations so the
  student must model and validate shapes inside the function.
*/

type Item = {
  id: string;
  volume: number;
  fragile?: boolean;
};

type Box = {
  boxId: number;
  type: BoxBlueprint;
  items: Array<string>;
  usedVolume: number;
  fragileCount: number;
};

type BoxBlueprint = {
  type: string;
  capacity: number;
  fragileLimit?: number;
};

type ErrorMessage = {
  id?: string;
  error: string;
};

type InputData = {
  items: Array<Item>;
  boxTypes: Array<BoxBlueprint>;
};

function validate(item: Item): boolean {
  if (item.id === "" && item.volume <= 0) {
    return false;
  } else return true;
}

function willItemFitInBoxType(item: Item, boxTypes: Array<BoxBlueprint>): boolean {
  for (const box of boxTypes) {
    if (box.capacity >= item.volume) {
      return true;
    }
  }
  return false;
}

function isBoxFull(item: Item, box: Box): boolean {
  if (box.usedVolume + item.volume > box.type.capacity) {
    return true;
  } else {
    return false;
  }
}

function isBoxFragileLimitFull(item: Item, box: Box): boolean {
  if (!item.fragile) {
    return false;
  }

  // get the limit defaulting to Infinity if undefined
  const limit = box.type.fragileLimit ?? Infinity;

  if (box.type.fragileLimit === Infinity) {
    return false;
  } else if (box.fragileCount + 1 > limit) {
    return true;
  }
  return false;
}

function canFragileItemFitInBox(item: Item, boxTypes: Array<BoxBlueprint>): boolean {
  if (!item.fragile) {
    return false;
  }

  for (const boxType of boxTypes) {
    const limit = boxType.fragileLimit ?? Infinity;

    if (limit > 0) {
      return true;
    }
  }
  return false;
}

function isItemALeftover(item: Item, boxTypes: Array<BoxBlueprint>): boolean {
  console.log("avail box types:", boxTypes);
  console.log("avail item:", item);

  for (const box of boxTypes) {
    const validCapacity = box.capacity >= item.volume;
    const limit = box.fragileLimit ?? Infinity;
    const validFragile = !item.fragile || limit > 0;

    if (validCapacity && validFragile) {
      return false; // it fits somewhere -- not a leftover
    }
  }
  return true; // fits nowhere, thus leftover
}

function chooseBoxType(item: Item, boxTypes: Array<BoxBlueprint>): BoxBlueprint {
  const possibleBoxTypes: Array<BoxBlueprint> = [];

  boxTypes.forEach((boxType) => {
    if (boxType.capacity >= item.volume) {
      // is the box big enough?
      const limit = boxType.fragileLimit ?? Infinity;

      // does it allow fragile items?
      if (item.fragile) {
        if (limit > 0) {
          possibleBoxTypes.push(boxType);
        }
        // if limit is 0 DO NOT push it
      } else {
        // item not fragile, so this box is fine
        possibleBoxTypes.push(boxType);
      }
    }
  });

  let bestBoxTypeOption: BoxBlueprint = possibleBoxTypes[0];

  possibleBoxTypes.forEach((possibleBoxType) => {
    // is this box smaller (better) than our current best option?
    if (possibleBoxType.capacity < bestBoxTypeOption.capacity) {
      bestBoxTypeOption = possibleBoxType;
    }
    // if sizes are the same, we need a tie-breaker
    else if (possibleBoxType.capacity === bestBoxTypeOption.capacity) {
      // deterministic tie-breaker: pick the one with the alphabetically first 'type'
      if (possibleBoxType.type < bestBoxTypeOption.type) {
        bestBoxTypeOption = possibleBoxType;
      }
    }
  });
  return bestBoxTypeOption;
}

// {
//   boxes: Array<{ boxId: number, type: string, items: string[], usedVolume: number, fragileCount: number }>,
//   leftovers: string[], // item ids that couldn't be packed or were invalid
//   errors: Array<{ id?: string, error: string }> // validation/packing errors (id optional for global errors)
// }

export function packParcels(input: InputData | null) {
  if (!input || !input.items || !input.boxTypes) {
    return {
      boxes: [],
      leftovers: [],
      errors: [{ error: "invalid input" }],
    };
  }

  const { items, boxTypes } = input;
  const boxes: Array<Box> = [];
  const leftovers: Array<string> = [];
  const errors: Array<ErrorMessage> = [];

  // loop through each item
  for (const item of items) {
    // validation step
    const isValidItem = validate(item);

    if (!isValidItem) {
      errors.push({
        id: item.id,
        error: `Item: ${item.id} ain't fuckin' validdd`,
      });
      leftovers.push(item.id); // invalid items also go to leftovers
      continue; // STOP here for this item, go to the next one
    }

    // leftover check
    const itemIsLeftover = isItemALeftover(item, boxTypes);

    if (itemIsLeftover) {
      leftovers.push(item.id);
      continue; // STOP here for this item, go to the next one
    }

    // find a box step
    // we need a place for this item
    let newBox: Box | null = null;

    for (const box of boxes) {
      // check if the item fits in this specific box
      const isBoxInvalid = isBoxFull(item, box) || isBoxFragileLimitFull(item, box);

      if (!isBoxInvalid) {
        // found one! set as our target and stop looking
        newBox = box;
        break;
      }
    }

    // create box step
    // if box is still null, none of our open boxes worked -- open a brand new box
    if (newBox === null) {
      const ourNewBoxType = chooseBoxType(item, boxTypes);

      // create new box object
      const freshBox: Box = {
        boxId: boxes.length, // the index is the current length (so the most recent created)
        type: ourNewBoxType,
        items: [],
        usedVolume: 0,
        fragileCount: 0,
      };

      // add it to our list of boxes so we can use it
      boxes.push(freshBox);

      // set this new box as the one we are going to use right now
      newBox = freshBox;
    }

    // packing step
    // now 'newBox' is guaranteed to be the correct box
    // put the item inside
    newBox.items.push(item.id);
    newBox.usedVolume = newBox.usedVolume + item.volume;

    if (item.fragile) {
      newBox.fragileCount += 1;
    }
  }

  return {
    boxes: boxes.map((b) => ({
      ...b,
      type: b.type.type,
    })),
    leftovers,
    errors,
  };
}
