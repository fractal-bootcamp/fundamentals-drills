import { describe, it, expect } from "vitest";
import {
  checkCapabilities,
  checkCapacity,
  findBestServer,
  deployJob,
  type Server,
  type Job,
} from "../problems/assignment1";

describe("Assignment 1: Scheduler Primitives", () => {
  const baseServer: Server = {
    id: "s1",
    region: "us-east",
    tags: ["linux", "gpu"],
    capacity: { cpu: 100, mem: 64 },
    used: { cpu: 0, mem: 0 },
  };

  describe("checkCapabilities", () => {
    it("matches when region and tags align", () => {
      const job: Job = {
        id: "j1",
        requiredRegion: "us-east",
        requiredTags: ["gpu"],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapabilities(baseServer, job)).toBe(true);
    });

    it("matches when region is optional", () => {
      const job: Job = {
        id: "j1",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapabilities(baseServer, job)).toBe(true);
    });

    it("fails when region mismatch", () => {
      const job: Job = {
        id: "j1",
        requiredRegion: "eu-west",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapabilities(baseServer, job)).toBe(false);
    });

    it("fails when missing a required tag", () => {
      const job: Job = {
        id: "j1",
        requiredTags: ["windows"],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapabilities(baseServer, job)).toBe(false);
    });
  });

  describe("checkCapacity", () => {
    it("passes when plenty of space", () => {
      const s = { ...baseServer, used: { cpu: 50, mem: 10 } };
      const job: Job = {
        id: "j",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapacity(s, job)).toBe(true);
    });

    it("fails when CPU insufficient", () => {
      const s = { ...baseServer, used: { cpu: 95, mem: 0 } };
      const job: Job = {
        id: "j",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapacity(s, job)).toBe(false);
    });

    it("fails when Memory insufficient", () => {
      const s = { ...baseServer, used: { cpu: 0, mem: 60 } };
      const job: Job = {
        id: "j",
        requiredTags: [],
        requirements: { cpu: 10, mem: 10 },
      };
      expect(checkCapacity(s, job)).toBe(false);
    });
  });

  describe("findBestServer", () => {
    it("picks the server with lowest CPU load", () => {
      const s1 = { ...baseServer, id: "A", used: { cpu: 50, mem: 0 } }; // 50%
      const s2 = { ...baseServer, id: "B", used: { cpu: 10, mem: 0 } }; // 10%
      const s3 = { ...baseServer, id: "C", used: { cpu: 80, mem: 0 } }; // 80%
      expect(findBestServer([s1, s2, s3])?.id).toBe("B");
    });

    it("uses ID as tie breaker", () => {
      const s1 = { ...baseServer, id: "server-2", used: { cpu: 10, mem: 0 } };
      const s2 = { ...baseServer, id: "server-1", used: { cpu: 10, mem: 0 } };
      expect(findBestServer([s1, s2])?.id).toBe("server-1");
    });

    it("returns null for empty list", () => {
      expect(findBestServer([])).toBe(null);
    });
  });

  describe("deployJob", () => {
    it("returns a new server with increased usage", () => {
      const initial = { ...baseServer, used: { cpu: 10, mem: 10 } };
      const job: Job = {
        id: "j",
        requiredTags: [],
        requirements: { cpu: 5, mem: 20 },
      };

      const result = deployJob(initial, job);

      expect(result.used.cpu).toBe(15);
      expect(result.used.mem).toBe(30);
      expect(result).not.toBe(initial); // Reference check
    });
  });
});
