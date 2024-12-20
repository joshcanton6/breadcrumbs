import * as Spotify from "./spotify.js"

// #region Constants

const home = "https://joshcanton6.github.io/breadcrumbs"
const redirectURI = home + "/redirect";
const clientID = "70d3f1361abf4e1ab9e9e64089fabc36";
const spotifyLoginButton = document.getElementById("spotify-login-button");

// #endregion Constants

// #region Functions

function login() {
    const scope = "user-read-private" +
        " user-read-email" +
        " playlist-read-private" +
        " playlist-read-collaborative" +
        " playlist-modify-public" +
        " playlist-modify-private" +
        " ugc-image-upload" +
        " user-top-read";

    window.location.href = "https://accounts.spotify.com/authorize" +
        "?client_id=" + clientID +
        "&response_type=code" +
        "&redirect_uri=" + encodeURIComponent(redirectURI) +
        "&scope=" + encodeURIComponent(scope) +
        "&show_dialog=true";
}

async function redirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
        document.getElementById("redirect-message").innerHTML = "Error: " + urlParams.get("error");
    }

    if (urlParams.has("code")) {
        var token = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: "grant_type=authorization_code" +
                "&code=" + urlParams.get("code") +
                "&redirect_uri=" + encodeURIComponent(redirectURI),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(clientID + ":2f409da2aebf417893ff056f9b98c3ea")
            }
        }).then(
            (response) => response.json()
        );

        sessionStorage.setItem("access_token", token["access_token"]);
        sessionStorage.setItem("refresh_token", token["refresh_token"]);
        sessionStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);

        window.location.href = home + "/app";
    }
}

// #endregion Functions

// #region Listeners

if (spotifyLoginButton) spotifyLoginButton.addEventListener("click", login);
if (window.location.origin + window.location.pathname == redirectURI) redirect();

// #endregion Listeners