import React from "react";
import Chart from "./Chart";

const SplineAreaChart = ({
  title = "",
  description = "",
  width = "100%",
  data: { xval = [], yval = [] } = {},
  xlabel = "xaxis",
  ylabel = "yaxis",
  dateExtra = false,
  yFormatter = null,
  type = "area",
  scaleFactor = 10,
}) => {
  const chartConfig = {
    series: yval,
    options: {
      chart: {
        height: 350,
        type: "area",
      },
      dataLabels: {
        enabled: false,
        colors: ["red", "yellow", "blue"],
      },
      stroke: {
        curve: "straight",
      },
      xaxis: {
        type: dateExtra ? "datetime" : "",
        categories: xval,
      },
      tooltip: {
        x: {
          format: dateExtra ? "MM/yy" : "",
        },
      },
      legend: {
        show: true,
        position: "left",
        showForSingleSeries: false,
      },
      colors: [
        "#33b2df",
        "#546E7A",
        "#d4526e",
        "#13d8aa",
        "#A5978B",
        "#2b908f",
        "#f9a3a4",
        "#90ee7e",
        "#f48024",
        "#69d2e7",
      ],
    },
  };

  if (yFormatter) {
    chartConfig.options.tooltip = {
      ...chartConfig.options.tooltip,
      y: {
        formatter: yFormatter,
      },
    };
  }

  return (
    <Chart
      config={chartConfig}
      title={title}
      description={description}
      width={width}
      type={type}
      scaleFactor={scaleFactor}
      useScale={scaleFactor}
    />
  );
};

export default SplineAreaChart;
