import * as React from "react";
import { Stack, Button, Box, Grid } from "@mui/material";
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
import { topArtistStack } from "./main";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export const getTimeRangeButton = (
  clickFunction: React.MouseEventHandler<HTMLButtonElement> | undefined,
  label: string
) => {
  return (
    <Button
      className="see-more-button"
      onClick={clickFunction}
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
        height: "fit-content",
      }}
      sx={{
        bgcolor: "#7FD485",
        whiteSpace: "auto",
        "&:hover": {
          backgroundColor: "#6cbd72",
        },
      }}
    >
      {label}
    </Button>
  );
};

export const getTitleBox = (
  title: string,
  handleAllTimeClick: React.MouseEventHandler<HTMLButtonElement> | undefined,
  handleSixMonthClick: React.MouseEventHandler<HTMLButtonElement> | undefined,
  handleFourWeeksClick: React.MouseEventHandler<HTMLButtonElement> | undefined
) => {
  return (
    <Box className="main-title-box">
      <Stack
        className="main-title-stack"
        direction={{ xs: "column", sm: "row" }}
        spacing={5}
        textAlign={{ xs: "center", sm: "left" }}
      >
        <h1 className="card-text-title">{title}</h1>
        <Stack direction="row" spacing={2} sx={{ whiteSpace: "wrap" }}>
          {getTimeRangeButton(handleAllTimeClick, "All Time")}
          {getTimeRangeButton(handleSixMonthClick, "6 Months")}
          {getTimeRangeButton(handleFourWeeksClick, "4 Weeks")}
        </Stack>
      </Stack>
    </Box>
  );
};

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
            {getTitleBox(
              "Top Artists",
              handleAllTimeClick,
              handleSixMonthClick,
              handleFourWeeksClick
            )}
            {topArtistStack(topArtists, 20)}
            {/* <Stack
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
            </Stack> */}
          </Box>
        </>
      );
    } else {
      return <div>Loading</div>;
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
