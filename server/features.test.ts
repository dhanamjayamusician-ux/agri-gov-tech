import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock context
function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Plant Health Detection API", () => {
  it("should detect rice leaf blast disease", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.plantHealth.detectDisease({
      cropType: "rice",
      imageBase64: "mock-image-data",
    });

    expect(result.success).toBe(true);
    expect(result.disease).toBe("Leaf Blast");
    expect(result.confidence).toBeGreaterThan(0.8);
    expect(result.recommendation).toContain("carbendazim");
  });

  it("should detect sugarcane red rot disease", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.plantHealth.detectDisease({
      cropType: "sugarcane",
    });

    expect(result.success).toBe(true);
    expect(result.disease).toBe("Red Rot Disease");
    expect(result.confidence).toBeGreaterThan(0.8);
  });

  it("should handle unknown crop types gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.plantHealth.detectDisease({
      cropType: "unknown-crop",
    });

    expect(result.success).toBe(true);
    expect(result.disease).toBe("Unknown Disease");
    expect(result.confidence).toBeLessThan(0.8);
  });

  it("should return timestamp for each detection", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.plantHealth.detectDisease({
      cropType: "cotton",
    });

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});

describe("Voice Assistant & Schemes API", () => {
  it("should retrieve all government schemes", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.voiceAssistant.getSchemes({});

    expect(result.success).toBe(true);
    expect(result.schemes).toBeDefined();
    expect(result.total).toBeGreaterThan(0);
    expect(Array.isArray(result.schemes)).toBe(true);
  });

  it("should filter schemes by category", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.voiceAssistant.getSchemes({
      category: "Rythu",
    });

    expect(result.success).toBe(true);
    expect(result.schemes.length).toBeGreaterThan(0);
    expect(result.schemes[0].name).toContain("Rythu");
  });

  it("should return scheme details with eligibility and application info", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.voiceAssistant.getSchemes({});

    expect(result.schemes.length).toBeGreaterThan(0);
    const scheme = result.schemes[0];
    expect(scheme).toHaveProperty("id");
    expect(scheme).toHaveProperty("name");
    expect(scheme).toHaveProperty("description");
    expect(scheme).toHaveProperty("amount");
  });
});

describe("Emergency Alert API", () => {
  it("should report emergency and return responder info", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emergencyAlert.reportEmergency({
      emergencyType: "medical",
      description: "Patient with acute chest pain",
      latitude: 17.6869,
      longitude: 83.2185,
      location: "Visakhapatnam Hospital",
    });

    expect(result.success).toBe(true);
    expect(result.alertId).toBeDefined();
    expect(result.status).toBe("dispatched");
    expect(result.responder).toBeDefined();
    expect(result.responder.name).toBeDefined();
    expect(result.responder.eta).toBeDefined();
  });

  it("should capture GPS coordinates in emergency alert", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const latitude = 17.6869;
    const longitude = 83.2185;

    const result = await caller.emergencyAlert.reportEmergency({
      emergencyType: "agricultural",
      description: "Crop damage due to pest infestation",
      latitude,
      longitude,
    });

    expect(result.coordinates.latitude).toBe(latitude);
    expect(result.coordinates.longitude).toBe(longitude);
  });

  it("should handle different emergency types", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const emergencyTypes = ["medical", "agricultural", "natural", "security"];

    for (const type of emergencyTypes) {
      const result = await caller.emergencyAlert.reportEmergency({
        emergencyType: type,
        description: `Test ${type} emergency`,
        latitude: 17.6869,
        longitude: 83.2185,
      });

      expect(result.success).toBe(true);
      expect(result.status).toBe("dispatched");
    }
  });

  it("should return ETA for emergency response", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emergencyAlert.reportEmergency({
      emergencyType: "medical",
      description: "Emergency test",
      latitude: 17.6869,
      longitude: 83.2185,
    });

    expect(result.responder.eta).toBeDefined();
    expect(result.responder.eta).toMatch(/\d+ mins/);
  });

  it("should include timestamp for alert tracking", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.emergencyAlert.reportEmergency({
      emergencyType: "medical",
      description: "Emergency test",
      latitude: 17.6869,
      longitude: 83.2185,
    });

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});

describe("API Response Validation", () => {
  it("all API responses should include success flag", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const diseaseResult = await caller.plantHealth.detectDisease({ cropType: "rice" });
    expect(diseaseResult.success).toBe(true);

    const schemesResult = await caller.voiceAssistant.getSchemes({});
    expect(schemesResult.success).toBe(true);

    const emergencyResult = await caller.emergencyAlert.reportEmergency({
      emergencyType: "medical",
      description: "Test",
      latitude: 17.6869,
      longitude: 83.2185,
    });
    expect(emergencyResult.success).toBe(true);
  });

  it("should handle concurrent API calls", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const promises = [
      caller.plantHealth.detectDisease({ cropType: "rice" }),
      caller.plantHealth.detectDisease({ cropType: "cotton" }),
      caller.voiceAssistant.getSchemes({}),
      caller.emergencyAlert.reportEmergency({
        emergencyType: "medical",
        description: "Test",
        latitude: 17.6869,
        longitude: 83.2185,
      }),
    ];

    const results = await Promise.all(promises);

    expect(results.length).toBe(4);
    results.forEach(result => {
      expect(result.success).toBe(true);
    });
  });
});
