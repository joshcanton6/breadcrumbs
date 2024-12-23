/**
 * The base address of the Web API.
 * @type {string}
 */
const baseURL = "https://api.spotify.com/v1";

/**
 * @typedef {Object} PlaylistDetails
 * @property {string} [name] The new name for the playlist.
 * @property {boolean} [public_playlist] The playlist's public/private status: `true` the playlist will be public, `false` the playlist will be private, `null` the playlist status is not relevant.
 * @property {boolean} [collaborative] If `true`, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client. You can only set `collaborative` to `true` on non-public playlists.
 * @property {string} [description] Value for playlist description as displayed in Spotify Clients and in the Web API.
 */

/**
 * @typedef {Object} PlaylistRange
 * @property {number} range_start The position of the first item to be reordered.
 * @property {number} insert_before The position where the items should be inserted.
 * @property {number} [range_length] The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the `range_start` position, and includes the `range_length` subsequent items.
 * @property {string} [snapshot_id] The playlist's snapshot ID against which you want to make the changes.
 */

/**
 * Get Spotify catalog information for a single album.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the album.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} An album
 */
export async function getAlbum(token, id, market=null) {
    return await parseJSON(fetch(`${baseURL}/albums/${id}?market=${market}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A set of albums
 */
export async function getSeveralAlbums(token, ids, market=null) {
    return await parseJSON(fetch(`${baseURL}/albums?${ids}&market=${market}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information about an album’s tracks. Optional parameters can be used to limit the number of tracks returned.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the album.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} Pages of tracks
 */
export async function getAlbumTracks(token, id, market=null, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/albums/${id}/tracks?market=${market}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a list of the albums saved in the current Spotify user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} Pages of albums
 */
export async function getUsersSavedAlbums(token, limit=20, offset=0, market=null) {
    return await parseJSON(fetch(`${baseURL}/me/albums?limit=${limit}&offset=${offset}&market=${market}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Save one or more albums to the current user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs. Alternatively, an array of the Spotify IDs. A maximum of 50 items can be specified in one request.
 * @returns {Promise<void>|Promise<object>} An empty response if the album is saved, otherwise an `error` object
 */
export async function saveAlbumsForCurrentUser(token, ids) {
    if (typeof ids == "string") {
        return await parseJSON(fetch(`${baseURL}/me/albums?ids=${ids}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }));
    }
    if (Array.isArray(ids)) {
        return await parseJSON(fetch(`${baseURL}/me/albums`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "ids": ids
            })
        }));
    }
}

/**
 * Remove one or more albums from the current user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs. Alternatively, an array of the Spotify IDs. A maximum of 50 items can be specified in one request.
 * @returns {Promise<void>|Promise<object>} An empty response if the album(s) have been removed from the library, otherwise an `error` object
 */
