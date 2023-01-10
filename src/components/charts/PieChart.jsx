import React from "react";
import Chart from "./Chart";

const PieChart = ({
  title = "",
  description = "",
  width = "100%",
  data = [],
}) => {
  const chartConfig = {
    series: data.map((d) => d.value),
    options: {
      chart: {
        width: "500px",
        type: "pie",
      },
      labels: data.map((d) => d.label),
      legend: { position: "bottom" },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: "200",
            },
            legend: { position: "bottom" },
          },
        },
      ],
    },
  };

  return (
    <Chart
      config={chartConfig}
      title={title}
      description={description}
      width={width}
      type="pie"
    />
  );
};

export default PieChart;
