import * as Spotify from "./spotify.js"
import * as OAuth from "./oauth.js"

async function insertTopArtists() {
    const topArtists = await Spotify.getUsersTopItems(await OAuth.getToken(), "artists", "short_term", 10);
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
    /* edit this function for testing */
}

window.poke = poke;