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

import { randomUUID } from "crypto"

/*
what do i need to answer?

helper function validateItem()
validate item - every() via helper func
  - `id` must be a non-empty string.
  - `volume` must be a finite integer >= 0.

main for loop
try existing boxes that **has remaining capacity** & hasn't exceeded it's
**fragile item limit** (see below:)
  - place in first 'already open box' that has remaining capacity
    (usedVolume + volume <= capacity)
    **AND** whose fragile count + (fragile?1:0) <= fragileLimit

  - boxTypes=[
  {type:'S',capacity:5},{type:'L',capacity:10}],
  items=[{id:'a',volume:3},{id:'b',volume:4}]
  -> 'a' placed in S (used 3), 'b' does not fit S (3+4>5) so open L and place b.

helper function createNewBox()
if that fails create a new box that can hold item's volume, respect fragile limits

  filter() boxTypes array to find boxTypes capacity can accept an item
  - use tie-breaking rules capacity >= volume & fragileLimit >= required
                                      if (item.fragile = true) fragileLimit = 1
  - create new box object {boxId, type, items: [], usedVolume: 0, fragileCount: 0}
  - add box object to boxes array
    boxes: Array<{ boxId: number, type: string, items: string[], usedVolume: number,
    fragileCount: number }>

  - place item into that box (tracking boxId) update box's items array, usedVolume & fragileCount

item with volume > capacity -> goes to leftovers[].
*/

type BoxTypes = {
  type: string
  capacity: number
  fragileLimit?: number
}

type OpenBox = {
  boxId: number
  type: string
  items: Item[]
  usedVolume: number
  fragileCount: number
  capacity: number
  fragileLimit?: number
}

type Item = {
  id: string
  volume: number
  fragile?: boolean
}

type Error = {
  id?: string
  error: string
}

type ReturnValue = {
  boxes: OpenBox[]
  leftOvers: string[]
  errors: Error[]
}

const input = {
  boxTypes: [
    { type: "Z", capacity: 5 },
    { type: "A", capacity: 5 }, // should win by lexicographic order
  ],
  items: [{ id: "i1", volume: 0 }],
};

function isInputValid(item: Item): boolean {
  // console.log(input)
  return item.id !== '' && item.volume >= 0
}

export function packParcels(input): ReturnValue {
  const boxes: OpenBox[] = []
  const leftOvers: string[] = []
  const errors: Error[] = []

  for (const item of input.items) {  // outer loop to get items
    const isValid = isInputValid(item)

    if (isValid) {
      let itemPlaced = false

      for (const box of boxes) {  // check existing boxes against the current item
        const boxHasCapacity = box.usedVolume + item.volume <= box.capacity

        if (boxHasCapacity && box.fragileCount + (item.fragile ? 1 : 0) <= box.fragileLimit) {
          box.items.push(item)
          itemPlaced = true
        }
      }

      if (!itemPlaced) {
        createNewBox(item, input.boxTypes, boxes)
      }

    } else {
      errors.push(item.id)
    }

    const returnObj = {
      boxes,
      leftOvers,
      errors,
    }

    return returnObj
  }
}

// console.log(packParcels(input))


function createNewBox(item: Item, boxTypes, boxes: OpenBox[]): OpenBox {
  const filteredBoxTypeArr = boxTypes.filter(box => box.capacity >= item.volume && box.fragileLimit >= (item.fragile ? 1 : 0))
  const smallestALphaBox = filteredBoxTypeArr.reduce((smallestBox, currentBox) => {
    if (currentBox.capacity < smallestBox.capacity) {
      return currentBox
    } else if (currentBox.capacity === smallestBox.capacity) {
      return currentBox.type < smallestBox.type ? currentBox : smallestBox
    } else {
      return currentBox
    }
  },[])

  const newBox: OpenBox = {
    ...smallestALphaBox,
    boxId: randomUUID,
    items: [],
    usedVolume: 0,
    fragileCount: 0,
    fragileLimit: smallestALphaBox.fragileLimit ?? Infinity
  }

  boxes.push(newBox)
  return newBox
}

//  Return Object:
//  {
//  boxes: Array<{ boxId: number, type: string, items: string[],
//  usedVolume: number, fragileCount: number }>
//  leftovers: string[], // item ids that couldn't be packed or were invalid
//  errors: Array<{ id?: string, error: string }>
//  // validation/packing errors (id optional for global errors)
//  }
