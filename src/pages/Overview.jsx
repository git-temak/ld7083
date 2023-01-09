import React, { useEffect, useState } from "react";
import { useApiRequest } from "../hooks";
import tw, { styled } from "twin.macro";
import {
  MetricsSection,
  PageContainer,
  BarChart,
  FlexContainer,
  LineChart,
  AreaChart,
  SplineAreaChart,
  PieChart,
  ChartWrapper,
  ChartsContainer,
} from "../components";

const Overview = () => {
  const { getOverviewChartsData, getOverviewCardData } = useApiRequest();
  const [overviewData, setOverviewData] = useState();
  const [chartData, setChartData] = useState();
  const {
    deaths = [],
    healthcares = [],
    vaccines = [],
    ageCases = [],
    infections = [],
  } = chartData || {};

  const cardsDetails = Object.freeze([
    {
      number: overviewData?.cases || "N/A",
      text: "Total number of COVID-19 cases",
    },
    {
      number: overviewData?.deaths || "N/A",
      text: "Total deaths from COVID-19",
    },
    {
      number: overviewData?.healthcares || "N/A",
      text: "Total patients admitted in the hospital",
    },
    {
      number: overviewData?.vaccines || "N/A",
      text: "Total number of vaccinations given",
      id: "overview-3",
    },
  ]);

  const healthcareChartData = {
    yval: Object.entries(healthcares).map(([country, value]) => ({
      name: country,
      data: value.slice(0, 500).map((d) => d.value),
    })),
    xval: [
      ...new Set(
        Object.values(healthcares)
          .slice(0, 500)
          .flat()
          .map((v) => v.date)
      ),
    ],
  };

  /*************
   * Functions
   *************/

  const loadData = async () => {
    const data = await getOverviewCardData("", true);
    const chartsData = await getOverviewChartsData();

    if (data) setOverviewData(data);
    if (chartsData) {
      setChartData(chartsData);
    }
  };

  const updateChartDataByDate = async (date) => {
    const filteredByDate = await getOverviewChartsData(date);
    const filteredCardData = await getOverviewCardData(date);
    setChartData(filteredByDate);
    setOverviewData(filteredCardData);
  };

  useEffect(() => {
    loadData();
    console.log("Rendering overview page...");
  }, []);
  return (
    <PageContainer>
      <MetricsSection
        cardsDetails={cardsDetails}
        clickHandler={updateChartDataByDate}
      />
      <ChartsContainer>
        <FlexContainer className="w-full gap-x-7 mt-7">
          <ChartWrapper className="w-1/2 bg-primarygray h-[500px]">
            <LineChart
              dateExtra
              title="Deaths from COVID-19"
              ylabel="Deaths"
              description="Total number of Death from COVID-19 based on all demographics from the start of pandemic to date."
              data={{
                xval: deaths.slice(0, 500).map((d) => d.date),
                yval: deaths.slice(0, 500).map((d) => d.value || 0),
              }}
            />
          </ChartWrapper>
          <ChartWrapper className="w-1/2 ">
            <BarChart
              title="COVID-19 cases by age"
              ylabel="Cases"
              description="An overview of the total number of COVID-19 cases since the start of pandemic based on ages. "
              data={{
                xval: Object.keys(ageCases),
                yval: Object.values(ageCases),
              }}
            />
          </ChartWrapper>
        </FlexContainer>
        <FlexContainer className="w-full gap-x-7 mt-7">
          <ChartWrapper className="w-1/4">
            <BarChart
              horizontal={true}
              data={{
                xval: vaccines.map((d) => d.dose),
                yval: vaccines.map((d) => `${d.value / 1000000}M`),
              }}
              ylabel="Dose"
              title="Number of people vaccinated based on dose"
              description="An overview of the number of vaccinations given based on first, second, third dose or booster."
            />
          </ChartWrapper>
          <ChartWrapper className="w-1/2">
            <SplineAreaChart
              dateExtra
              data={healthcareChartData}
              title="Patients admitted to hospital based on region"
              description="An overview of the total number of COVID-19 patients admitted to the hospital since the start of pandemic based on states in the UK."
            />
          </ChartWrapper>
          <ChartWrapper className="w-1/4">
            <PieChart
              data={infections}
              title="COVID-19 cases by occurence of infection"
              description="Total number of cases since the start of pandemic based on first infections and reinfections."
            />
          </ChartWrapper>
        </FlexContainer>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Overview;
