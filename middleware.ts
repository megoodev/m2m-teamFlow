import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { get } from "http";
import { NextRequest, NextResponse } from "next/server";

const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: [
    detectBot({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
      allow: [
        "CATEGORY:MONITOR", // Uptime monitoring services
        "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
      ],
    }),
  ],
});
// Pass any existing middleware with the optional existingMiddleware prop


async function existingMiddleware(req: NextRequest) {
  const {getClaim} = getKindeServerSession()
  const getOrg = await getClaim("org_code")
  const nextUrl = req.nextUrl;
  if (nextUrl.pathname.startsWith('/workspace') && !nextUrl.pathname.includes(getOrg?.value || '')  ) {
    nextUrl.pathname = `workspace/${getOrg?.value}`
    return NextResponse.redirect(nextUrl)
  } 
  return NextResponse.next()
}
export const config = {

  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
export default createMiddleware(aj, existingMiddleware);