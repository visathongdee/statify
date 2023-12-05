import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import { ChartData as ChartJsData } from "chart.js";

type ChartData = ChartJsData<"pie", number[], string>;

export type ArtistGenre = {
  name: string;
  genres: string[];
};

type PiChartProps = {
  chartData?: ChartData;
  artistToGenres?: ArtistGenre[];
};

const PieChart: React.FC<PiChartProps> = ({
  chartData = undefined,
  artistToGenres = [],
}) => {
  return (
    <div style={{ margin: "5%" }}>
      {chartData && (
        <Pie
          className="pie-chart"
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                // text: "Your Top Genres",
                color: "#000000",
              },
              legend: {
                display: true,
                position: "bottom",
                labels: {
                  color: "#000000",
                  font: {
                    size: 16,
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    let initialLabel = context.label + ": ";
                    const artists: string[] = artistToGenres
                      .map((artist) => {
                        return artist.genres.includes(context.label)
                          ? artist.name
                          : "";
                      })
                      .filter((name) => name);

                    initialLabel += artists.join(", ");
                    return initialLabel;
                  },
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default PieChart;
