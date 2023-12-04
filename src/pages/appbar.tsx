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

export default function MyAppBar() {
  const navigate = useNavigate();

  const moreArtistsClick = () => {
    navigate("/artists");
  };

  const moreTracksClick = () => {
    navigate("/tracks");
  };

  const moreGenresClick = () => {
    navigate("/genres");
  };
  return (
    <>
      <div style={{ alignSelf: "start", width: "100%" }}>
        <h1 style={{ marginInline: "7%", textAlign: "left" }}>Statify</h1>
      </div>
      <Box sx={{ borderBottom: 1.5, borderColor: "black", width: "100%" }} />
      <Stack
        direction="row"
        width="100%"
        justifyContent="space-between"
        marginInline="2%"
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
            paddingInline: "7%",
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
            paddingInline: "7%",
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
            paddingInline: "7%",
          }}
        >
          Top Genres
        </Button>
      </Stack>
      <Box sx={{ borderBottom: 1.5, borderColor: "black", width: "100%" }} />
    </>
  );
}
