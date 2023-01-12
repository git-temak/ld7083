import React from "react";
import Chart from "./Chart";

const BarChart = ({
  title = "",
  description = "",
  width = "100%",
  horizontal = false,
  data: { xval = [], yval = [] } = {},
  xlabel = "xaxis",
  ylabel = "yaxis",
  dateExtra,
  scaleFactor = false,
}) => {
  const chartConfig = {
    options: {
      chart: {
        id: "basic-bar",
      },
      legend: {
        show: true,
        position: "bottom",
        showForSingleSeries: false,
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: xval,
      },
      plotOptions: {
        bar: {
          horizontal,
          borderRadius: 4,
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
  if (dateExtra) {
    chartConfig.options.xaxis = {
      ...chartConfig.options.xaxis,
      type: dateExtra ? "datetime" : "",
    };
  }

  return (
    <Chart
      config={chartConfig}
      title={title}
      description={description}
      width={width}
      type="bar"
      height={horizontal ? "300px" : "350px"}
      useScale={!!scaleFactor}
      scaleFactor={scaleFactor}
    />
  );
};

export default BarChart;
