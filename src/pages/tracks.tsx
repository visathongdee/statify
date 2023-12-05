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
import { getTimeRangeButtons } from "./artists";
import { topArtistStack } from "./main";
import { Bar } from "react-chartjs-2";
import { EightBitLoader } from "react-loaders-kit";
import domtoimage from "dom-to-image";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"bar", number[], string>;

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
  };

  const getTrackPopularityComp = () => {
    // console.log(topArtists);
    const tracksPopularityArr = topTracks.map(({ name, popularity, album }) => {
      return {
        name: name,
        popularity: popularity,
        image: album.images[0].url,
      };
    });

    tracksPopularityArr.sort((a, b) => b.popularity - a.popularity);

    const tracksPopularity = tracksPopularityArr.reduce<Record<string, number>>(
      (acc, { name, popularity }) => {
        acc[name] = popularity;
        return acc;
      },
      {}
    );

    let popularityData: ChartData = {
      labels: Object.keys(tracksPopularity),
      datasets: [
        {
          label: "Tracks Popularity",
          data: Object.values(tracksPopularity),
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

    return (
      <>
        <Box className="main-boxes">
          {getTitleBox(
            "Tracks Popularity",
            handleAllTimeClick,
            handleSixMonthClick,
            handleFourWeeksClick
          )}
          <Stack margin="5%">
            <Bar
              datasetIdKey="id"
              data={popularityData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    color: "#000000",
                  },
                  legend: {
                    display: false,
                    position: "bottom",
                    labels: {
                      color: "#000000",
                      font: {
                        size: 16,
                      },
                    },
                  },
                },
              }}
            />
          </Stack>
          <Stack>
            <h3 style={{ margin: "0%" }}>From your top 20 artists...</h3>
            <h2>The most popular song you listen to is:</h2>
            <Stack alignItems="center">
              {tracksPopularityArr[0].image.length > 0 &&
                tracksPopularityArr[0].image && (
                  <img
                    src={tracksPopularityArr[0].image}
                    alt="Artist"
                    className="profile-image"
                  />
                )}
              <h3>{tracksPopularityArr[0].name}</h3>
            </Stack>

            <h2>The least popular song you listen to is:</h2>
            <Stack alignItems="center">
              {tracksPopularityArr[tracksPopularityArr.length - 1].image
                .length > 0 &&
                tracksPopularityArr[tracksPopularityArr.length - 1].image && (
                  <img
                    src={
                      tracksPopularityArr[tracksPopularityArr.length - 1].image
                    }
                    alt="Artist"
                    className="profile-image"
                  />
                )}
              <h3>
                {tracksPopularityArr[tracksPopularityArr.length - 1].name}
              </h3>
            </Stack>
          </Stack>
        </Box>
      </>
    );
  };

  const loaderProps = {
    loading,
    size: 80,
    duration: 1,
    color: "#7FD485",
  };

  const checkLoadingComponents = () => {
    if (!loading && topTracks && topTracks.length > 0) {
      return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={5}>
          {getTopTracksComp()}
          {getTrackPopularityComp()}
        </Stack>
      );
    } else {
      //   <Stack margin="20%">
      return (
        <Stack alignItems="center">
          <EightBitLoader {...loaderProps} />
        </Stack>
      );
    }
  };

  const handleDownloadImage = () => {
    let node = document.getElementById("top-tracks");

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
          link.download = "my-top-tracks.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error("Error in converting to JPEG:", error);
        });
    }
  };

  const checkLoadingButton = () => {
    if (!loading && topTracks && topTracks.length > 0) {
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
      }}
    >
      <MyAppBar />
      <Stack margin="5%" spacing={5} alignItems="center">
        {getTimeRangeButtons(
          handleAllTimeClick,
          handleSixMonthClick,
          handleFourWeeksClick
        )}
        <div id="top-tracks">{checkLoadingComponents()}</div>
      </Stack>
      {checkLoadingButton()}
    </div>
  );
}
