import * as Spotify from "./spotify.js"

// #region Constants

const home = "https://joshcanton6.github.io/breadcrumbs"
const redirect_uri = home + "/redirect";
const client_id = "70d3f1361abf4e1ab9e9e64089fabc36";
const scope = "user-top-read";
const spotifyLoginButton = document.getElementById("spotify-login-button");

// #endregion Constants
// #region Functions

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
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa(`${client_id}:2f409da2aebf417893ff056f9b98c3ea`)}`
            },
            body: new URLSearchParams({
                "grant_type": "authorization_code",
                "code": urlParams.get("code"),
                redirect_uri
            })
        });
        const token = await response.json();
        localStorage.setItem("access_token", token["access_token"]);
        localStorage.setItem("refresh_token", token["refresh_token"]);
        localStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);
        window.location.href = `${home}/app`;
    }
    else if (urlParams.has("error")) {
        document.getElementById("redirect-message").innerHTML = `Error: ${urlParams.get("error")}`;
    }
    else {
        window.location.href = home;
    }
}

async function getToken() {
    if (localStorage.getItem("expires_at") - Math.floor(Date.now() / 1000) <= 0) {
        await refreshToken();
    }
    return localStorage.getItem("access_token");
}

async function refreshToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa(`${client_id}:2f409da2aebf417893ff056f9b98c3ea`)}`
        },
        body: new URLSearchParams({
            "grant_type": "refresh_token",
            "refresh_token": localStorage.getItem("refresh_token"),
            client_id
        })
    });
    const token = await response.json();
    localStorage.setItem("access_token", token["access_token"]);
    localStorage.setItem("refresh_token", token["refresh_token"]);
    localStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);
}

async function insertTopArtists() {
    const topArtists = await Spotify.getUsersTopItems(await getToken(), "artists", "short_term", 10);
    let innerHTMLContent = "";
    for (const artist of topArtists["items"]) {
        innerHTMLContent += `
            <tr>
                <td><input type="checkbox" name="artist" value="${artist["id"]}"></td><td>${artist["name"]}</td>
            </tr>
        `
    }
    document.getElementById("top-artists").innerHTML = innerHTMLContent;
}

async function poke() {
    /* edit this function in the console for testing/debugging */
}

// #endregion Functions
// #region Listeners

window.poke = poke;
if (spotifyLoginButton) spotifyLoginButton.addEventListener("click", login);
if (window.location.origin + window.location.pathname == redirect_uri) redirect();

// #endregion Listeners