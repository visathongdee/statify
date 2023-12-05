import * as React from "react";
import { Stack, Button, Box } from "@mui/material";
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
import MyAppBar from "./appbar";
import { getTitleBox } from "./artists";
import { topTracksStack } from "./main";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export default function Tracks() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topGenres, setTopGeneres] = useState<string[]>([]);
  const [pieData, setPieData] = useState<ChartData>();
  const [artistGenres, setArtistGenres] = useState<ArtistGenre[]>();
  const [loading, setLoading] = useState(false);

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
    fetchTopTracks("long_term");
  }, []);

  const handleAllTimeClick = () => {
    fetchTopTracks("long_term");
  };

  const handleSixMonthClick = () => {
    fetchTopTracks("medium_term");
  };

  const handleFourWeeksClick = () => {
    fetchTopTracks("short_term");
  };

  const fetchTopTracks = async (timeRange: string) => {
    setLoading(true);
    try {
      const tracks = await getTopTracks(timeRange);
      setTopTracks(tracks);
      console.log("tracks:", tracks);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
    setLoading(false);
  };

  const getTopTracksComp = () => {
    if (!loading && topTracks && topTracks.length > 0) {
      return (
        <Box className="main-boxes">
          {getTitleBox(
            "Top Tracks",
            handleAllTimeClick,
            handleSixMonthClick,
            handleFourWeeksClick
          )}
          {topTracksStack(topTracks, 20)}
        </Box>
      );
    } else {
      return <div>Loading...</div>;
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
      }}
    >
      <MyAppBar />
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        margin="5%"
      >
        {getTopTracksComp()}
      </Stack>
    </div>
  );
}
