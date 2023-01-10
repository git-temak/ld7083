import React, { useEffect, useState } from "react";
import { useApiRequest } from "../hooks";
import tw, { styled } from "twin.macro";
import {
  MetricsSection,
  PageContainer,
  BarChart,
  LineChart,
  SplineAreaChart,
  PieChart,
  ChartsContainer,
  FlexContainerRes,
  ChartWrapperHalf,
  ChartWrapperOneQuarter,
} from "../components";
import { chartMultiSeries } from "../utils";

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

  const healthcareChartData = chartMultiSeries(healthcares);

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
  }, []);
  return (
    <PageContainer>
      <MetricsSection
        cardsDetails={cardsDetails}
        clickHandler={updateChartDataByDate}
      />
      <ChartsContainer>
        <FlexContainerRes className="w-full gap-x-7 mt-7">
          <ChartWrapperHalf>
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
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <BarChart
              title="COVID-19 cases by age"
              ylabel="Cases"
              description="An overview of the total number of COVID-19 cases since the start of pandemic based on ages. "
              data={{
                xval: Object.keys(ageCases),
                yval: Object.values(ageCases),
              }}
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperOneQuarter>
            <BarChart
              horizontal={true}
              data={{
                xval: vaccines.map((d) => d.dose),
                yval: vaccines.map((d) => `${d.value / 1000000}M`),
              }}
              ylabel="Doses"
              title="Number of people vaccinated based on dose"
              description="An overview of the number of vaccinations given based on first, second, third dose or booster."
            />
          </ChartWrapperOneQuarter>
          <ChartWrapperHalf>
            <SplineAreaChart
              ylabel="Admissions"
              dateExtra
              data={healthcareChartData}
              title="Patients admitted to hospital based on region"
              description="An overview of the total number of COVID-19 patients admitted to the hospital since the start of pandemic based on states in the UK."
            />
          </ChartWrapperHalf>
          <ChartWrapperOneQuarter>
            <PieChart
              ylabel="Cases"
              data={infections}
              title="COVID-19 cases by occurence of infection"
              description="Total number of cases since the start of pandemic based on first infections and reinfections."
            />
          </ChartWrapperOneQuarter>
        </FlexContainerRes>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Overview;
