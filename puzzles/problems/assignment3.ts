// assignment4.ts
/**
 * Parcel Locker Assignment — assign incoming parcels to locker sites with size-based capacity and simple upgrades.
 *
 * Context:
 * You operate several parcel-locker sites. Each site has a limited number of lockers by size: "S", "M", "L".
 * Parcels arrive with a desired size and an ordered list of preferred sites. You must place each parcel in order.
 * If the exact size is unavailable at a preferred site, you may "upgrade" the parcel to the next larger size at that same site.
 *
 * Input:
 *   {
 *     sites: { [siteId: string]: { S: number; M: number; L: number } }, // capacities (integers >= 0)
 *     parcels: Array<{ id: string; size: "S" | "M" | "L"; prefs: string[] }> // prefs is ordered; may be empty
 *   }
 * Invariants:
 *   - Process parcels in given order (stable, no reordering).
 *   - For each preferred site, try exact size; if none, try next larger size, then the largest.
 *   - If no preferred site can host the parcel, the parcel goes to a global waitlist (preserving order).
 * Output:
 *   {
 *     placed: {
 *       [siteId: string]: {
 *         S: string[]; M: string[]; L: string[];
 *       }
 *     },
 *     remaining: { [siteId: string]: { S: number; M: number; L: number } },
 *     waitlist: string[]
 *   }
 *
 * Examples:
 *   assignParcelsToLockers({
 *     sites: { A: { S:1, M:0, L:0 } }, parcels: [{ id:"p1", size:"S", prefs:["A"] }]
 *   }).placed.A.S === ["p1"]
 *
 *   If S unavailable but M available at preferred site: a size "S" parcel can take an "M" locker at that site.
 */


type Input = {
    sites: Sites, // capacities (integers >= 0)
    parcels: Parcel[]  // prefs is ordered; may be empty
}
type Size = "S" | "M" | "L"
type SiteId = string
type Sites = { [siteId: SiteId]: Capacity } // capacities (integers >= 0)
type Capacity = { S: number; M: number; L: number }
type Parcel = {
    id: string;
    size: Size;
    prefs: string[]
}

type Waitlist = string[]
type Output = {
    placed: {}
    remaining: Sites,
    waitlist: Waitlist
}

export function assignParcelsToLockers(input: Input): Output {
    let currentSites = structuredClone(input.sites)
    let result: Output = {
        placed: {},
        remaining: currentSites,
        waitlist: []
    }

    for (const request of input.parcels) {
        result = processParcel(request, currentSites, result)
    }

    return result
}

function processParcel(parcel: Parcel, sites: Sites, res: Output): Output {
    let processed = false

    for (const pref of parcel.prefs) {
        for (const site in sites) {
            if (site == pref && !processed) {
                ({res,processed} = handleSize(site, parcel, res, processed))
            }
        }
    }

    //waitlisted
    if (!processed) res.waitlist.push(parcel.id)
        
    return res
}


function handleSize(spot: SiteId, parcel: Parcel, current: Output, processed:Boolean):{res:Output,processed:boolean} {
    const capacity = current.remaining[spot]
    let i:number
    switch (parcel.size) {
        case 'S': i = 0; break;
        case 'M': i = 1; break;
        case 'L': i = 2; break;
    }

    const order: Size[] = ["S", "M", "L"]
    for (i; i <= 2; i++) {
        if (capacity[order[i]] > 0) {
            current = updateResult(current, spot, parcel, order[i])
            return {res:current, processed:true}
        }
    }

    return {res:current, processed:false}
}

function updateResult(result: Output, spot: SiteId, parcel: Parcel, size: Size): Output {
    result.remaining[spot][size]--
    if ((result.placed[spot]?.[size])==undefined) result = createPlacedArray(result, spot, parcel, size)
    else { result.placed[spot][size].push(parcel.id) }
    return result
}

function createPlacedArray(result: Output, spot: SiteId, parcel: Parcel, size: Size): Output {
    const site = (result.placed[spot] ??= {});                  // create site map if absent
    const arr = (site[size] ??= [] as string[]);        // create the size array if absent
    console.log(`pushing ${parcel.id} at ${spot} where size is ${size}`)
    arr.push(parcel.id);

    return result;
}
