import * as React from "react";
import { Stack, Button } from "@mui/material";
import "../style.css";
import SpotifyIcon from "../assets/spotify icon.png";
import { useEffect, useState } from "react";
import {
  logTopTracks,
  getTopTracks,
  Track,
  // Artist,
  // getTopArtists,
} from "../backend/spotifyFetch";

export default function Main() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // remove #
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);

      // clear the hash from the URL
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }, []);

  useEffect(() => {
    fetchTopTracks();
    // getTopArtists();
  }, []);

  const fetchTopTracks = async () => {
    try {
      const tracks = await getTopTracks();
      // const trackStrings = tracks.map(
      //   (track) =>
      //     `${track.name} by ${track.artists
      //       .map((artist) => artist.name)
      //       .join(", ")}`
      // );
      setTopTracks(tracks);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const getTopTracksComp = () => {
    return (
      <>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          margin="5%"
          spacing={5}
        >
          <h1>Your Top 5 Tracks</h1>
          {topTracks.map((track) => (
            <Stack
              key={track.name}
              direction="column"
              alignItems="center"
              justifyContent="center"
              // margin="5%"
              spacing={1}
            >
              <h2>{track.name}</h2>
              <h3>{track.artists.map((artist) => artist.name).join(", ")}</h3>
            </Stack>
          ))}
        </Stack>
      </>
    );
  };

  const getDisconnectButton = () => {
    return (
      <Button
        variant="outlined"
        style={{
          textTransform: "none",
          borderColor: "black",
        }}
        sx={{
          bgcolor: "lightGreen",
          color: "black",
          fontSize: "18px",
          fontWeight: "400",
          paddingY: "2px",
          paddingX: "10px",
          borderColor: "black",
          "&:hover": {
            backgroundColor: "#6cbd72",
          },
        }}
        disableElevation
      >
        <Stack direction="row" spacing={2}>
          <img
            src={SpotifyIcon}
            style={{ height: "20px", marginTop: "5%", marginRight: "8px" }}
          />
          disconnect from spotify
        </Stack>
      </Button>
    );
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        margin="5%"
      >
        <h1 style={{ margin: 0 }}>Your Spotify Data</h1>

        {getTopTracksComp()}
      </Stack>
      {getDisconnectButton()}
    </div>
  );
}
