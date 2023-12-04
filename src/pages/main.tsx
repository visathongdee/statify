import * as React from "react";
import { Stack, Button } from "@mui/material";
import "../style.css";
import SpotifyIcon from "../assets/spotify icon.png";
import { useEffect, useState } from "react";
import {
  logTopTracks,
  getTopArtists,
  getTopTracks,
  Track,
  Artist,
  Genres,
} from "../backend/spotifyFetch";
import PieChart from "./pieChart";
import { ArtistGenre } from "./pieChart";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export default function Main() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topGenres, setTopGeneres] = useState<string[]>([]);
  const [pieData, setPieData] = useState<ChartData>();
  const [artistGenres, setArtistGenres] = useState<ArtistGenre[]>();

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
    fetchTopArtists();
  }, []);

  const fetchTopTracks = async () => {
    try {
      const tracks = await getTopTracks();
      setTopTracks(tracks);
      console.log("tracks:", tracks);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const fetchTopArtists = async () => {
    try {
      const artists = await getTopArtists();
      setTopArtists(artists);
      console.log("artists:", artists);
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
          width={"100%"}
        >
          <Stack direction="row" spacing={5}>
            <h1>Your Top 5 Tracks</h1>
            <Button>See More</Button>
          </Stack>
          {topTracks.slice(0, 5).map((track) => (
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

  const getTopArtistsComp = () => {
    return (
      <>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          margin="5%"
          spacing={5}
          width={"100%"}
        >
          <Stack direction="row" spacing={5}>
            <h1>Your Top 5 Artists</h1>
            <Button>See More</Button>
          </Stack>
          {topArtists.slice(0, 5).map((artist) => (
            <Stack
              key={artist.name}
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <h2>{artist.name}</h2>
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

        <Stack direction="row" alignItems="start" width="100%">
          {getTopTracksComp()}
          {getTopArtistsComp()}
        </Stack>
      </Stack>
      {getDisconnectButton()}
    </div>
  );
}
