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

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export default function Artists() {
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
    fetchTopArtists("long_term");
  }, []);

  const handleAllTimeClick = () => {
    fetchTopArtists("long_term");
  };

  const handleSixMonthClick = () => {
    fetchTopArtists("medium_term");
  };

  const handleFourWeeksClick = () => {
    fetchTopArtists("short_term");
  };

  const fetchTopArtists = async (timeRange: string) => {
    setLoading(true);
    try {
      const artists = await getTopArtists(timeRange);
      setTopArtists(artists);
      console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
    setLoading(false);
  };

  const getTopArtistsComp = () => {
    if (!loading && topArtists && topArtists.length > 0) {
      return (
        <>
          <Box className="main-boxes">
            <Box className="main-title-box">
              <Stack className="main-title-stack" direction="row" spacing={5}>
                <h1 className="card-text-title">Top Artists</h1>
                <Button
                  className="see-more-button"
                  onClick={handleAllTimeClick}
                  variant="outlined"
                  style={{
                    textTransform: "none",
                    borderRadius: "25px",
                    borderColor: "black",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "400",
                    paddingBlock: "2px",
                    paddingInline: "10px",
                    width: "50%",
                  }}
                  sx={{
                    bgcolor: "#7FD485",
                    "&:hover": {
                      backgroundColor: "#6cbd72",
                    },
                  }}
                >
                  All Time
                </Button>
                <Button
                  className="see-more-button"
                  onClick={handleSixMonthClick}
                  variant="outlined"
                  style={{
                    textTransform: "none",
                    borderRadius: "25px",
                    borderColor: "black",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "400",
                    paddingBlock: "2px",
                    paddingInline: "10px",
                    width: "50%",
                  }}
                  sx={{
                    bgcolor: "#7FD485",
                    "&:hover": {
                      backgroundColor: "#6cbd72",
                    },
                  }}
                >
                  6 Months
                </Button>
                <Button
                  className="see-more-button"
                  onClick={handleFourWeeksClick}
                  variant="outlined"
                  style={{
                    textTransform: "none",
                    borderRadius: "25px",
                    borderColor: "black",
                    color: "black",
                    fontSize: "18px",
                    fontWeight: "400",
                    paddingBlock: "2px",
                    paddingInline: "10px",
                    width: "50%",
                  }}
                  sx={{
                    bgcolor: "#7FD485",
                    "&:hover": {
                      backgroundColor: "#6cbd72",
                    },
                  }}
                >
                  4 Weeks
                </Button>
              </Stack>
            </Box>
            <Stack
              direction="column"
              justifyContent="space-between"
              className="card-content-stack"
            >
              {topArtists.map((artist) => (
                <div style={{ alignSelf: "start", width: "100%" }}>
                  <Stack
                    key={artist.name}
                    direction="column"
                    alignItems="start"
                    justifyContent="start"
                    spacing={1}
                    sx={{ height: "100%", width: "100%", textAlign: "left" }}
                  >
                    <h2 className="card-text-content">{artist.name}</h2>
                  </Stack>
                </div>
              ))}
            </Stack>
          </Box>
        </>
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
        {getTopArtistsComp()}
        <PieChart chartData={pieData} artistToGenres={artistGenres} />
      </Stack>
    </div>
  );
}
