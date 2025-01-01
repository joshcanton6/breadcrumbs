export const redirect_uri = `https://joshcanton6.github.io/breadcrumbs/redirect`;
export const client_id = "70d3f1361abf4e1ab9e9e64089fabc36";

/**
 * Fetches a token to use with the Spotify Web API.
 * @param {string} grant_type Which type of token to fetch. Acceptable values are `authorization_code` or `refresh_token`.
 * @param {string} code The code used to request an access token. Required when `grant_type` is `authorization_code`.
 */
export async function fetchToken(grant_type, code=null) {
    let body;
    if (grant_type === "authorization_code") body = new URLSearchParams({grant_type, code, redirect_uri});
    else if (grant_type === "refresh_token") body = new URLSearchParams({
        grant_type,
        "refresh_token": localStorage.getItem("refresh_token"),
        client_id
    });
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${client_id}:2f409da2aebf417893ff056f9b98c3ea`)}`
        },
        body
    });
    const token = await response.json();
    localStorage.setItem("access_token", token["access_token"]);
    localStorage.setItem("refresh_token", token["refresh_token"]);
    localStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);
}

/**
 * Get the access token from local storage.
 * @returns {Promise<string>} An access token
 */
export async function getToken() {
    if (localStorage.getItem("expires_at") - Math.floor(Date.now() / 1000) <= 0) {
        await fetchToken("refresh_token");
    }
    return localStorage.getItem("access_token");
}