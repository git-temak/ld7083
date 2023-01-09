import React from "react";
import Chart from "./Chart";

const AreaChart = ({
  title = "",
  description = "",
  width = "100%",
  data: { xval = [], yval = [] } = {},
  xlabel = "xaxis",
  ylabel = "yaxis",
}) => {
  const chartConfig = {
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: xval,
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

export default AreaChart;
