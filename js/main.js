import * as Spotify from "./spotify.js"

// #region Constants

const home = "https://joshcanton6.github.io/breadcrumbs"
const redirectURI = home + "/redirect";
const clientID = "70d3f1361abf4e1ab9e9e64089fabc36";
const spotifyLoginButton = document.getElementById("spotify-login-button");
const debugButton = document.getElementById("debug-button");

// #endregion Constants
// #region Functions

function login() {
    const scopes = [
        "user-top-read"
    ];
    const scope = scopes.join(" ");
    const authOptions = `?${[
        `client_id=${clientID}`,
        "response_type=code",
        `redirect_uri=${encodeURIComponent(redirectURI)}`,
        `scope=${encodeURIComponent(scope)}`,
        "show_dialog=true"
    ].join("&")}`;
    window.location.href = "https://accounts.spotify.com/authorize" + authOptions;
}

async function redirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
        document.getElementById("redirect-message").innerHTML = `Error: ${urlParams.get("error")}`;
    }
    if (urlParams.has("code")) {
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: [
                "grant_type=authorization_code",
                `code=${urlParams.get("code")}`,
                `redirect_uri=${encodeURIComponent(redirectURI)}`
            ].join("&"),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa(`${clientID}:2f409da2aebf417893ff056f9b98c3ea`)}`
            }
        });
        const token = await response.json();
        sessionStorage.setItem("access_token", token["access_token"]);
        sessionStorage.setItem("refresh_token", token["refresh_token"]);
        sessionStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);
        window.location.href = `${home}/app`;
    }
}

function getToken() {
    return sessionStorage.getItem("access_token");
}

function refreshToken() {
    
}

async function debugAction() {
    let data = await Spotify.getUsersTopItems(getToken(), "artists", "short_term");
    document.getElementById("debug-data").innerHTML = data["items"][0]["name"];
}

// #endregion Functions
// #region Listeners

if (spotifyLoginButton) spotifyLoginButton.addEventListener("click", login);
if (window.location.origin + window.location.pathname == redirectURI) redirect();
if (debugButton) debugButton.addEventListener("click", debugAction);

// #endregion Listeners