// assignment4.ts
/**
 * Assignment 4 — Bike-Share Station Event Processor (queues + reconciliation)
 *
 * Context:
 * You are modeling a small bike-share system with multiple docking stations.
 * Riders generate a time-ordered stream of events: renting a bike from a station or returning a bike to a station.
 * Stations have fixed capacities. If a rent happens when a station is empty, the rider queues to rent (FIFO).
 * If a return happens when a station is full, the rider queues to return (FIFO). Events are processed strictly in order.
 *
 * Input:
 *   An object with:
 *     - stations: record of stationId -> { capacity: integer >= 0, bikes: integer in [0, capacity] } (initial state)
 *     - events: array of tuples: ["rent" | "return", stationId: string, riderId: string]
 *   Rules & invariants:
 *     - Process events sequentially.
 *     - On "rent":
 *         • If bikes > 0, rent immediately (bikes -= 1).
 *         • Else, rider joins that station’s rentQueue (FIFO), with no duplicates.
 *         • After processing the rent, immediately reconcile the station:
 *              while there is free dock space and someone waits in returnQueue, dock one (bikes += 1).
 *     - On "return":
 *         • If bikes < capacity, dock immediately (bikes += 1).
 *         • Else, rider joins that station’s returnQueue (FIFO), with no duplicates.
 *         • After processing the return, immediately reconcile the station:
 *              while bikes > 0 and someone waits in rentQueue, rent one (bikes -= 1).
 *     - Riders won’t issue contradictory simultaneous intents (no rider is in more than one queue at a time).
 *     - Deduplicate by riderId inside a given queue.
 *
 * Output:
 *   An object with:
 *     - stations: record of stationId -> {
 *         capacity: number,
 *         bikes: number,
 *         rentQueue: string[],      // FIFO order
 *         returnQueue: string[]     // FIFO order (these riders are physically holding bikes)
 *       }
 *     - riding: string[]            // riders currently out riding (not queued to return)
 *   Determinism: No randomness; queues are FIFO.
 *
 * Examples:
 *   1) stations={A:{cap:2,bikes:1}}, events=[["rent","A","r1"]] ->
 *        A.bikes=0, riding includes "r1", queues empty.
 *   2) stations={A:{cap:1,bikes:0}}, events=[["rent","A","r1"],["return","A","r2"]] ->
 *        r1 waits to rent; r2 returns, creating supply, which is immediately rented to r1;
 *        result: A.bikes=0, riding includes "r1", queues empty.
 *
 * Implementation notes:
 *   - Model queues explicitly and keep logic pure/deterministic.
 *   - A small, focused helper (e.g., reconcileStation) is expected.
 */

// Intentionally leave domain types unspecified for the student to design.
// Using `unknown` to keep the signature non-committal under strict TypeScript.

type Stations = {
    [stationid: string]: {
        capacity: number,
        bikes: number,
    }
}

type ReturnStations = {
    [stationid: string]: {
        capacity: number,
        bikes: number,
        rentQueue: string[];
        returnQueue: string[]
    }
}

type Output = {
    stations: ReturnStations,
    riding: string[]
}

type Input = {
    stations: Stations,
    events: string[][]
}
type Event = string[]

type BikeState = Output & { processedreturn: string[],
    processedrent:string[]
 }


export function processBikeShare(input: Input): Output {
    const newStations: ReturnStations = structuredClone(input.stations) as ReturnStations;
    let state: BikeState = {
        stations: {} as ReturnStations,
        riding: [],
        processedrent: [],
        processedreturn: []
    };

    for (const stationId in newStations) {
        const s = newStations[stationId];
        s.rentQueue ??= [];
        s.returnQueue ??= [];
    }

    state.stations = newStations;

    for (const event of input.events) {
        if ((!state.processedreturn.includes(event[2]) && event[0]=='return' )|| (!state.processedrent.includes(event[2]) && event[0]=='rent'))
            state = processEvent(event, state)
    }
    return { stations: state.stations, riding: state.riding }
}

function processEvent(event: Event, state: BikeState): BikeState {
    if (event[0] === 'rent') state = handleRent(event, state)
    if (event[0] === 'return') state = handleReturn(event, state)

    return state
}

function handleRent(event: Event, state: BikeState): BikeState {
    let stationId = event[1]
    let station = state.stations[stationId]
    if (!state.riding.includes(event[2])) {
    if (station.bikes > 0) {
        station.bikes--
        state.riding.push(event[2])
        state.processedrent.push(event[2])
    } else {
        station.rentQueue.push(event[2])
        state.processedrent.push(event[2])

    }
    state = reconcileStation(event, state)
}

    return state
}

function handleReturn(event: Event, state: BikeState): BikeState {
    let stationId = event[1]
    let station = state.stations[stationId]
    if (station.bikes < station.capacity) {
        station.bikes++
        state.riding = state.riding.filter(rider => rider !== event[2])
        state.processedreturn.push(event[2])
    } else {
        station.returnQueue.push(event[2])
        state.riding = state.riding.filter(rider => rider !== event[2])
        state.processedreturn.push(event[2])
        
    }
    state = reconcileStation(event, state)


    return state
}


//while bikes > 0 and someone waits in rentQueue, rent one (bikes -= 1).

function reconcileStation(event: Event, state: BikeState): BikeState {
    let stationId = event[1]
    let station = state.stations[stationId]
    while (event[0] === 'rent' && station.bikes <station.capacity && station.returnQueue.length > 0) {
        station.bikes += 1
        station.returnQueue.shift()
        
    }
    while (event[0] === 'return' && station.bikes > 0 && station.rentQueue.length > 0) {
        station.bikes -= 1
        let rider = station.rentQueue.shift()
        state.riding.push(rider!)
    }
    return state
}
