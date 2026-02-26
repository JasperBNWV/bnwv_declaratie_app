import { Configuration, PopupRequest } from "@azure/msal-browser"

export const msalConfig: Configuration = {
    auth: {
        clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
        authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
        redirectUri: import.meta.env.VITE_REDIRECT_URI,
    },
    cache: {
        cacheLocation: "sessionStorage",   // tab-gebonden, gewist bij sluiten browser
        storeAuthStateInCookie: false,
    },
}

export const loginRequest: PopupRequest = {
    scopes: ["Calendars.Read", "User.Read"],
}
