import React from "react";
import Chart from "./Chart";

const LineChart = ({
  title = "",
  description = "",
  width = "100%",
  data: { xval = [], yval = [] } = {},
  xlabel = "xaxis",
  ylabel = "yaxis",
  dateExtra = false,
}) => {
  const chartConfig = {
    options: {
      chart: {
        id: "basic-bar",
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
    },
    series: [
      {
        name: ylabel,
        data: yval,
      },
    ],
  };

  return (
    <Chart
      config={chartConfig}
      title={title}
      description={description}
      width={width}
      type="area"
    />
  );
};

export default LineChart;
