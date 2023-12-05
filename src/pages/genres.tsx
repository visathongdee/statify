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
import html2canvas from "html2canvas";
import domtoimage from "dom-to-image";
import { saveAs } from "file-saver";
import { getTimeRangeButtons, getTitleBox } from "./artists";
import { EightBitLoader } from "react-loaders-kit";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export default function TopGenres() {
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);
  const [topGenres, setTopGenres] = useState<string[]>([]);
  const [topUniqueGenres, setTopUniqueGenres] = useState<string[]>([]);
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
      //   console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
    setLoading(false);
  };

  const getTopGenresComp = () => {
    return (
      <Box className="main-boxes">
        {getTitleBox(
          "Top Genres",
          handleAllTimeClick,
          handleSixMonthClick,
          handleFourWeeksClick
        )}
        <Stack
          direction="column"
          alignItems="space-between"
          justifyContent="space-between"
          spacing={2}
          className="card-content-stack"
        >
          {topUniqueGenres.map((genre, i) => (
            <div style={{ alignSelf: "start", width: "100%" }}>
              <Stack
                key={genre}
                direction="column"
                alignItems="start"
                justifyContent="start"
                spacing={1}
              >
                <h1 className="card-text-content">
                  {i + 1}. {genre}
                </h1>
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
    setTopGenres(topGenres);
    setTopUniqueGenres(Array.from(new Set(topGenres)));

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
            "#f7b2b2",
            "#fbaed2",
            "#ffc1f3",
            "#dcbcff",
            "#d1b3ff",
            "#c7aefb",
            "#b6b6d8",
            "#a4d8f0",
            "#9cffff",
            "#b3f4ff",
            "#f78ca0",
            "#fddaa0",
            "#f3e1b6",
            "#e1e18e",
            "#f7f79e",
            "#b7e089",
            "#baf2a1",
            "#e5e5e5",
            "#d1d1d1",
            "#b8b8b8",
          ],
          borderColor: "white",
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
            textAlign="left"
            spacing={5}
          >
            <h1 className="card-text-title">Genre Pie Chart</h1>
          </Stack>
        </Box>
        <PieChart chartData={pieData} artistToGenres={artistGenres} />
      </Box>
    );
  };

  const handleDownloadImage = () => {
    let node = document.getElementById("top-genres");

    if (node) {
      domtoimage
        .toJpeg(node, {
          quality: 0.95,
          style: {
            backgroundColor: "white",
          },
        })
        .then(function (dataUrl) {
          var link = document.createElement("a");
          link.download = "my-top-genres.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error("Error in converting to JPEG:", error);
        });
    }
  };

  const loaderProps = {
    loading,
    size: 80,
    duration: 1,
    color: "#7FD485",
  };

  const checkLoadingComponents = () => {
    if (!loading && topArtists && topArtists.length > 0) {
      return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={5}>
          {getTopGenresComp()}
          {getPieChartComp()}
        </Stack>
      );
    } else {
      return (
        <Stack alignItems="center">
          <EightBitLoader {...loaderProps} />
        </Stack>
      );
    }
  };

  const checkLoadingButton = () => {
    if (!loading && topArtists && topArtists.length > 0) {
      return (
        <Button
          className="see-more-button"
          onClick={handleDownloadImage}
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
            // width: "50%",
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
          Download as Image
        </Button>
      );
    } else {
      return <></>;
    }
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "absolute",
        marginBottom: "5%",
      }}
    >
      <MyAppBar />
      <Stack spacing={5} margin="5%">
        <Stack alignItems="center">
          {getTimeRangeButtons(
            handleAllTimeClick,
            handleSixMonthClick,
            handleFourWeeksClick
          )}
        </Stack>
        <div id="top-genres">{checkLoadingComponents()}</div>
      </Stack>
      {checkLoadingButton()}
    </div>
  );
}
