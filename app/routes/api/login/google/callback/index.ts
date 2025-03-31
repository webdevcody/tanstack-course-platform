import { createAPIFileRoute } from "@tanstack/react-start/api";
import { OAuth2RequestError } from "arctic";
import { getAccountByGoogleIdUseCase } from "~/use-cases/accounts";
import { GoogleUser } from "~/use-cases/types";
import { createGoogleUserUseCase } from "~/use-cases/users";
import { googleAuth } from "~/utils/auth";
import { setSession } from "~/utils/session";
import { deleteCookie, getCookie } from "vinxi/http";

const AFTER_LOGIN_URL = "/";

export const APIRoute = createAPIFileRoute("/api/login/google/callback")({
  GET: async ({ request, params }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const storedState = getCookie("google_oauth_state") ?? null;
    const codeVerifier = getCookie("google_code_verifier") ?? null;
    const redirectUri = getCookie("google_redirect_uri") ?? AFTER_LOGIN_URL;

    if (
      !code ||
      !state ||
      !storedState ||
      state !== storedState ||
      !codeVerifier
    ) {
      return new Response(null, { status: 400 });
    }

    deleteCookie("google_oauth_state");
    deleteCookie("google_code_verifier");
    deleteCookie("google_redirect_uri");

    try {
      const tokens = await googleAuth.validateAuthorizationCode(
        code,
        codeVerifier
      );
      const response = await fetch(
        "https://openidconnect.googleapis.com/v1/userinfo",
        { headers: { Authorization: `Bearer ${tokens.accessToken()}` } }
      );

      const googleUser: GoogleUser = await response.json();

      const existingAccount = await getAccountByGoogleIdUseCase(googleUser.sub);

      if (existingAccount) {
        await setSession(existingAccount.userId);
        return new Response(null, {
          status: 302,
          headers: { Location: redirectUri },
        });
      }

      const userId = await createGoogleUserUseCase(googleUser);

      await setSession(userId);

      return new Response(null, {
        status: 302,
        headers: { Location: redirectUri },
      });
    } catch (e) {
      console.error(e);
      // the specific error message depends on the provider
      if (e instanceof OAuth2RequestError) {
        // invalid code
        return new Response(null, { status: 400 });
      }
      return new Response(null, { status: 500 });
    }
  },
});
