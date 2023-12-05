import * as React from "react";
import {
  Stack,
  Button,
  Grid,
  Box,
  Typography,
  List,
  ListItem,
  AppBar,
} from "@mui/material";
import "../style.css";
import SpotifyIcon from "../assets/spotify icon.png";
import { useEffect, useState } from "react";
import {
  getTopArtists,
  getTopTracks,
  Track,
  Artist,
} from "../backend/spotifyFetch";
import { useNavigate } from "react-router";
import MyAppBar from "./appbar";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export const topArtistStack = (topArtists: Artist[], limit: number) => {
  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      className="card-content-stack"
      spacing={2}
    >
      {topArtists.slice(0, limit).map((artist) => (
        <div style={{ alignSelf: "start", width: "100%" }}>
          <Stack
            key={artist.name}
            direction="row"
            alignItems="center"
            justifyContent="start"
            spacing={1}
            sx={{ height: "100%", width: "100%", textAlign: "left" }}
          >
            {artist.images.length > 0 && artist.images[0] && (
              <img
                src={artist.images[0].url}
                alt="Artist"
                className="profile-image"
              />
            )}
            <h1 className="card-text-content" style={{ marginInline: "5%" }}>
              {artist.name}
            </h1>
          </Stack>
        </div>
      ))}
    </Stack>
  );
};

export const topTracksStack = (topTracks: Track[], limit: number) => {
  return (
    <Stack
      direction="column"
      alignItems="space-between"
      justifyContent="space-between"
      spacing={5}
      className="card-content-stack"
    >
      {topTracks.slice(0, limit).map((track) => (
        <div style={{ alignSelf: "start", width: "100%" }}>
          <Stack
            key={track.name}
            direction="row"
            alignItems="center"
            justifyContent="start"
            spacing={2}
          >
            {track.album.images.length > 0 && track.album.images[0] && (
              <img
                src={track.album.images[0].url}
                alt="Track"
                className="profile-image"
              />
            )}
            <Stack alignItems="start" spacing={0}>
              <h2 className="card-text-content">{track.name}</h2>
              <h3 className="card-subtext-content" style={{ margin: "0%" }}>
                {track.artists.map((artist) => artist.name).join(", ")}
              </h3>
            </Stack>
          </Stack>
        </div>
      ))}
    </Stack>
  );
};

export default function Main() {
  const navigate = useNavigate();
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1)); // remove #
    const accessToken = params.get("access_token");

    if (accessToken) {
      localStorage.setItem("access_token", accessToken);
      window.history.pushState(
        "",
        document.title,
        window.location.pathname + window.location.search
      );
    }
  }, []);

  useEffect(() => {
    fetchTopTracks("long_term");
    fetchTopArtists("long_term");
  }, []);

  const moreArtistsClick = () => {
    navigate("/artists");
  };

  const moreTracksClick = () => {
    navigate("/tracks");
  };

  const moreGenresClick = () => {
    navigate("/genres");
  };

  const mainClick = () => {
    navigate("/main");
  };

  const handleDisconnect = () => {
    let beforetoken = localStorage.getItem("access_token");

    localStorage.clear();

    let token = localStorage.getItem("access_token");

    console.log("disconnected");

    navigate("/main");
  };

  const fetchTopTracks = async (timeRange: string) => {
    try {
      const tracks = await getTopTracks(timeRange);
      setTopTracks(tracks);
      console.log("tracks:", tracks);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const fetchTopArtists = async (timeRange: string) => {
    try {
      const artists = await getTopArtists(timeRange);
      setTopArtists(artists);
      console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const getTopTracksComp = () => {
    return (
      <>
        <Box className="main-boxes">
          <Box className="main-title-box">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
              spacing={5}
              textAlign="left"
            >
              <h1 className="card-text-title">Top Tracks of All Time</h1>
              <Button
                className="see-more-button"
                onClick={moreTracksClick}
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
                See More
              </Button>
            </Stack>
          </Box>
          {topTracksStack(topTracks, 5)}
        </Box>
      </>
    );
  };

  const getTopArtistsComp = () => {
    console.log("topArtists:", topArtists);
    // const url = topArtists.slice(0, 5).map((artist) => (
    //   artist.image

    // ))
    return (
      <>
        <Box className="main-boxes">
          <Box className="main-title-box">
            <Stack className="main-title-stack" direction="row" spacing={5}>
              <h1 className="card-text-title" style={{ textAlign: "left" }}>
                Top Artists of All Time
              </h1>
              <Button
                className="see-more-button"
                onClick={moreArtistsClick}
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
                See More
              </Button>
            </Stack>
          </Box>
          {topArtistStack(topArtists, 5)}
        </Box>
      </>
    );
  };

  const getDisconnectButton = () => {
    return (
      <Button
        variant="outlined"
        // className="connect-button"
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
        onClick={handleDisconnect}
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
      <MyAppBar />
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        margin="5%"
      >
        <Grid className="main-grid-container" container spacing={2}>
          <Grid className="main-grid-item" item xs={12} md={6}>
            {getTopTracksComp()}
          </Grid>
          <Grid className="main-grid-item" item xs={12} md={6}>
            {getTopArtistsComp()}
          </Grid>
        </Grid>
      </Stack>
      {/* {getDisconnectButton()} */}
    </div>
  );
}
