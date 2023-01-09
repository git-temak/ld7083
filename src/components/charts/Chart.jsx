import React from "react";
import { ChartContainer } from "../styledElements";
import ChartLib from "react-apexcharts";
import tw, { styled } from "twin.macro";

const ChartTitle = styled.p`
  ${tw`font-medium text-lg mb-4`};
`;

const ChartDescription = styled.p`
  ${tw`text-textgray text-base`}
`;

const Chart = ({
  description = "",
  title = "",
  type = "",
  width = "100%",
  height = "370px",
  config,
  scaleFactor = 12,
}) => {
  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartDescription>{description}</ChartDescription>
      <ChartLib
        {...config}
        type={type}
        width={`${
          config.options?.xaxis?.categories?.length > 15
            ? config.options?.xaxis?.categories?.length * scaleFactor
            : 100
        }%`}
        height={height}
      />
    </ChartContainer>
  );
};

export default Chart;