export async function removeUsersSavedAlbums(token, ids) {
    if (typeof ids == "string") {
        return await parseJSON(fetch(`${baseURL}/me/albums?ids=${ids}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }));
    }
    if (Array.isArray(ids)) {
        return await parseJSON(fetch(`${baseURL}/me/albums`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "ids": ids
            })
        }));
    }
}

/**
 * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
 * @returns {Promise<boolean[]>|Promise<object>} An array of booleans on success, otherwise an `error` object
 */
export async function checkUsersSavedAlbums(token, ids) {
    return await parseJSON(fetch(`${baseURL}/me/albums/contains?ids=${ids}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a list of new album releases featured in Spotify.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} A paged set of albums
 */
export async function getNewReleases(token, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/browse/new-releases?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the artist.
 * @returns {Promise<object>} An artist
 */
export async function getArtist(token, id) {
    return await parseJSON(fetch(`${baseURL}/artists/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information for several artists based on their Spotify IDs.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
 * @returns {Promise<object>} A set of artists
 */
export async function getSeveralArtists(token, ids) {
    return await parseJSON(fetch(`${baseURL}/artists?ids=${ids}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information about an artist's albums.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the artist.
 * @param {string} include_groups A comma-separated list of keywords that will be used to filter the response. If not supplied, all album types will be returned. Valid values are: `album`, `single`, `appears_on`, and `compilation`.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} Pages of albums
 */
export async function getArtistsAlbums(token, id, include_groups=null, market=null, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/artists/${id}/albums?include_groups=${include_groups}&market=${market}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get Spotify catalog information about an artist's top tracks by country.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the artist.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A set of tracks
 */
export async function getArtistsTopTracks(token, id, market=null) {
    return await parseJSON(fetch(`${baseURL}/artists/${id}/top-tracks?market=${market}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a list of categories used to tag items in Spotify.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. Provide this parameter if you want the category strings returned in a particular language.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} A paged set of categories
 */
export async function getSeveralBrowseCategories(token, locale=null, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/browse/categories?locale=${locale}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a single category used to tag items in Spotify.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} category_id The Spotify category ID for the category.
 * @param {string} locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. Provide this parameter if you want the category strings returned in a particular language.
 * @returns {Promise<object>} A category
 */
export async function getSingleBrowseCategory(token, category_id, locale=null) {
    return await parseJSON(fetch(`${baseURL}/browse/category/${category_id}?locale=${locale}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a playlist owned by a Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {string} fields Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the playlist's description and URI: `fields=description,uri`. A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. For example, to get just the added date and user ID of the adder: `fields=tracks.items(added_at,added_by.id)`. Use multiple parentheses to drill down into nested objects, for example: `fields=tracks.items(track(name,href,album(name,href)))`. Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=tracks.items(track(name,href,album(!name,href)))`.
 * @param {string} additional_types A comma-separated list of item types that your client supports besides the default track type. Valid types are: `track` and `episode`.
 * @returns {Promise<object>} A playlist
 */
export async function getPlaylist(token, playlist_id, market=null, fields=null, additional_types=null) {
    return await parseJSON(fetch(`${baseURL}/playlists/${playlist_id}?market=${market}&fields=${fields}&additional_types=${additional_types}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Change a playlist's name and public/private state.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string} name The new name for the playlist.
 * @param {boolean} public_playlist The playlist's public/private status: `true` the playlist will be public, `false` the playlist will be private, `null` the playlist status is not relevant.
 * @param {boolean} collaborative If `true`, the playlist will become collaborative and other users will be able to modify the playlist in their Spotify client. You can only set `collaborative` to `true` on non-public playlists.
 * @param {string} description Value for playlist description as displayed in Spotify Clients and in the Web API.
 * @returns {Promise<void>|Promise<object>} An empty response if the playlist is updated, otherwise an `error` object
 */
export async function changePlaylistDetails(token, playlist_id, name=null, public_playlist=null, collaborative=null, description=null) {
    /** @type {PlaylistDetails} */ const body = {};
    if (name) body.name = name;
    if (public_playlist !== null ) body.public = public_playlist;
    if (collaborative !== null) body.collaborative = collaborative;
    if (description !== null) body.description = description;
    return await parseJSON(fetch(`${baseURL}/playlists/${playlist_id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body
        })
    }));
}

/**
 * Get full details of the items of a playlist owned by a Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {string} fields Filters for the query: a comma-separated list of the fields to return. If omitted, all fields are returned. For example, to get just the total number of items and the request limit: `fields=total,limit`. A dot separator can be used to specify non-reoccurring fields, while parentheses can be used to specify reoccurring fields within objects. For example, to get just the added date and user ID of the adder: `fields=items(added_at,added_by.id)`. Use multiple parentheses to drill down into nested objects, for example: `fields=items(track(name,href,album(name,href)))`. Fields can be excluded by prefixing them with an exclamation mark, for example: `fields=items.track.album(!external_urls,images)`.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @param {string} additional_types A comma-separated list of item types that your client supports besides the default track type. Valid types are: `track` and `episode`.
 * @returns {Promise<object>} Pages of tracks
 */
export async function getPlaylistItems(token, playlist_id, market=null, fields=null, limit=20, offset=0, additional_types=null) {
    return await parseJSON(fetch(`${baseURL}/playlists/${playlist_id}/tracks?market=${market}&fields=${fields}&limit=${limit}&offset=${offset}&additional_types=${additional_types}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Reorder items in a playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {number} range_start The position of the first item to be reordered.
 * @param {number} insert_before The position where the items should be inserted.
 * @param {number} [range_length] The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the `range_start` position, and includes the `range_length` subsequent items.
 * @param {string} [snapshot_id] The playlist's snapshot ID against which you want to make the changes.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
export async function reorderPlaylistItems(token, playlist_id, range_start, insert_before, range_length=1, snapshot_id=null) {
    /** @type {PlaylistRange} */ const body = {
        "range_start": range_start,
        "insert_before": insert_before,
        "range_length": range_length
    };
    if (snapshot_id) body.snapshot_id = snapshot_id;
    return await parseJSON(fetch(`${baseURL}/playlists/${playlist_id}/tracks`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            body
        })
    }));
}

export async function replacePlaylistItems(token, playlist_id, uris) {}
export async function updatePlaylistItems() {}
export async function addItemsToPlaylist() {}
export async function removePlaylistItems() {}


/**
 * Get a list of the playlists owned or followed by the current Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100,000. Use with `limit` to get the next set of playlists.
 * @returns {Promise<object>} A paged set of playlists
 */
export async function getCurrentUsersPlaylists(token, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/me/playlists?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get a list of the playlists owned or followed by a Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} user_id The user's Spotify user ID.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100,000. Use with `limit` to get the next set of playlists.
 * @returns {Promise<object>} A paged set of playlists
 */
export async function getUsersPlaylists(token, user_id, limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/users/${user_id}/playlists?limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

export async function createPlaylist() {}
export async function getPlaylistCoverImage() {}
export async function addCustomPlaylistCoverImage() {}
export async function searchForItem() {}
export async function getTrack() {}
export async function getSeveralTracks() {}
export async function getUsersSavedTracks() {}
export async function saveTracksForCurrentUser() {}
export async function removeUsersSavedTracks() {}
export async function checkUsersSavedTracks() {}

/**
 * Get detailed profile information about the current user (including the current user's username).
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @returns {Promise<object>} A user
 */
export async function getCurrentUsersProfile(token) {
    return await parseJSON(fetch(`${baseURL}/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

/**
 * Get the current user's top artists or tracks based on calculated affinity.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} type The type of entity to return. Valid values: `artists` or `tracks`.
 * @param {string} time_range Over what time frame the affinities are computed. Valid values: `long_term` (calculated from ~1 year of data and including all new data as it becomes available), `medium_term` (approximately last 6 months), `short_term` (approximately last 4 weeks). Default: `medium_term`
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} Pages of artists or tracks
 */
export async function getUsersTopItems(token, type, time_range="medium_term", limit=20, offset=0) {
    return await parseJSON(fetch(`${baseURL}/me/top/${type}?time_range=${time_range}&limit=${limit}&offset=${offset}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }));
}

export async function getUsersProfile() {}
export async function followPlaylist() {}
export async function unfollowPlaylist() {}
export async function getFollowedArtists() {}
export async function followArtistsOrUsers() {}
export async function unfollowArtistsOrUsers() {}
export async function checkIfUserFollowsArtistsOrUsers() {}
export async function checkIfCurrentUserFollowsPlaylist() {}

/**
 * Parse the response from an API call.
 * @param {Promise} result A `Promise` containing the HTTP `Response` to the request.
 * @returns {Promise<object>} A JSON object
 */
async function parseJSON(result) {
    const response = await result;
    return response.json();
}