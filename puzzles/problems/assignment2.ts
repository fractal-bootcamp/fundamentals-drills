/*
Assignment 3 — Meeting Room Scheduler

Context:
You manage a meeting room booking system. Meeting requests come in and need to be
assigned to available rooms. Each meeting has an id, duration (in hours), participant
count, and an optional equipment requirement. Rooms have a capacity, hourly availability,
and an optional list of available equipment.

Input (informal, not typed):
{
  rooms: Array<{ name: string; capacity: number; hoursAvailable: number; equipment?: string[] }>,
  meetings: Array<{ id: string; duration: number; participants: number; equipmentNeeded?: string }>
}

Rules / Behavior:
- Process `meetings` in the given order.
- Validate each meeting:
  - `id` must be a non-empty string.
  - `duration` must be a finite number > 0 (can be decimal like 0.5 for 30 min).
  - `participants` must be a finite integer > 0.
  - Invalid meetings are not scheduled and placed into `unscheduled` with an error entry.
  
- For a valid meeting:
  1. Try to book it into an already-scheduled room that:
     - Has enough remaining hours: (hoursUsed + duration <= hoursAvailable)
     - Has enough capacity: (capacity >= participants)
     - Has required equipment if specified: (equipmentNeeded is in room.equipment array, or equipmentNeeded is undefined)
     
  2. If no currently-used room works, try to book a new room:
     - Consider rooms whose capacity >= participants AND hoursAvailable >= duration
     - If equipment is needed, room must have that equipment in its equipment array
     - If multiple rooms qualify, choose the one with the SMALLEST capacity
     - If capacities tie, choose by lexicographic name (ascending) for determinism
     - Track the room as "in use" and initialize hoursUsed = 0
     
  3. If no room can accommodate the meeting, place into `unscheduled`
  
- After booking, update the room's `hoursUsed` and add meeting id to room's `meetings` array

- Return object:
  {
    scheduled: Array<{ 
      roomName: string, 
      capacity: number, 
      meetings: string[], 
      hoursUsed: number, 
      hoursAvailable: number 
    }>,
    unscheduled: string[], // meeting ids that couldn't be scheduled or were invalid
    errors: Array<{ id?: string, error: string }>
  }

Edge cases:
- Empty `meetings` -> return empty scheduled array, empty unscheduled and errors
- Empty `rooms` -> all meetings go to unscheduled (no errors, just can't be placed)
- Meetings with 0 or negative duration/participants are invalid
- Rooms with 0 capacity or 0 hoursAvailable can never be used
- Equipment arrays are case-sensitive (Projector ≠ projector)
- If no equipment specified on meeting, any room works (equipment-wise)
- If no equipment array on room, room has no equipment

Examples:
- rooms=[{name:'A',capacity:5,hoursAvailable:8},{name:'B',capacity:10,hoursAvailable:4}], 
  meetings=[{id:'m1',duration:2,participants:3},{id:'m2',duration:3,participants:3}]
  -> m1 goes in room A (2 hours used), m2 also fits in room A (5 hours used total)
  
- If m1 needs 'Projector' but room A has no equipment array -> m1 goes to unscheduled

Implementational note:
- No type annotations on the exported function parameters
- You must model and validate shapes inside the function
*/

// TODO: Add your types here
type Room = {
  name: string
  capacity: number
  hoursAvailable: number
}

type Meeting = {
  id: string
  duration: number
  participants: number
}


// TODO: Implement validation helper
function isValidMeeting(meeting): boolean {
  return (
    meeting &&
    typeof meeting.id === 'string' &&
    typeof meeting.duration === 'number' &&
    typeof meeting.participants === 'number' &&
    meeting.length > 0 &&
    meeting.duration > 0 &&
    meeting.participants > 0
  )
}

// TODO: Implement the main scheduler function
export function scheduleMeetings(input) {
  // Your code here
}

// TODO: Implement helper to find or create a room booking