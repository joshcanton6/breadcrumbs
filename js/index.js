import * as OAuth from "./auth.js"

const home = "https://joshcanton6.github.io/breadcrumbs"
const redirect_uri = OAuth.redirect_uri;
const client_id = OAuth.client_id;
const scope = encodeURIComponent("user-top-read");
const spotifyLoginButton = document.getElementById("spotify-login-button");

function login() {
    const authOptions = new URLSearchParams({
        client_id,
        "response_type": "code",
        redirect_uri,
        scope
    });
    window.location.href = `https://accounts.spotify.com/authorize?${authOptions}`;
}

async function redirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("code")) {
        await OAuth.fetchToken("authorization_code", urlParams.get("code"));
        window.location.href = `${home}/app`;
    }
    else if (urlParams.has("error")) {
        document.getElementById("redirect-message").innerHTML = `Error: ${urlParams.get("error")}`;
    }
    else {
        window.location.href = home;
    }
}

async function poke() {
    /* edit this function for testing */
}

window.poke = poke;
if (spotifyLoginButton) spotifyLoginButton.addEventListener("click", login);
if (window.location.origin + window.location.pathname == redirect_uri) redirect();