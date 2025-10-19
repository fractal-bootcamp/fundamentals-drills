// @ts-nocheck
/**
 * Programming Puzzle — Parking Garage Sessions
 *
 * You will implement a parking garage system that processes a list of vehicle sessions.
 * Each session is a sequence of actions: entering, adding time, exiting, or cancelling.
 * The garage has a fixed capacity and multiple pricing tiers based on vehicle type.
 * Sessions track entry time, payments, and calculate fees upon exit.
 *
 * Input:
 *   {
 *     garage: {
 *       capacity: number;                                          // max vehicles (>0)
 *       rates: { [vehicleType: string]: number };                 // cents per hour (>=0)
 *     }
 *     sessions: Array<Session>                                     // Session = Action[]
 *   }
 *   Action is one of:
 *     ["enter", vehicleId, vehicleType]  // attempt to park (vehicleType must be in rates)
 *     ["pay", vehicleId, amount]         // add payment (must be >0)
 *     ["addTime", vehicleId, hours]      // simulate time passing (hours must be >0)
 *     ["exit", vehicleId]                // leave garage
 *     ["cancel", vehicleId]              // cancel entry (refund all payments)
 *     ["noop"]                           // does nothing
 *
 * Output:
 *   {
 *     occupancy: number;                 // current vehicles in garage
 *     tickets: Array<{
 *       vehicleId?: string;              // vehicle ID if action involved one
 *       action: string;                  // "entered" | "exited" | "cancelled" | "idle"
 *       hoursParked: number;             // total hours vehicle was parked
 *       amountDue: number;               // total amount owed (cents)
 *       amountPaid: number;              // total amount paid (cents)
 *       refund: number;                  // refund amount (cents)
 *       balance: number;                 // negative = owed, positive = overpaid
 *       errors: string[];                // rule violations
 *     }>
 *   }
 *
 * Rules & Notes:
 *   - Garage starts empty (occupancy = 0)
 *   - Each session produces one ticket summarizing all actions in that session
 *   - "enter":
 *       * Fails if garage is at capacity (error)
 *       * Fails if vehicleType is not in rates (error)
 *       * Fails if vehicle is already in garage (error)
 *       * Success: vehicle enters with 0 hours parked, 0 paid
 *   - "pay":
 *       * Fails if vehicle is not in garage (error)
 *       * Fails if amount <= 0 (error)
 *       * Success: adds to vehicle's payment total
 *   - "addTime":
 *       * Fails if vehicle is not in garage (error)
 *       * Fails if hours <= 0 (error)
 *       * Success: adds hours to vehicle's parked time
 *   - "exit":
 *       * Fails if vehicle is not in garage (error)
 *       * Success: vehicle leaves, calculate fee = rate * hours (rounded up to nearest hour)
 *         balance = amountPaid - amountDue (negative means underpaid, positive means overpaid/refund)
 *         Remove vehicle from garage, decrease occupancy
 *   - "cancel":
 *       * Fails if vehicle is not in garage (error)
 *       * Success: refund all payments, remove vehicle, no fees charged
 *   - "noop": does nothing
 *   - Unknown actions: record error
 *   - Hours are rounded UP to nearest integer for billing (e.g., 0.1 hours = 1 hour charge)
 *   - Multiple vehicles can be in garage simultaneously (up to capacity)
 *   - Session ticket shows final state after all actions processed
 *
 * Examples:
 *   Example A:
 *     garage={capacity:2, rates:{car:100}}, sessions=[
 *       [["enter","V1","car"], ["addTime","V1",2], ["pay","V1",200], ["exit","V1"]]
 *     ]
 *     => ticket: {vehicleId:"V1", action:"exited", hoursParked:2, amountDue:200, amountPaid:200, balance:0}
 *     => occupancy: 0
 *
 *   Example B:
 *     garage={capacity:1, rates:{car:100}}, sessions=[
 *       [["enter","V1","car"]],
 *       [["enter","V2","car"]]  // fails: at capacity
 *     ]
 *     => occupancy: 1 (only V1 entered)
 */

type Ticket = {

  vehicleId?: string;              // vehicle ID if action involved one
  action: string;                  // "entered" | "exited" | "cancelled" | "idle"
  hoursParked: number;             // total hours vehicle was parked
  amountDue: number;               // total amount owed (cents)
  amountPaid: number;              // total amount paid (cents)
  refund: number;                  // refund amount (cents)
  balance: number;                 // negative = owed, positive = overpaid
  errors: string[];                // rule violations





}





