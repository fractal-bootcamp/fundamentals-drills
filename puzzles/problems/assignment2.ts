/*
Assignment 2: The Batch Scheduler

Context:
You are implementing the core loop of the cloud scheduler.
You have a list of incoming Jobs and a cluster of current Servers.
You need to process the jobs one-by-one and attempt to schedule them
on the best available server.

Input:
{
  jobs: Job[],
  servers: Server[]
}

Rules:
- Process jobs in order.
- For each job:
  1. Filter for servers that match the job's Capabilities (Region + Tags).
  2. Filter those candidates for servers that have enough Capacity (Cpu + Mem).
  3. Pick the "Best" server from the remaining list (Lowest CPU load %, tie-break ID).
  4. If a server is found:
     - "Deploy" the job (update the server's used resources).
     - Add the job ID to the server's running list of jobs.
  5. If no server is found:
     - Add the job ID to the 'failedJobs' list.

- Return:
  {
    serverState: Server[], // The final state of all servers
    scheduledJobs: Record<string, string[]>, // Map of serverId -> [jobId, jobId]
    failedJobs: string[] // List of job IDs that couldn't be scheduled
  }

Edge Cases:
- No jobs? Return current server state.
- No servers? All jobs fail.
- Jobs with requirements > max server capacity? Fail.

Examples:
- jobs=[{id:'j1', ...}], servers=[{id:'s1', ...}]
  -> j1 fits s1 -> { scheduledJobs: {s1: ['j1']}, failedJobs: [], serverState: [updatedS1] }
- jobs=[{id:'huge', ...}], servers=[{id:'tiny', ...}]
  -> huge doesn't fit -> { scheduledJobs: {tiny: []}, failedJobs: ['huge'], ... }

NOTE:
You may copy helper functions from Assignment 1 or re-write them locally.
This assignment is about ORCHESTRATING those helpers.
*/

// Re-defining types for self-containment (normally you'd import)
export type Resources = { cpu: number; mem: number };
export type Server = {
  id: string;
  region: string;
  tags: string[];
  capacity: Resources;
  used: Resources;
};
export type Job = {
  id: string;
  requiredRegion?: string;
  requiredTags: string[];
  requirements: Resources;
};

type SchedulerInput = {
  jobs: Job[];
  servers: Server[];
};

type SchedulerOutput = {
  serverState: Server[];
  scheduledJobs: Record<string, string[]>;
  failedJobs: string[];
};

import {
  checkCapabilities,
  checkCapacity,
  findBestServer,
  deployJob,
} from "./assignment1";

export function scheduleBatch(input: SchedulerInput): SchedulerOutput {
  // Initialize state
  // We need to mutate 'serverState' as we go, or replace objects in it,
  // because the next job needs to see the updated capacity of the chosen server.
  const { jobs } = input;

  const serverState: Array<Server> = structuredClone(input.servers);
  const scheduledJobs: Record<string, Array<string>> = {};
  const failedJobs: Array<string> = [];

  // init scheduledJobs Array
  input.servers.forEach((server) => {
    scheduledJobs[server.id] = [];
  });

  // filter for jobCapabilities
  for (const job of jobs) {
    const candidates = serverState.filter((server) => checkCapabilities(server, job));
    const validServers = candidates.filter((candidate) => checkCapacity(candidate, job));
    const chosenServer = findBestServer(validServers);

    if (!chosenServer) {
      failedJobs.push(job.id);
    } else {
      const updatedServer = deployJob(chosenServer, job);
      const index = serverState.findIndex((server) => server.id === chosenServer.id);
      serverState[index] = updatedServer;
      scheduledJobs[chosenServer.id].push(job.id);
    }
  }
  return {
    serverState,
    scheduledJobs,
    failedJobs,
  };
}
