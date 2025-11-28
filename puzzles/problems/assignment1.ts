// Problem: Cloud Scheduler Primitives
// We are building a job scheduler for a cloud platform.
// To keep things clean, we are breaking the logic down into 4 independent helper functions.
// These functions will handle validation, capacity checking, sorting, and state updates.

// SHARED TYPES (Used in both assignments)
import { type Job, type Server, type Resources } from "./assignment2";

// ------------------------------------------------------------------

// Function 1: Check Capabilities
// Return true if the server matches the job's region (if job has one)
// AND the server has ALL the tags the job requires.
//
// Input: Server object, Job object
// Output: boolean
//
// Examples:
// Server: { region: "us-east", tags: ["linux", "gpu"] ... }
// Job: { requiredRegion: "us-east", requiredTags: ["gpu"] ... }
// => true
//
// Job: { requiredRegion: "eu-west" ... }
// => false (region mismatch)

export function checkCapabilities(server: Server, job: Job): boolean {
  for (const tag of job.requiredTags) {
    if (!server.tags.includes(tag)) {
      return false;
    }
  }
  if (job.requiredRegion && job.requiredRegion !== server.region) {
    return false;
  }
  return true;
}

// ------------------------------------------------------------------

// Function 2: Check Capacity
// Return true if the server has enough REMAINING capacity for the job.
// Remaining = (capacity - used).
//
// Input: Server object, Job object
// Output: boolean
//
// Examples:
// Server: { capacity: {cpu:100, mem:100}, used: {cpu:90, mem:50} } (Free: 10 cpu, 50 mem)
// Job: { requirements: {cpu: 5, mem: 20} }
// => true (5 <= 10 AND 20 <= 50)
//
// Job: { requirements: {cpu: 15, mem: 20} }
// => false (15 > 10, not enough CPU)

export function checkCapacity(server: Server, job: Job): boolean {
  const freeCpu = server.capacity.cpu - server.used.cpu;
  const freeMem = server.capacity.mem - server.used.mem;

  if (freeCpu < job.requirements.cpu || freeMem < job.requirements.mem) {
    return false;
  }
  return true;
}

// ------------------------------------------------------------------

// Function 3: Find Best Server
// Given a list of VALID candidate servers, pick the "best" one.
// Rule: Prefer the server with the LOWEST current CPU usage percentage (used.cpu / capacity.cpu).
// If tie, pick the one with the alphanumeric smallest ID.
// Return null if the array is empty.
//
// Input: Server[]
// Output: Server | null
//
// Examples:
// [ {id:"A", load: 50%}, {id:"B", load: 10%}, {id:"C", load: 80%} ]
// => Server "B" (lowest load)
//
// [ {id:"S2", load: 20%}, {id:"S1", load: 20%} ]
// => Server "S1" (tie-breaker: "S1" < "S2")

export function findBestServer(servers: Server[]): Server | null {
  if (!servers || servers.length === 0) {
    return null;
  }

  let bestServer = servers[0];
  let bestLoad = bestServer.used.cpu / bestServer.capacity.cpu;

  for (const server of servers) {
    const currentLoad = server.used.cpu / server.capacity.cpu;

    if (currentLoad < bestLoad) {
      bestServer = server;
      bestLoad = currentLoad;
    } else if (currentLoad === bestLoad) {
      if (server.id < bestServer.id) {
        bestServer = server;
      }
    }
  }
  return bestServer;
}

// ------------------------------------------------------------------

// Function 4: Deploy Job
// Return a NEW Server object with the job's requirements added to the 'used' stats.
// Do NOT mutate the original server.
//
// Input: Server object, Job object
// Output: New Server object
//
// Examples:
// Server: { used: {cpu: 10, mem: 10} ... }
// Job: { requirements: {cpu: 5, mem: 5} ... }
// => New Server { used: {cpu: 15, mem: 15} ... }

export function deployJob(server: Server, job: Job): Server {
  return {
    ...server,
    used: {
      cpu: server.used.cpu + job.requirements.cpu,
      mem: server.used.mem + job.requirements.mem,
    },
  };
}
