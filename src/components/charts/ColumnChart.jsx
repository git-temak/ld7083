import React from "react";
import Chart from "./Chart";

const ColumnChart = ({
  title = "",
  description = "",
  width = "100%",
  horizontal = false,
  data: { xval = [], yval = [] } = {},
  xlabel = "xaxis",
  ylabel = "yaxis",
  stacked = false,
  dateExtra,
  scaleFactor = false,
}) => {
  const chartConfig = {
    series: yval,
    options: {
      chart: {
        type: "bar",
        height: 350,
        stacked,
        toolbar: {
          show: true,
        },
        zoom: {
          enabled: true,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: stacked ? 0 : 5,
          dataLabels: {
            total: {
              // enabled: true,
              style: {
                fontSize: "14px",
                fontWeight: 900,
                marginBottom: 20,
              },
            },
          },
        },
      },
      tooltip: {
        y: {
          formatter: function (val) {
            return (val * 100000).toLocaleString();
          },
        },
      },
      xaxis: {
        type: dateExtra ? "datetime" : "",
        categories: xval,
      },
      yaxis: {
        title: {
          text: "(100K)",
        },
      },
      legend: {
        position: "left",
        // offsetY: 40,
      },
      fill: {
        opacity: 1,
      },
    },
  };
  if (dateExtra) {
    chartConfig.options.tooltip = {
      y: {
        formatter: function (val) {
          return (val * 100000).toLocaleString();
        },
      },
      x: {
        format: "MM/yy",
      },
    };
  }
  return (
    <Chart
      config={chartConfig}
      title={title}
      description={description}
      width={width}
      type="bar"
      height={horizontal ? "300px" : "370px"}
      scaleFactor={20}
      useScale={scaleFactor}
    />
  );
};

export default ColumnChart;
