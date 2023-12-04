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

export default function TopGenres() {
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

  useEffect(() => {
    getPieChartData();
  }, [topArtists]);

  const fetchTopArtists = async () => {
    try {
      const artists = await getTopArtists();
      setTopArtists(artists);
      console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
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
        <h1 style={{ margin: 0 }}>Your Top Genres</h1>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          margin="5%"
          spacing={5}
        >
          {topGenres.map((track) => (
            <Stack
              key={track}
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={1}
            >
              <h2>{track}</h2>
            </Stack>
          ))}
        </Stack>
        <PieChart chartData={pieData} artistToGenres={artistGenres} />
      </Stack>
    </div>
  );
}
