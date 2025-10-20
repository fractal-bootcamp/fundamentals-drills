// @ts-nocheck
/**
 * Programming Puzzle — Wi-Fi Session Processor
 *
 * Context:
 * You operate public Wi-Fi hotspots across a city. Users “connect” to a hotspot and later “disconnect”
 * (possibly at a different hotspot if roaming is supported in your system). Process a stream of events to:
 *   - build completed sessions,
 *   - track currently connected users,
 *   - and record rule-based rejections deterministically.
 *
 * Input:
 *   events: Array<{ user: string; action: "connect" | "disconnect"; hotspot: string }>
 *
 * Invariants on a valid event:
 *   - user is a non-empty string done
 *   - action is exactly "connect" or "disconnect" done
 *   - hotspot is a non-empty string done
 *
 * Rules:
 *   1) "connect": allowed only if the user is NOT currently connected.
 *   2) "disconnect": allowed only if the user IS currently connected; this completes a session
 *       from the "from" hotspot (where they connected) to the "to" hotspot (where they disconnected).
 *   3) Invalid events (missing fields / wrong types / empty strings / wrong action) are IGNORED (not rejected).
 *   4) Rejections are recorded ONLY for violations of (1) and (2), in input order.
 *
 * Output:
 *   Return an object:
 *   {
 *     // users still connected after processing (their connection hotspot)
 *     active: Record<string, { connectedAt: string }>;
 *
 *     // completed sessions in the order they were completed
 *     sessions: Array<{ user: string; from: string; to: string }>;
 *
 *     // rejected events in input order
 *     // "reason" is exactly "already connected" or "not connected"
 *     rejected: Array<{ user: string; action: "connect" | "disconnect"; hotspot: string; reason: string }>;
 *
 *     // counts per hotspot for accepted connects/disconnects only
 *     stats: {
 *       connects: Record<string, number>;
 *       disconnects: Record<string, number>;
 *     };
 *   }
 *
 * Edge cases:
 *   - Empty event list → all outputs empty.
 *   - Duplicate connect without a disconnect → second connect is rejected; user remains connected at original hotspot.
 *   - Disconnect without a prior connect → rejected; no state change.
 *   - Hotspot names are case-sensitive strings.
 *
 * Examples:
 *   1) events = [
 *        { user:"u1", action:"connect",    hotspot:"Cafe-A" },
 *        { user:"u1", action:"disconnect", hotspot:"Cafe-B" }
 *      ]
 *      ⇒ sessions: [{ user:"u1", from:"Cafe-A", to:"Cafe-B" }], active:{}, rejected:[],
 *         stats: { connects:{ "Cafe-A":1 }, disconnects:{ "Cafe-B":1 } }
 */

//test data 
let tempEvents: Event[] = [{ user: "d", action: "connect", hotspot: "Cafe" },
{ user: "", action: "connect", hotspot: "X" },         // invalid: empty user
{ user: "d", action: "bogus", hotspot: "Y" } as any,    // invalid: wrong action
{ user: "d", action: "connect", hotspot: "" },          // invalid: empty hotspot
{ user: "d", action: "disconnect", hotspot: "Gate" }
]

//end of test data

type Event = {
    user: string;
    action: "connect" | "disconnect";
    hotspot: string;
}


//output types
type Active = Record<string, { connectedAt: string }>

type Session = {
    user: string;
    from: string;
    to: string;
}

type Reject = {
    user: string;
    action: "connect" | "disconnect";
    hotspot: string;
    reason: string;
}

type Stats = {
    connects: Record<string, number>
    disconnects: Record<string, number>
}

//helper function to determine whether the event is valid
function eventIsValid(event: Event) {
    return (event.action === "connect" || event.action === "disconnect") && typeof event.user === "string" && event.user.trim().length > 0 &&
        typeof event.hotspot == "string" && event.hotspot.trim().length > 0
}

//helper function to check if a user is currently connected
function userIsConnected(user: string, active: Active) {
    return user in active
}


//helper function to update stats- if it exists within stats, add 1 to the count, otherwise set it to 0 and add 1
function updateStats(stats: Stats, kind: "connects" | "disconnects", hotspot: string): Stats {
    (stats[kind][hotspot] ?? 0) + 1;
    return stats;
}

//helper fn to add item to rejected array
function addReject(user: string, action: "connect" | "disconnect", hotspot: string, reason: string): Reject {
    return { user, action, hotspot, reason }
}

function addSession(user: string, from: string, to: string) {
    return { user, from, to }
}



export function processWifiEvents(
    events: Array<{ user: string; action: "connect" | "disconnect"; hotspot: string }>
): {
    active: Record<string, { connectedAt: string }>;
    sessions: Array<{ user: string; from: string; to: string }>;
    rejected: Array<{ user: string; action: "connect" | "disconnect"; hotspot: string; reason: string }>;
    stats: { connects: Record<string, number>; disconnects: Record<string, number> };
} {
    // TODO: implement according to the rules above.
    // Skeleton return so the file compiles:
    const active: Active = {};
    const sessions: Session[] = [];
    const rejected: Reject[] = [];
    let stats: Stats = {
        connects: {},
        disconnects: {},
    };

    // Your logic goes here.
    for (let e of events) {
        if (eventIsValid(e)) {
            switch (e.action) {
                case ("connect"):
                    //check if the user is connected or not
                    if (userIsConnected(e.user, active)) {
                        //add to rejected list
                        rejected.push(addReject(e.user, "connect", e.hotspot, "already connected"))
                    }
                    else { //user isnt connected, 1- add to active list, 2- add to stats

                        active[e.user] = { connectedAt: e.hotspot };
                        if (typeof stats.connects[e.hotspot] == "undefined") {
                            stats.connects[e.hotspot] = 0;
                            stats.connects[e.hotspot]++;
                        }
                        else {
                            stats.connects[e.hotspot]++;
                        }

                    }
                    break;
                case ("disconnect"):
                    if (userIsConnected(e.user, active)) { //user is connected, can complete the session
                        //add to sessions 
                        sessions.push(addSession(e.user, active[e.user].connectedAt, e.hotspot))
                        //update stats
                        if (typeof stats.disconnects[e.hotspot] == "undefined") {
                            stats.disconnects[e.hotspot] = 0;
                            stats.disconnects[e.hotspot]++;
                        }
                        else {
                            stats.disconnects[e.hotspot]++;
                        }
                        //remove from active list
                        delete active[e.user]
                    }
                    else { //user didnt connect initially 
                        //add to rejected list
                        rejected.push(addReject(e.user, "disconnect", e.hotspot, "not connected"))
                    }
                    break;

            }
        }
    }
    console.log(rejected)
    console.log(sessions)

    return { active, sessions, rejected, stats };
}

//processWifiEvents(tempEvents);