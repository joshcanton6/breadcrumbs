const baseURL = "https://api.spotify.com/v1";
const token = sessionStorage.getItem("access_token");

/**
 * Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
 * 
 * @param {string} id The Spotify ID of the album.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns Pages of tracks
 */
function getAlbumTracks(id, market=null, limit=20, offset=0) {
    return parseJSON(fetch(`${baseURL}/albums/${id}/tracks?market=${market}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Get Spotify catalog information about an artist's albums.
 * 
 * @param {string} id The Spotify ID of the artist.
 * @param {string} include_groups A comma-separated list of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are: `album`, `single`, `appears_on`, and `compilation`.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns Pages of albums
 */
function getArtistsAlbums(id, include_groups=null, market=null, limit=20, offset=0) {
    return parseJSON(fetch(`${baseURL}/artists/${id}/albums?include_groups=${include_groups}&market=${market}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Get full details of the items of a playlist owned by a Spotify user.
 * 
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {string} fields Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the total number of items and the request limit: `fields=total,limit`. A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. For example, to get just the added date and user ID of the adder: `fields=items(added_at,added_by.id)`. Use multiple parentheses to drill down into nested objects, for example: `fields=items(track(name,href,album(name,href)))`. Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=items.track.album(!external_urls,images)`.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @param {string} additional_types A comma-separated list of item types that your client supports besides the default track type. Valid types are: `track` and `episode`.
 * @returns Pages of tracks
 */
function getPlaylistItems(playlist_id, market=null, fields=null, limit=20, offset=0, additional_types=null) {
    return parseJSON(fetch(`${baseURL}/playlists/${playlist_id}/tracks?market=${market}&fields=${fields}&limit=${limit}&offset=${offset}&additional_types=${additional_types}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Get a list of the playlists owned or followed by the current Spotify user.
 * 
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100,000. Use with `limit` to get the next set of playlists.
 * @returns A paged set of playlists
 */
function getCurrentUsersPlaylists(limit=20, offset=0) {
    return parseJSON(fetch(`${baseURL}/me/playlists?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Get a list of the playlists owned or followed by a Spotify user.
 * 
 * @param {string} user_id The user's Spotify user ID.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100,000. Use with `limit` to get the next set of playlists.
 * @returns A paged set of playlists
 */
function getUsersPlaylists(user_id, limit=20, offset=0) {
    return parseJSON(fetch(`${baseURL}/users/${user_id}/playlists?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Get the current user's top artists or tracks based on calculated affinity.
 * 
 * @param {string} type The type of entity to return. Valid values: `artists` or `tracks`.
 * @param {string} time_range Over what time frame the affinities are computed. Valid values: `long_term` (calculated from ~1 year of data and including all new data as it becomes available), `medium_term` (approximately last 6 months), `short_term` (approximately last 4 weeks). Default: `medium_term`
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns Pages of artists or tracks
 */
function getUsersTopItems(type, time_range="medium_term", limit=20, offset=0) {
    return parseJSON(fetch(`${baseURL}/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    }));
}

/**
 * Parse and stringify the response from an API call.
 * 
 * @param {Promise} result A `Promise` containing the HTTP `Response` to the request.
 * @returns A JSON object
 */
function parseJSON(result) {
    /*
    return result.then(
        (response) => response.json()
    ).then(
        (json) => JSON.parse(JSON.stringify(json))
    );
    */

    return result.then((response) => response.json());
}

function testButton() {
    alert(getUsersTopItems("artists", "Short_term", 1));
}