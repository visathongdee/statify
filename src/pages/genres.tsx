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

export default function TopGenres() {
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

  useEffect(() => {
    getPieChartData();
  }, [topArtists]);

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

  const getTopGenresComp = () => {
    return (
      <Box className="main-boxes">
        <Box className="main-title-box">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            // width="100%"
            spacing={5}
          >
            <h1 className="card-text-title">Top Genres</h1>
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
          alignItems="space-between"
          justifyContent="space-between"
          spacing={2}
          className="card-content-stack"
        >
          {topGenres.map((genre) => (
            <div style={{ alignSelf: "start", width: "100%" }}>
              <Stack
                key={genre}
                direction="column"
                alignItems="start"
                justifyContent="start"
                spacing={1}
              >
                <h2 className="card-text-content">{genre}</h2>
              </Stack>
            </div>
          ))}
        </Stack>
      </Box>
    );
  };

  const getPieChartData = () => {
    // console.log(topArtists);
    // console.log("getPiChartData");
    const topGenres = topArtists.map((artist) => artist.genres).flat();
    setTopGeneres(topGenres);

    const topGenresFreq = topGenres.reduce(
      (acc: Record<string, number>, genre: string) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      },
      {}
    );

    // console.log(topArtists);
    const artistGenre: ArtistGenre[] = topArtists.map((artist) => {
      return {
        name: artist.name,
        genres: artist.genres,
      };
    });

    setArtistGenres(artistGenre);
    console.log("artistGenre:", artistGenre);

    // console.log(Object.keys(topGenresFreq));
    const sum = Object.values(topGenresFreq).reduce(
      (partialSum, a) => partialSum + a,
      0
    );

    let currPiData: ChartData = {
      labels: Object.keys(topGenresFreq),
      datasets: [
        {
          label: "Your Top Genres",
          data: Object.values(topGenresFreq).map((value) => {
            return Math.round((value / sum) * 100) / 100;
          }),
          backgroundColor: [
            "#f78ca0",
            "#fddaa0",
            "#b7e089",
            "#c7aefb",
            "#f7f79e",
            "#b8b8b8",
            "#fbaed2",
            "#ffc1f3",
            "#baf2a1",
            "#d1b3ff",
            "#e1e18e",
            "#d1d1d1",
            "#9cffff",
            "#b3f4ff",
            "#f3e1b6",
            "#b6b6d8",
            "#e5e5e5",
            "#dcbcff",
            "#f7b2b2",
            "#a4d8f0",
          ],
          borderColor: "white",
          // radius: "100%",
        },
      ],
    };

    setPieData(currPiData);
  };

  const getPieChartComp = () => {
    return (
      <Box className="main-boxes">
        <Box className="main-title-box">
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            width="100%"
            spacing={5}
          >
            <h1 className="card-text-title">Top 5 Tracks</h1>
          </Stack>
        </Box>
        <PieChart chartData={pieData} artistToGenres={artistGenres} />
        <Stack
          direction="column"
          alignItems="space-between"
          justifyContent="space-between"
          spacing={2}
          className="card-content-stack"
          width="100%"
        >
          {/* {topGenres.map((genre) => (
            <div style={{ alignSelf: "start", width: "100%" }}>
              <Stack
                key={genre}
                direction="column"
                alignItems="start"
                justifyContent="start"
                spacing={1}
              >
                <h2 className="card-text-content">{genre}</h2>
              </Stack>
            </div>
          ))} */}
        </Stack>
      </Box>
    );
  };

  if (!loading && topArtists && topArtists.length > 0) {
    return (
      <div
        style={{
          height: "100%",
          width: "100%",
          position: "absolute",
        }}
      >
        <MyAppBar />
        <Stack direction="row">
          {getTopGenresComp()}
          {getPieChartComp()}
        </Stack>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
}
