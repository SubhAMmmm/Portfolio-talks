// Load environment variables FIRST before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

(async () => {
  // Log environment variables for debugging
  console.log("\n🔍 Environment check:");
  console.log("- NODE_ENV:", process.env.NODE_ENV || "development");
  console.log(
    "- GEMINI_API_KEY:",
    process.env.GEMINI_API_KEY ? "✅ Set" : "❌ Not set",
  );
  console.log(
    "- GOOGLE_API_KEY:",
    process.env.GOOGLE_API_KEY ? "✅ Set" : "❌ Not set",
  );
  console.log(
    "- ANTHROPIC_API_KEY:",
    process.env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Not set",
  );

  if (!process.env.GEMINI_API_KEY && !process.env.GOOGLE_API_KEY) {
    console.error("\n⚠️  WARNING: No Gemini/Google API key found!");
    console.error("Please create a .env file with:");
    console.error("GEMINI_API_KEY=your_api_key_here\n");
  }

  await registerRoutes(httpServer, app);

  // Catch-all for API routes to prevent falling through to Vite middleware
  app.use("/api/*", (_req, res) => {
    res.status(404).json({ error: "API route not found" });
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5173", 10);

  httpServer.listen(
    {
      port,
      host: "127.0.0.1",
    },
    () => {
      log(`🚀 Server running on http://localhost:${port}`);
    },
  );
})();