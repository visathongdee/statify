import * as React from "react";
import { Stack, Button } from "@mui/material";
import "../style.css";
import SpotifyIcon from "../assets/spotify icon.png";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  const mainRedirectClick = () => {
    navigate("/main");
  };

  const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const REDIRECT_URI = "http://localhost:3000/main";
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
  const RESPONSE_TYPE = "token";
  const SCOPES = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
    "user-modify-playback-state",
  ];

  const SCOPES_URL = SCOPES.join("%20");

  const spotifyLoginClick = () => {
    window.setTimeout(function () {
      window.location.href = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES_URL}&response_type=${RESPONSE_TYPE}&show_dialog=true`;
    }, 1500);
  };

  return (
    <div className="centered">
      <Stack direction="column" alignItems="center" justifyContent="center">
        <h1 style={{ margin: 0 }}>statify</h1>
        <h3 style={{ margin: 0, marginBottom: 10 }}>
          check out your spotify stats
        </h3>
        <Button
          variant="outlined"
          style={{ textTransform: "none", borderColor: "black" }}
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
          onClick={spotifyLoginClick}
        >
          <Stack direction="row" spacing={2}>
            <img
              src={SpotifyIcon}
              style={{ height: "20px", marginTop: "5%", marginRight: "8px" }}
            />
            connect to spotify
          </Stack>
        </Button>
      </Stack>
    </div>
  );
}
