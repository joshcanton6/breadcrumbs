/**
 * The base address of the Web API.
 * @type {string}
 */
const baseURL = "https://api.spotify.com/v1";

/**
 * Get Spotify catalog information for a single album.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the album.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} An album
 */
export async function getAlbum(token, id, market=null) {
    const query = new URLSearchParams({
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/albums/${id}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information for multiple albums identified by their Spotify IDs.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A set of albums
 */
export async function getSeveralAlbums(token, ids, market=null) {
    const query = new URLSearchParams({
        ids,
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/albums?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(market && {market}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/albums/${id}/tracks?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset}),
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/me/albums?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Save one or more albums to the current user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs. Alternatively, an array of the Spotify IDs. A maximum of 50 items can be specified in one request.
 * @returns {Promise<void>|Promise<object>} An empty response if the album is saved, otherwise an `error` object
 */
export async function saveAlbumsForCurrentUser(token, ids) {
    if (typeof ids == "string") {
        const query = new URLSearchParams({ids});
        return (await fetch(`${baseURL}/me/albums?${query}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/albums`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
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
        const query = new URLSearchParams({ids});
        return (await fetch(`${baseURL}/me/albums?${query}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/albums`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
    }
}

/**
 * Check if one or more albums is already saved in the current Spotify user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the albums. Maximum: 20 IDs.
 * @returns {Promise<boolean[]>|Promise<object>} An array of booleans on success, otherwise an `error` object
 */
export async function checkUsersSavedAlbums(token, ids) {
    const query = new URLSearchParams({ids});
    return (await fetch(`${baseURL}/me/albums/contains?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get a list of new album releases featured in Spotify.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} A paged set of albums
 */
export async function getNewReleases(token, limit=20, offset=0) {
    const query = new URLSearchParams({
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/browse/new-releases?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information for a single artist identified by their unique Spotify ID.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the artist.
 * @returns {Promise<object>} An artist
 */
export async function getArtist(token, id) {
    return (await fetch(`${baseURL}/artists/${id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information for several artists based on their Spotify IDs.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs for the artists. Maximum: 50 IDs.
 * @returns {Promise<object>} A set of artists
 */
export async function getSeveralArtists(token, ids) {
    const query = new URLSearchParams({ids});
    return (await fetch(`${baseURL}/artists?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(include_groups && {include_groups}),
        ...(market && {market}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/artists/${id}/albums?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information about an artist's top tracks by country.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID of the artist.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A set of tracks
 */
export async function getArtistsTopTracks(token, id, market=null) {
    const query = new URLSearchParams({
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/artists/${id}/top-tracks?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(locale && {locale}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/browse/categories?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get a single category used to tag items in Spotify.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} category_id The Spotify category ID for the category.
 * @param {string} locale The desired language, consisting of an ISO 639-1 language code and an ISO 3166-1 alpha-2 country code, joined by an underscore. Provide this parameter if you want the category strings returned in a particular language.
 * @returns {Promise<object>} A category
 */
export async function getSingleBrowseCategory(token, category_id, locale=null) {
    const query = new URLSearchParams({
        ...(locale && {locale})
    });
    return (await fetch(`${baseURL}/browse/category/${category_id}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get the list of markets where Spotify is available.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @returns {Promise<object>} A markets object with an array of country codes
 */
export async function getAvailableMarkets(token) {
    return (await fetch(`${baseURL}/markets`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(market && {market}),
        ...(fields && {fields}),
        ...(additional_types && {additional_types})
    });
    return (await fetch(`${baseURL}/playlists/${playlist_id}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    return (await fetch(`${baseURL}/playlists/${playlist_id}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...(name && {name}),
            ...(public_playlist !== null && {"public": public_playlist}),
            ...(collaborative !== null && {collaborative}),
            ...(description !== null && {description})
        })
    })).json();
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
    const query = new URLSearchParams({
        ...(market && {market}),
        ...(fields && {fields}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset}),
        ...(additional_types && {additional_types})
    });
    return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Reorder items in a playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {number} range_start The position of the first item to be reordered.
 * @param {number} insert_before The position where the items should be inserted.
 * @param {number} range_length The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the `range_start` position, and includes the `range_length` subsequent items.
 * @param {string} snapshot_id The playlist's snapshot ID against which you want to make the changes.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
async function reorderPlaylistItems(token, playlist_id, range_start, insert_before, range_length=1, snapshot_id=null) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks`, {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            range_start,
            insert_before,
            range_length,
            ...(snapshot_id && {snapshot_id})
        })
    })).json();
}

/**
 * Replace items in a playlist. Replacing items in a playlist will overwrite its existing items. This operation can be used for replacing or clearing items in a playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string|string[]} uris A comma-separated list of Spotify URIs to set, can be track or episode URIs. Alternatively, an array of Spotify URIs to set. A maximum of 100 items can be set in one request.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
async function replacePlaylistItems(token, playlist_id, uris) {
    if (typeof uris == "string") {
        const query = new URLSearchParams({uris});
        return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks?${query}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(uris)) {
        return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({uris})
        })).json();
    }
}

/**
 * Either reorder or replace items in a playlist depending on the request's parameters. To reorder items, include `range_start`, `insert_before`, `range_length` and `snapshot_id` in the request's body. To replace items, include `uris` as either a query parameter or in the request's body. Replacing items in a playlist will overwrite its existing items. This operation can be used for replacing or clearing items in a playlist. Replace and reorder are mutually exclusive operations which share the same endpoint, but have different parameters. These operations can't be applied together in a single request.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string|string[]} uris A comma-separated list of Spotify URIs to set, can be track or episode URIs. Alternatively, an array of Spotify URIs to set. A maximum of 100 items can be set in one request.
 * @param {number} range_start The position of the first item to be reordered.
 * @param {number} insert_before The position where the items should be inserted.
 * @param {number} range_length The amount of items to be reordered. Defaults to 1 if not set. The range of items to be reordered begins from the `range_start` position, and includes the `range_length` subsequent items.
 * @param {string} snapshot_id The playlist's snapshot ID against which you want to make the changes.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
export async function updatePlaylistItems(token, playlist_id, uris=null, range_start=null, insert_before=null, range_length=null, snapshot_id=null) {
    if (!uris && range_start != null && insert_before != null && range_length) {
        return await reorderPlaylistItems(token, playlist_id, range_start, insert_before, range_length, snapshot_id);
    }
    if (uris && uris.length >= 0 && !range_start && !insert_before && !range_length) {
        return await replacePlaylistItems(token, playlist_id, uris);
    }
}

/**
 * Add one or more items to a user's playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {number} position The position to insert the items, a zero-based index. If omitted, the items will be appended to the playlist. Items are added in the order they are listed in the query string or request body.
 * @param {string|string[]} uris A comma-separated list of Spotify URIs to set, can be track or episode URIs. Alternatively, an array of Spotify URIs to set. A maximum of 100 items can be set in one request.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
export async function addItemsToPlaylist(token, playlist_id, uris, position=null) {
    if (typeof uris == "string") {
        const query = new URLSearchParams({
            uris,
            ...(position && {position})
        });
        return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks?${query}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(uris)) {
        return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                uris,
                ...(position && {position})
            })
        })).json();
    }
}

/**
 * Remove one or more items from a user's playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {Track[]} tracks An array of objects containing Spotify URIs of the tracks or episodes to remove. A maximum of 100 objects can be sent at once.
 * @param {string} snapshot_id The playlist's snapshot ID against which you want to make the changes. The API will validate that the specified items exist and in the specified positions and make the changes, even if more recent changes have been made to the playlist.
 * @returns {Promise<object>} A snapshot ID for the playlist
 */
export async function removePlaylistItems(token, playlist_id, tracks, snapshot_id=null) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/tracks`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            tracks,
            ...(snapshot_id && {snapshot_id})
        })
    })).json();
}

/**
 * Get a list of the playlists owned or followed by the current Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first playlist to return. Default: 0 (the first object). Maximum offset: 100,000. Use with `limit` to get the next set of playlists.
 * @returns {Promise<object>} A paged set of playlists
 */
export async function getCurrentUsersPlaylists(token, limit=20, offset=0) {
    const query = new URLSearchParams({
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/me/playlists?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/users/${user_id}/playlists?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Create a playlist for a Spotify user. (The playlist will be empty until you add tracks.) Each user is generally limited to a maximum of 11000 playlists.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} user_id The user's Spotify user ID.
 * @param {string} name The name for the new playlist.
 * @param {boolean} public_playlist Defaults to `true`. The playlist's public/private status: `true` the playlist will be public, `false` the playlist will be private.
 * @param {boolean} collaborative Defaults to `false`. If `true` the playlist will be collaborative.
 * @param {string} description Value for playlist description as displayed in Spotify Clients and in the Web API.
 * @returns {Promise<object>} A playlist
 */
export async function createPlaylist(token, user_id, name, public_playlist=true, collaborative=false, description=null) {
    return (await fetch(`${baseURL}/users/${user_id}/playlists`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name,
            ...(!public_playlist && {"public": public_playlist}),
            ...(collaborative && {collaborative}),
            ...(description && {description})
        })
    })).json();
}

/**
 * Get the current image associated with a specific playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @returns {Promise<object[]>|Promise<object>} A set of images on success, otherwise an `error` object
 */
export async function getPlaylistCoverImage(token, playlist_id) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/images`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Replace the image used to represent a specific playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {string} image Base64 encoded JPEG image data, maximum payload size is 256 KB.
 * @returns {Promise<void>|Promise<object} An empty response if the image is uploaded, otherwise an `error` object
 */
export async function addCustomPlaylistCoverImage(token, playlist_id, image) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/images`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "image/jpeg"
        },
        body: image
    })).json();
}

/**
 * Get Spotify catalog information about albums, artists, playlists, tracks, shows, episodes or audiobooks that match a keyword string.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} q Your search query. You can narrow down your search using field filters. The available filters are `album`, `artist`, `track`, `year`, `upc`, `tag:hipster`, `tag:new`, `isrc`, and `genre`. Each field filter only applies to certain result types. The `artist` and `year` filters can be used while searching albums, artists and tracks. You can filter on a single year or a range. The `album` filter can be used while searching albums and tracks. The `genre` filter can be used while searching artists and tracks. The `isrc` and `track` filters can be used while searching tracks. The `upc`, `tag:new` and `tag:hipster` filters can only be used while searching albums. The `tag:new` filter will return albums released in the past two weeks and `tag:hipster` can be used to return only albums with the lowest 10% popularity.
 * @param {string} type A comma-separated list of item types to search across. Search results include hits from all the specified item types. Allowed values: `album`, `artist`, `playlist`, `track`, `show`, `episode`, `audiobook`.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @param {boolean} include_external If include_external is enabled it signals that the client can play externally hosted audio content, and marks the content as playable in the response. By default externally hosted audio content is marked as unplayable in the response.
 * @returns {Promise<object>} Search response
 */
export async function searchForItem(token, q, type, market=null, limit=20, offset=0, include_external=false) {
    const query = new URLSearchParams({
        q,
        type,
        ...(market && {market}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset}),
        ...(include_external && {"include_external": "audio"})
    });
    return (await fetch(`${baseURL}/search?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information for a single track identified by its unique Spotify ID.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} id The Spotify ID for the track.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A track
 */
export async function getTrack(token, id, market=null) {
    const query = new URLSearchParams({
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/tracks/${id}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get Spotify catalog information for multiple tracks based on their Spotify IDs.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} ids A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @returns {Promise<object>} A set of tracks
 */
export async function getSeveralTracks(token, ids, market=null) {
    const query = new URLSearchParams({
        ids,
        ...(market && {market})
    });
    return (await fetch(`${baseURL}/tracks?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get a list of the songs saved in the current Spotify user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} market An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned. If a valid user access token is specified in the request header, the country associated with the user account will take priority over this parameter.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @param {number} offset The index of the first item to return. Default: 0 (the first item). Use with `limit` to get the next set of items.
 * @returns {Promise<object>} Pages of tracks
 */
export async function getUsersSavedTracks(token, market=null, limit=20, offset=0) {
    const query = new URLSearchParams({
        ...(market && {market}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/me/tracks?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Save one or more tracks to the current user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs. Alternatively, an array of the Spotify IDs. A maximum of 50 items can be specified in one request.
 * @returns {Promise<void>|Promise<object>} An empty response if the track is saved, otherwise an `error` object
 */
export async function saveTracksForCurrentUser(token, ids) {
    if (typeof ids == "string") {
        const query = new URLSearchParams({ids});
        return (await fetch(`${baseURL}/me/tracks?${query}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/tracks`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
    }
}

/**
 * Remove one or more tracks from the current user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs. Alternatively, an array of the Spotify IDs. A maximum of 50 items can be specified in one request.
 * @returns {Promise<void>|Promise<object>} An empty response if the track is removed, otherwise an `error` object
 */
export async function removeUsersSavedTracks(token, ids) {
    if (typeof ids == "string") {
        const query = new URLSearchParams({ids});
        return (await fetch(`${baseURL}/me/tracks?${query}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/tracks`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
    }
}

/**
 * Check if one or more tracks is already saved in the current Spotify user's 'Your Music' library.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string|string[]} ids A comma-separated list of the Spotify IDs. Maximum: 50 IDs.
 * @returns {Promise<boolean[]>|Promise<object>} An array of booleans on success, otherwise an `error` object
 */
export async function checkUsersSavedTracks(token, ids) {
    const query = new URLSearchParams({ids});
    return (await fetch(`${baseURL}/me/tracks/contains?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get detailed profile information about the current user (including the current user's username).
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @returns {Promise<object>} A user
 */
export async function getCurrentUsersProfile(token) {
    return (await fetch(`${baseURL}/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
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
    const query = new URLSearchParams({
        ...(time_range !== "medium_term" && {time_range}),
        ...(limit !== 20 && {limit}),
        ...(offset !== 0 && {offset})
    });
    return (await fetch(`${baseURL}/me/top/${type}?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get public profile information about a Spotify user.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} user_id The user's Spotify user ID.
 * @returns {Promise<object>} A user
 */
export async function getUsersProfile(token, user_id) {
    return (await fetch(`${baseURL}/users/${user_id}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Add the current user as a follower of a playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @param {boolean} public_playlist Defaults to `true`. If `true` the playlist will be included in user's public playlists (added to profile), if `false` it will remain private.
 * @returns {Promise<void>|Promise<object>} An empty response if the playlist is followed, otherwise an `error` object
 */
export async function followPlaylist(token, playlist_id, public_playlist=true) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/followers`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ...(!public_playlist && {"public": public_playlist})
        })
    })).json();
}

/**
 * Remove the current user as a follower of a playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @returns {Promise<void>|Promise<object>} An empty response if the playlist is unfollowed, otherwise an `error` object
 */
export async function unfollowPlaylist(token, playlist_id) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/followers`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Get the current user's followed artists.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} after The last artist ID retrieved from the previous request.
 * @param {number} limit The maximum number of items to return. Default: 20. Minimum: 1. Maximum: 50.
 * @returns {Promise<object>} A paged set of artists
 */
export async function getFollowedArtists(token, after=null, limit=20) {
    const query = new URLSearchParams({
        "type": "artist",
        ...(after && {after}),
        ...(limit !== 20 && {limit})
    });
    return (await fetch(`${baseURL}/me/following?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Add the current user as a follower of one or more artists or other Spotify users.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} type The ID type. Allowed values: `artist`, `user`.
 * @param {string|string[]} ids A comma-separated list of the artist or the user Spotify IDs. Alternatively, an array of the artist or user Spotify IDs. A maximum of 50 IDs can be sent in one request.
 * @returns {Promise<void>|Promise<object} An empty response if the artist or user is followed, otherwise an `error` object
 */
export async function followArtistsOrUsers(token, type, ids) {
    const query = new URLSearchParams({type});
    if (typeof ids == "string") {
        query.append("ids", ids);
        return (await fetch(`${baseURL}/me/following?${query}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/following?${query}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
    }
}

/**
 * Remove the current user as a follower of one or more artists or other Spotify users.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} type The ID type. Allowed values: `artist`, `user`.
 * @param {string|string[]} ids A comma-separated list of the artist or the user Spotify IDs. Alternatively, an array of the artist or user Spotify IDs. A maximum of 50 IDs can be sent in one request.
 * @returns {Promise<void>|Promise<object} An empty response if the artist or user is unfollowed, otherwise an `error` object
 */
export async function unfollowArtistsOrUsers(token, type, ids) {
    const query = new URLSearchParams({type});
    if (typeof ids == "string") {
        query.append("ids", ids);
        return (await fetch(`${baseURL}/me/following?${query}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })).json();
    }
    if (Array.isArray(ids)) {
        return (await fetch(`${baseURL}/me/following?${query}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ids})
        })).json();
    }
}

/**
 * Check to see if the current user is following one or more artists or other Spotify users.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} type The ID type: either `artist` or `user`.
 * @param {string} ids A comma-separated list of the artist or the user Spotify IDs to check. A maximum of 50 IDs can be sent in one request.
 * @returns {Promise<boolean[]>|Promise<object>} An array of booleans on success, otherwise an `error` object
 */
export async function checkIfUserFollowsArtistsOrUsers(token, type, ids) {
    const query = new URLSearchParams({type, ids});
    return (await fetch(`${baseURL}/me/following/contains?${query}`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * Check to see if the current user is following a specified playlist.
 * @param {string} token The access token which contains the credentials and permissions that can be used to access a given resource or user's data.
 * @param {string} playlist_id The Spotify ID of the playlist.
 * @returns {Promise<boolean[]>|Promise<object>} An array of booleans on success, otherwise an `error` object
 */
export async function checkIfCurrentUserFollowsPlaylist(token, playlist_id) {
    return (await fetch(`${baseURL}/playlists/${playlist_id}/followers/contains`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })).json();
}

/**
 * @typedef {Object} Track
 * @property {string} uri
 */