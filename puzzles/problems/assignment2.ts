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
type Resources = { cpu: number; mem: number };
type Server = {
  id: string;
  region: string;
  tags: string[];
  capacity: Resources;
  used: Resources;
};
type Job = {
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

export function scheduleBatch(input: SchedulerInput): SchedulerOutput {
  // Initialize state
  // We need to mutate 'serverState' as we go, or replace objects in it,
  // because the next job needs to see the updated capacity of the chosen server.
  let serverState = input.servers.map((s) => ({ ...s })); // Shallow copy to be safe
  const failedJobs: string[] = [];
  const scheduledJobs: Record<string, string[]> = {};

  // Initialize output map keys
  serverState.forEach((s) => (scheduledJobs[s.id] = []));

  for (const job of input.jobs) {
    // 1. Find candidates (Region & Tags & Capacity)
    const candidates = serverState.filter((server) => {
      // Check Region
      if (job.requiredRegion && job.requiredRegion !== server.region) {
        return false;
      }
      // Check Tags
      for (const tag of job.requiredTags) {
        if (!server.tags.includes(tag)) {
          return false;
        }
      }
      // Check Capacity
      const freeCpu = server.capacity.cpu - server.used.cpu;
      const freeMem = server.capacity.mem - server.used.mem;
      if (freeCpu < job.requirements.cpu || freeMem < job.requirements.mem) {
        return false;
      }

      return true;
    });

    // 2. Pick Best (Lowest CPU Load)
    // (Inlining the sort logic from Assignment 1)
    candidates.sort((a, b) => {
      const loadA = a.used.cpu / a.capacity.cpu;
      const loadB = b.used.cpu / b.capacity.cpu;
      if (loadA !== loadB) return loadA - loadB;
      return a.id.localeCompare(b.id);
    });

    const chosen = candidates[0];

    if (chosen) {
      // 3. Deploy (Update state)
      // We need to update the specific server in our `serverState` array
      const index = serverState.findIndex((s) => s.id === chosen.id);
      if (index !== -1) {
        serverState[index] = {
          ...chosen,
          used: {
            cpu: chosen.used.cpu + job.requirements.cpu,
            mem: chosen.used.mem + job.requirements.mem,
          },
        };
        scheduledJobs[chosen.id].push(job.id);
      }
    } else {
      // 4. Handle Failure
      failedJobs.push(job.id);
    }
  }

  return {
    serverState,
    scheduledJobs,
    failedJobs,
  };
}
