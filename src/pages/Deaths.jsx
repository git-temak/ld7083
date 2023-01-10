import React, { useState, useEffect } from "react";
import {
  BarChart,
  ChartsContainer,
  ChartWrapperFull,
  ChartWrapperHalf,
  FlexContainerRes,
  LineChart,
  MetricsSection,
  PageContainer,
} from "../components";
import { useApiRequest } from "../hooks";
import ArrowUp from "../assets/icons/arrow-up.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";

const Deaths = () => {
  /*************
   * States
   *************/
  const { getDeathsOverview, getDeathsChartData } = useApiRequest();
  const [overviewData, setOverviewData] = useState();
  const [chartData, setChartData] = useState();
  const {
    deaths = [],
    within28 = [],
    within60 = [],
    within28Demo = [],
  } = chartData || {};

  const cardsDetails = Object.freeze([
    {
      number: overviewData?.total || "N/A",
      text: "Total number of people with COVID-19 on their death certificate",
      id: `deaths-0`,
    },
    {
      number: overviewData?.within28 || "N/A",
      text: "Total number of deaths after 28 days of positive test",
    },
    {
      number: overviewData?.within60 || "N/A",
      text: "Total number of deaths after 60 days of positive test",
    },
    {
      number: overviewData?.rate || "N/A",
      symbol: "%",
      text: "Total deaths by registration date rate",
      id: `deaths-3-dec`,
      icon: (
        <img
          src={overviewData?.rate < 0 ? ArrowDown : ArrowUp}
          alt="arrow-icon"
        />
      ),
    },
  ]);

  /*************
   * Functions
   *************/
  const loadData = async () => {
    const data = await getDeathsOverview("", true);
    const chartData = await getDeathsChartData("", true);
    if (data) setOverviewData(data);
    if (chartData) setChartData(chartData);
  };

  const updateChartDataByDate = async (date) => {
    const filteredByDate = await getDeathsOverview(date);
    const chartData = await getDeathsChartData(date);
    setOverviewData(filteredByDate);
    setChartData(chartData);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PageContainer>
      <MetricsSection
        cardsDetails={cardsDetails}
        clickHandler={updateChartDataByDate}
      />
      <ChartsContainer>
        <FlexContainerRes className="w-full gap-x-7 mt-7">
          <ChartWrapperFull>
            <LineChart
              dateExtra
              title="Deaths from COVID-19"
              ylabel="Deaths"
              description="An overview of the number of people who died from COVID-19 in all nations of the UK. Data are shown for each month and accumulated from all states in the UK."
              data={{
                xval: deaths.map((d) => d.date),
                yval: deaths.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperFull>
        </FlexContainerRes>
        <FlexContainerRes>
          <ChartWrapperHalf>
            <BarChart
              dateExtra
              title="Deaths within 28 days of positive test by date of death"
              ylabel="Deaths"
              description="COVID-19 death rates within 28 days of positive test based on date of death."
              data={{
                xval: within28.map((d) => d.date),
                yval: within28.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <BarChart
              title="Deaths within 28 days of positive test by age"
              ylabel="Deaths"
              description="An overview of the total number of people who died from COVID-19 within 28 days of testing positive since the start of pandemic based on age. "
              data={{
                xval: Object.keys(within28Demo),
                yval: Object.values(within28Demo),
              }}
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes>
          <ChartWrapperFull>
            <BarChart
              dateExtra
              title="Deaths within 60 days of positive test by date of death"
              ylabel="Deaths"
              description="COVID-19 death rates within 60 days of positive test based on date of death."
              data={{
                xval: within60.map((d) => d.date),
                yval: within60.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperFull>
        </FlexContainerRes>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Deaths;
