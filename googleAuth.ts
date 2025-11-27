declare global {
  interface Window { google: any }
}

const CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string;
if (!CLIENT_ID) {
  console.warn("Missing VITE_GOOGLE_CLIENT_ID in .env");
}

const SCOPES = [
  "openid",
  "profile",
  "email",
  "https://www.googleapis.com/auth/youtube.force-ssl"
].join(" ");

let tokenClient: any = null;
let tokenCallback: ((tokenResp: any) => void) | null = null;

export function initGoogle(cb: (tokenResponse: any) => void) {
  if (!window.google) {
    console.warn("Google script not loaded yet (window.google is missing).");
    return;
  }
  if (tokenClient) {
    
    tokenCallback = cb;
    return tokenClient;
  }

  tokenCallback = cb;

  tokenClient = window.google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse: any) => {
      if (tokenCallback) tokenCallback(tokenResponse);
    },
  });

  return tokenClient;
}


export function startSignIn() {
  if (!tokenClient) throw new Error("Google client not initialized.");
  
  tokenClient.requestAccessToken();
}


export async function revokeToken(accessToken: string) {
  if (!accessToken) return;
  await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
  });
}
