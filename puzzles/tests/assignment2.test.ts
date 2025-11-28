import { describe, it, expect } from "vitest";
import { scheduleBatch } from "../problems/assignment2";

describe("Assignment 2: The Scheduler", () => {
  const s1 = {
    id: "s1",
    region: "us-east",
    tags: ["linux"],
    capacity: { cpu: 100, mem: 100 },
    used: { cpu: 0, mem: 0 },
  };
  const s2 = {
    id: "s2",
    region: "us-west",
    tags: ["win"],
    capacity: { cpu: 100, mem: 100 },
    used: { cpu: 0, mem: 0 },
  };

  it("schedules a simple job to the correct region", () => {
    const job = {
      id: "j1",
      requiredRegion: "us-east",
      requiredTags: [],
      requirements: { cpu: 10, mem: 10 },
    };

    const result = scheduleBatch({ jobs: [job], servers: [s1, s2] });

    expect(result.failedJobs).toHaveLength(0);
    expect(result.scheduledJobs["s1"]).toContain("j1");
    expect(result.serverState.find((s) => s.id === "s1")?.used.cpu).toBe(10);
  });

  it("fails jobs that fit nowhere", () => {
    const hugeJob = {
      id: "huge",
      requiredTags: [],
      requirements: { cpu: 200, mem: 10 },
    };

    const result = scheduleBatch({ jobs: [hugeJob], servers: [s1] });

    expect(result.failedJobs).toContain("huge");
    expect(result.scheduledJobs["s1"]).toHaveLength(0);
  });

  it("stacks multiple jobs on the same server until full", () => {
    const jobs = [
      {
        id: "j1",
        requiredTags: [],
        requirements: { cpu: 40, mem: 10 },
      },
      {
        id: "j2",
        requiredTags: [],
        requirements: { cpu: 40, mem: 10 },
      },
      {
        id: "j3",
        requiredTags: [],
        requirements: { cpu: 40, mem: 10 },
      }, // 40+40+40 = 120 > 100, should fail
    ];

    const result = scheduleBatch({ jobs, servers: [s1] });

    expect(result.scheduledJobs["s1"]).toEqual(["j1", "j2"]);
    expect(result.failedJobs).toEqual(["j3"]);
    expect(result.serverState[0].used.cpu).toBe(80);
  });

  it("balances load between servers (prefer lowest cpu load)", () => {
    // Both servers are identical and fit the job.
    // j1 goes to s1 (tie break id).
    // j2 should go to s2 (because s1 has 10% load, s2 has 0%).
    const s1Copy = { ...s1 };
    const s1Clone = { ...s1, id: "s1-clone" }; // "s1" < "s1-clone"

    const jobs = [
      {
        id: "j1",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      },
      {
        id: "j2",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      },
    ];

    const result = scheduleBatch({ jobs, servers: [s1Copy, s1Clone] });

    expect(result.scheduledJobs["s1"]).toContain("j1");
    expect(result.scheduledJobs["s1-clone"]).toContain("j2");
  });
});
