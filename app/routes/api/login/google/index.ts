import { createAPIFileRoute } from "@tanstack/start/api";
import { generateCodeVerifier, generateState } from "arctic";
import { googleAuth } from "~/utils/auth";
import { setCookie } from "vinxi/http";

const MAX_COOKIE_AGE_SECONDS = 60 * 10;

export const APIRoute = createAPIFileRoute("/api/login/google")({
  GET: async ({ request, params }) => {
    const url = new URL(request.url);
    const redirectUri = url.searchParams.get("redirect_uri") || "/";

    const state = generateState();
    const codeVerifier = generateCodeVerifier();
    const authorizationInfo = await googleAuth.createAuthorizationURL(
      state,
      codeVerifier,
      ["profile", "email"]
    );

    setCookie("google_oauth_state", state, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_COOKIE_AGE_SECONDS,
    });

    setCookie("google_code_verifier", codeVerifier, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_COOKIE_AGE_SECONDS,
    });

    setCookie("google_redirect_uri", redirectUri, {
      path: "/",
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: MAX_COOKIE_AGE_SECONDS,
    });

    return Response.redirect(authorizationInfo.href);
  },
});
