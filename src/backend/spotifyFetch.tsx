export type Artist = {
  name: string;
  genres: string[];
  images: [{ url: "src/assets/spotify icon.png" }];
  popularity: number;
};

export type Track = {
  id: string;
  name: string;
  artists: Artist[];
  album: { images: [{ url: "src/assets/spotify icon.png" }] };
  popularity: number;
};

export type Genres = {
  genre: string;
};

export type SpotifyApiTracksResponse = {
  items: Track[];
};

export type SpotifyApiArtistsResponse = {
  items: Artist[];
};

async function fetchWebApi(endpoint: string, method: string): Promise<any> {
  let token = localStorage.getItem("access_token");
  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
  });
  return await res.json();
}

export async function getTopTracks(timeRange: string): Promise<Track[]> {
  const response: SpotifyApiTracksResponse = await fetchWebApi(
    `v1/me/top/tracks?time_range=${timeRange}`,
    "GET"
  );
  return response.items;
}

export async function logTopTracks(): Promise<void> {
  const topTracks = await getTopTracks("long_term");
  console.log(
    topTracks.map(
      (track) =>
        `${track.name} by ${track.artists
          .map((artist) => artist.name)
          .join(", ")}`
    )
  );
}

export async function getTopArtists(timeRange: string): Promise<Artist[]> {
  const response: SpotifyApiArtistsResponse = await fetchWebApi(
    `v1/me/top/artists?time_range=${timeRange}`,
    "GET"
  );

  return response.items;
}

// const getTrackIds = tracks => tracks.map(({ track }) => track.id).join(',');

/**
 * Get a Playlist's Tracks
 * https://developer.spotify.com/documentation/web-api/reference/playlists/get-playlists-tracks/
 */
// export async function getTracks(): Promise<Artist[]> {
//   const response: SpotifyApiArtistsResponse = await fetchWebApi(
//     // "v1/me/top/artists?time_range=long_term&limit=5",
//     `https://api.spotify.com/v1/tracks/${trackId}`,
//     "GET"
//   );
//   console.log(response.items);
//   return response.items;
// }

// export const getPlaylistTracks = playlistId =>
//   const .get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, { headers });
