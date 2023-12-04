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

export default function Artists() {
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
    fetchTopArtists();
  }, []);

  const fetchTopArtists = async () => {
    try {
      const artists = await getTopArtists();
      setTopArtists(artists);
      console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
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
        >
          {topArtists.slice(0, 10).map((artist) => (
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
        <h1 style={{ margin: 0 }}>Your Top 5 Artists</h1>

        {getTopArtistsComp()}
        <PieChart chartData={pieData} artistToGenres={artistGenres} />
      </Stack>
    </div>
  );
}