export function processParkingGarage(input) {
  // Handle malformed input
  if (!input || !input.garage || !input.sessions) {
    return {
      occupancy: 0,
      tickets: []
    };
  }

  let occupancy = 0
  let tickets: Ticket[] = []
  const capacity = input.garage.capacity
  const rates = input.garage.rates
  // Track vehicles in garage with their type
  const vehiclesInGarage = []


  for (let session of input.sessions) {
    let ticket: Ticket = {
      vehicleId: undefined,
      action: "idle",
      hoursParked: 0,
      amountDue: 0,
      amountPaid: 0,
      refund: 0,
      balance: 0,
      errors: []
    }

    for (let event of session) {
      if (event[0] === "enter") {
        const vehicleId = event[1]
        const vehicleType = event[2]
        ticket.vehicleId = vehicleId

        const inGarage = vehiclesInGarage.find(v => v.vehicleId === vehicleId)
        if (inGarage) {
          ticket.errors.push(`vehicle already in garage: ${vehicleId}`)

        } else if (!(vehicleType in rates)) {
          ticket.errors.push(`invalid vehicle type: ${vehicleType}`)

        } else if (capacity <= occupancy) {
          ticket.errors.push("garage at capacity")
        } else {
          vehiclesInGarage.push({
            vehicleId: vehicleId,
            vehicleType: vehicleType,
            hoursParked: 0,
            amountPaid: 0
          })
          ticket.action = "entered"
          occupancy += 1

        }



      } else if (event[0] === "pay") {
        const vehicleId = event[1]
        const amount = event[2]
        ticket.vehicleId = vehicleId

        const inGarage = vehiclesInGarage.find(v => v.vehicleId === vehicleId)
        if (!inGarage) {
          ticket.errors.push(`vehicle not in garage: ${vehicleId}`)


        } else if (amount <= 0) {
          ticket.errors.push(`invalid payment amount: ${amount}`)
        } else {
          inGarage.amountPaid += amount

        }

      } else if (event[0] === "addTime") {
        const vehicleId = event[1]
        const hours = event[2]
        ticket.vehicleId = vehicleId

        const inGarage = vehiclesInGarage.find(v => v.vehicleId === vehicleId)
        if (!inGarage) {
          ticket.errors.push(`vehicle not in garage: ${vehicleId}`)

        } else if (hours <= 0) {
          ticket.errors.push(`invalid time amount: ${hours}`)
        } else {
          inGarage.hoursParked += hours


        }



      } else if (event[0] === "exit") {
        const vehicleId = event[1]
        ticket.vehicleId = vehicleId

        const inGarage = vehiclesInGarage.find(v => v.vehicleId === vehicleId)
        if (!inGarage) {
          ticket.errors.push(`vehicle not in garage: ${vehicleId}`)


        } else {
          ticket.action = "exited"
          ticket.hoursParked = inGarage.hoursParked
          ticket.amountPaid = inGarage.amountPaid

          const billingHours = inGarage.hoursParked % 1 === 0 ? inGarage.hoursParked : Math.floor(inGarage.hoursParked) + 1
          ticket.amountDue = billingHours * rates[inGarage.vehicleType]

          const balance = ticket.amountPaid - ticket.amountDue
          ticket.balance = balance

          if (balance > 0) {
            ticket.refund = balance
          }

          const index = vehiclesInGarage.findIndex(v => v.vehicleId === vehicleId)
          vehiclesInGarage.splice(index, 1)
          occupancy -= 1
        }





      } else if (event[0] === "cancel") {
        const vehicleId = event[1]
        ticket.vehicleId = vehicleId

        const inGarage = vehiclesInGarage.find(v => v.vehicleId === vehicleId)
        if (!inGarage) {
          ticket.errors.push(`vehicle not in garage: ${vehicleId}`)
        } else {
          ticket.action = "cancelled"
          ticket.hoursParked = inGarage.hoursParked
          ticket.amountPaid = inGarage.amountPaid
          ticket.amountDue = 0
          ticket.refund = inGarage.amountPaid
          ticket.balance = 0

          const index = vehiclesInGarage.findIndex(v => v.vehicleId === vehicleId)
          vehiclesInGarage.splice(index, 1)
          occupancy -= 1
        }

      } else if (event[0] === "noop") {

      } else if (event[0]) {
        ticket.errors.push(`unknown action: ${event[0]}`)
      }

    }

    const inGarage = vehiclesInGarage.find(v => v.vehicleId === ticket.vehicleId)
    if (ticket.vehicleId && inGarage) {
      ticket.hoursParked = inGarage.hoursParked
      ticket.amountPaid = inGarage.amountPaid

      const billingHours = inGarage.hoursParked % 1 === 0 ? inGarage.hoursParked : Math.floor(inGarage.hoursParked) + 1
      ticket.amountDue = billingHours * rates[inGarage.vehicleType]
      ticket.balance = ticket.amountPaid - ticket.amountDue
    }

    tickets.push(ticket)
  }




  return {
    occupancy: occupancy,
    tickets: tickets

  };
}
