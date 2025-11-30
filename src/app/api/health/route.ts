import { NextResponse } from "next/server";

/**
 * Health Check Endpoint
 *
 * Used by Docker healthcheck and monitoring systems to verify
 * the application is running and responsive.
 *
 * Returns:
 * - 200 OK with status info when healthy
 * - Can be extended to check database connectivity if needed
 */
export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    { status: 200 }
  );
}
