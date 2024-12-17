const home = "https://joshcanton6.github.io/breadcrumbs"
const client_id = "70d3f1361abf4e1ab9e9e64089fabc36";
const redirect_uri = home + "/redirect";

function login() {
    const scope = "user-read-private" +
        " user-read-email" +
        " playlist-read-private" +
        " playlist-read-collaborative" +
        " playlist-modify-public" +
        " playlist-modify-private" +
        " ugc-image-upload";

    window.location.href = "https://accounts.spotify.com/authorize" +
        "?client_id=" + client_id +
        "&response_type=code" +
        "&redirect_uri=" + encodeURIComponent(redirect_uri) +
        "&scope=" + encodeURIComponent(scope) +
        "&show_dialog=true";
}

async function redirect() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
        document.getElementById("redirect_message").innerHTML = "Error: " + urlParams.get("error");
    }

    if (urlParams.has("code")) {
        document.getElementById("redirect_message").innerHTML = "Login successful, redirecting...";

        var token = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            body: "grant_type=authorization_code" +
                "&code=" + urlParams.get("code") +
                "&redirect_uri=" + encodeURIComponent(redirect_uri),
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                "Authorization": "Basic " + btoa(client_id + ":2f409da2aebf417893ff056f9b98c3ea")
            }
        }).then(
            (response) => response.json()
        ).then(
            (json) => JSON.parse(JSON.stringify(json))
        );

        sessionStorage.setItem("access_token", token["access_token"]);
        sessionStorage.setItem("refresh_token", token["refresh_token"]);
        sessionStorage.setItem("expires_at", Math.floor(Date.now() / 1000) + token["expires_in"]);

        window.location.href = home;
    }
}