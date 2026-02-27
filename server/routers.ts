import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

// Disease Database
const diseaseDB: Record<string, any> = {
  rice: { disease: 'Leaf Blast', recommendation: 'Use resistant varieties. Apply carbendazim.', confidence: 0.92 },
  sugarcane: { disease: 'Red Rot Disease', recommendation: 'Remove infected plants. Use certified seed.', confidence: 0.88 },
  groundnut: { disease: 'Leaf Spot', recommendation: 'Apply mancozeb 75% WP. Rotate crops yearly.', confidence: 0.85 },
  cotton: { disease: 'Leaf Curl Virus', recommendation: 'Control whiteflies with neem oil. Use resistant varieties.', confidence: 0.90 },
};

const schemes = [
  { id: 'ap-rythu-bharosa', name: 'AP Rythu Bharosa', description: 'Direct income support', amount: '₹12,500/year' },
  { id: 'pm-kisan', name: 'PM-KISAN', description: 'Central government support', amount: '₹6,000/year' },
  { id: 'crop-insurance', name: 'Crop Insurance', description: 'Fasal Bima Yojana', amount: 'Varies' },
];

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  plantHealth: router({
    detectDisease: publicProcedure
      .input(z.object({ cropType: z.string(), imageBase64: z.string().optional() }))
      .mutation(async ({ input }) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const disease = diseaseDB[input.cropType.toLowerCase()] || {
          disease: 'Unknown Disease',
          recommendation: 'Consult agricultural expert.',
          confidence: 0.65,
        };
        return { success: true, cropType: input.cropType, ...disease, timestamp: new Date().toISOString() };
      }),
  }),

  voiceAssistant: router({
    getSchemes: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(({ input }) => {
        let filtered = schemes;
        if (input.category) {
          filtered = schemes.filter(s => s.name.toLowerCase().includes(input.category!.toLowerCase()));
        }
        return { success: true, schemes: filtered, total: filtered.length };
      }),
  }),

  emergencyAlert: router({
    reportEmergency: publicProcedure
      .input(z.object({
        emergencyType: z.string(),
        description: z.string(),
        latitude: z.number(),
        longitude: z.number(),
        location: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        const eta = Math.floor(Math.random() * 20 + 5);
        return {
          success: true,
          alertId: Date.now().toString(),
          status: 'dispatched',
          responder: { name: 'Responder Unit 101', phone: '102', eta: `${eta} mins` },
          coordinates: { latitude: input.latitude, longitude: input.longitude },
          timestamp: new Date().toISOString(),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
