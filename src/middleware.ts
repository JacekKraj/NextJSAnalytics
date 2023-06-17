import { NextRequest, NextResponse } from "next/server";
import { initializeCookies } from "@/utils/cookies";

export const middleware = (request: NextRequest) => {
  let response = NextResponse.next();

  initializeCookies(request, response);

  return response;
};
