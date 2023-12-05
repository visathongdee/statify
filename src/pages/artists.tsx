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
import { Bar } from "react-chartjs-2";
import { BarsLoader2, EightBitLoader } from "react-loaders-kit";
import domtoimage from "dom-to-image";

import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"bar", number[], string>;

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
      {label}
    </Button>
  );
};

export const getTimeRangeButtons = (
  handleAllTimeClick: React.MouseEventHandler<HTMLButtonElement> | undefined,
  handleSixMonthClick: React.MouseEventHandler<HTMLButtonElement> | undefined,
  handleFourWeeksClick: React.MouseEventHandler<HTMLButtonElement> | undefined
) => {
  return (
    <Stack direction="row" spacing={2} sx={{ whiteSpace: "wrap" }}>
      {getTimeRangeButton(handleAllTimeClick, "All Time")}
      {getTimeRangeButton(handleSixMonthClick, "6 Months")}
      {getTimeRangeButton(handleFourWeeksClick, "4 Weeks")}
    </Stack>
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
        {/* {getTimeRangeButtons(
          handleAllTimeClick,
          handleSixMonthClick,
          handleFourWeeksClick
        )} */}
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
      //   console.log("artists:", artists);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
    setLoading(false);
  };

  const getTopArtistsComp = () => {
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
        </Box>
      </>
    );
  };

  const getArtistPopularityComp = () => {
    // console.log(topArtists);
    const artistPopularityArr = topArtists.map((artist) => {
      return {
        name: artist.name,
        popularity: artist.popularity,
        image: artist.images[0].url,
      };
    });

    artistPopularityArr.sort((a, b) => b.popularity - a.popularity);

    const artistPopularity = artistPopularityArr.reduce<Record<string, number>>(
      (acc, { name, popularity }) => {
        acc[name] = popularity;
        return acc;
      },
      {}
    );

    let popularityData: ChartData = {
      labels: Object.keys(artistPopularity),
      datasets: [
        {
          label: "Artists Popularity",
          data: Object.values(artistPopularity),
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
            "Artists Popularity",
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
              style={{ width: "100%" }}
            />
          </Stack>
          <Stack>
            <h3 style={{ margin: "0%" }}>From your top 20 artists...</h3>
            <h2>The most popular artist you listen to is:</h2>
            <Stack alignItems="center">
              {artistPopularityArr[0].image.length > 0 &&
                artistPopularityArr[0].image && (
                  <img
                    src={artistPopularityArr[0].image}
                    alt="Artist"
                    className="profile-image"
                  />
                )}
              <h3>{artistPopularityArr[0].name}</h3>
            </Stack>

            <h2>The least popular artist you listen to is:</h2>
            <Stack alignItems="center">
              {artistPopularityArr[artistPopularityArr.length - 1].image
                .length > 0 &&
                artistPopularityArr[artistPopularityArr.length - 1].image && (
                  <img
                    src={
                      artistPopularityArr[artistPopularityArr.length - 1].image
                    }
                    alt="Artist"
                    className="profile-image"
                  />
                )}
              <h3>
                {artistPopularityArr[artistPopularityArr.length - 1].name}
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
    if (!loading && topArtists && topArtists.length > 0) {
      return (
        <Stack direction={{ xs: "column", sm: "row" }} spacing={5}>
          {getTopArtistsComp()}
          {getArtistPopularityComp()}
        </Stack>
      );
    } else {
      return (
        <Stack>
          <EightBitLoader {...loaderProps} />
        </Stack>
      );
    }
  };

  const handleDownloadImage = () => {
    let node = document.getElementById("top-artists");

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
          link.download = "my-top-artists.jpeg";
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          console.error("Error in converting to JPEG:", error);
        });
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
      }}
    >
      <MyAppBar />
      <Stack margin="5%" spacing={5} alignItems="center">
        {getTimeRangeButtons(
          handleAllTimeClick,
          handleSixMonthClick,
          handleFourWeeksClick
        )}
        <div id="top-artists">{checkLoadingComponents()}</div>
      </Stack>
      {checkLoadingButton()}
    </div>
  );
}
