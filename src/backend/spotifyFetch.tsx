export type Artist = {
  name: string;
};

export type Track = {
  name: string;
  artists: Artist[];
};

export type SpotifyApiTracksResponse = {
  items: Track[];
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

export async function getTopTracks(): Promise<Track[]> {
  const response: SpotifyApiTracksResponse = await fetchWebApi(
    "v1/me/top/tracks?time_range=long_term&limit=5",
    "GET"
  );
  return response.items;
}

export async function logTopTracks(): Promise<void> {
  const topTracks = await getTopTracks();
  console.log(
    topTracks.map(
      (track) =>
        `${track.name} by ${track.artists
          .map((artist) => artist.name)
          .join(", ")}`
    )
  );
}

// export async function getTopArtists(): Promise<Artist[]> {
//   const response: SpotifyApiTracksResponse = await fetchWebApi(
//     "v1/me/top/artists",
//     "GET"
//   );
//   console.log(response.items);
//   return response.items;
// }
