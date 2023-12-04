import * as React from "react";
import {
  Stack,
  Button,
  Grid,
  Box,
  Typography,
  List,
  ListItem,
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

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

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
    fetchTopTracks();
    fetchTopArtists();
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
          <Stack
            direction="column"
            alignItems="space-between"
            justifyContent="space-between"
            spacing={2}
            className="card-content-stack"
          >
            {topTracks.slice(0, 5).map((track) => (
              <div style={{ alignSelf: "start", width: "100%" }}>
                <Stack
                  key={track.name}
                  direction="column"
                  alignItems="start"
                  justifyContent="start"
                  spacing={1}
                >
                  <h2 className="card-text-content">{track.name}</h2>
                  <h3 className="card-subtext-content">
                    {track.artists.map((artist) => artist.name).join(", ")}
                  </h3>
                </Stack>
              </div>
            ))}
          </Stack>
        </Box>
      </>
    );
  };

  const getTopArtistsComp = () => {
    return (
      <>
        <Box className="main-boxes">
          <Box className="main-title-box">
            <Stack className="main-title-stack" direction="row" spacing={5}>
              <h1 className="card-text-title">Top 5 Artists</h1>
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
          <Stack
            direction="column"
            // alignItems="space-between"
            justifyContent="space-between"
            // spacing={5}
            className="card-content-stack"
          >
            {topArtists.slice(0, 5).map((artist) => (
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
  };

  const getBar = () => {
    return (
      <>
        <Box sx={{ borderBottom: 1.5, borderColor: "black", width: "100%" }} />
        <Stack
          direction="row"
          width="100%"
          justifyContent="space-between"
          marginInline="2%"
          // marginBlock="2%"
          margin="1%"
        >
          <Button
            className="see-more-button"
            onClick={moreArtistsClick}
            style={{
              textTransform: "none",
              color: "black",
              fontSize: "18px",
              fontWeight: "400",
              paddingInline: "3%",
            }}
          >
            Top Artists
          </Button>
          <Button
            className="see-more-button"
            onClick={moreTracksClick}
            style={{
              textTransform: "none",
              color: "black",
              fontSize: "18px",
              fontWeight: "400",
              paddingInline: "3%",
            }}
          >
            Top Tracks
          </Button>
          <Button
            className="see-more-button"
            onClick={moreGenresClick}
            style={{
              textTransform: "none",
              color: "black",
              fontSize: "18px",
              fontWeight: "400",
              paddingInline: "3%",
            }}
          >
            Top Genres
          </Button>
        </Stack>
        <Box sx={{ borderBottom: 1.5, borderColor: "black", width: "100%" }} />
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
        <div style={{ alignSelf: "start", width: "100%" }}>
          <h1 style={{ margin: "2%", textAlign: "left" }}>Statify</h1>
        </div>
        {getBar()}
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
