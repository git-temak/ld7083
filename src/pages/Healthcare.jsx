import React, { useEffect, useState } from "react";
import {
  BarChart,
  ChartsContainer,
  ChartWrapperHalf,
  FlexContainerRes,
  LineChart,
  MetricsSection,
  PageContainer,
} from "../components";
import { useApiRequest } from "../hooks";

import ArrowUp from "../assets/icons/arrow-up.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";
import { chartAgeSeries } from "../utils";

const Healthcare = () => {
  /*************
   * States
   *************/
  const { getHealthcareOverview, getHealthcareChartData } = useApiRequest();
  const [overviewData, setOverviewData] = useState();
  const [chartData, setChartData] = useState();

  const {
    allAds = [],
    ventilationBed = [],
    inHospital = [],
    byAge = [],
  } = chartData || {};

  const cardsDetails = Object.freeze([
    {
      number: overviewData?.total || "N/A",
      text: "Total number of patients admitted to hospital",
      id: `healthcare-0`,
    },
    {
      number: overviewData?.ventilationBeds || "N/A",
      text: "Total number of COVID-19 patients admitted on ventilation beds",
    },
    {
      number: overviewData?.inHospital || "N/A",
      text: "Total number of COVID-19 patients currently in hospital",
    },
    {
      number: overviewData?.rate || "N/A",
      text: "New admissions percentage change",
      symbol: "%",
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
    const data = await getHealthcareOverview("", true);
    const chartData = await getHealthcareChartData("", true);
    if (data) setOverviewData(data);
    if (chartData) setChartData(chartData);
  };

  const updateChartDataByDate = async (date) => {
    const filteredByDate = await getHealthcareOverview(date);
    const chartData = await getHealthcareChartData(date);
    setOverviewData(filteredByDate);
    setChartData(chartData);
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <PageContainer>
      <MetricsSection
        showFilters={false}
        cardsDetails={cardsDetails}
        clickHandler={updateChartDataByDate}
      />
      <ChartsContainer>
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperHalf>
            <LineChart
              dateExtra
              title="Total patients admitted"
              ylabel="Admissions"
              description="An overview of the number of patients who are admitted to hospital due to COVID-19."
              data={{
                xval: allAds.map((d) => d.date),
                yval: allAds.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <BarChart
              title="Patients admitted to hospital by age"
              ylabel="Admissions"
              description="An overview of the number of patients who are admitted to hospital due to COVID-19 since the start of pandemic based on age. "
              data={chartAgeSeries(byAge)}
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperHalf>
            <BarChart
              dateExtra
              title="Total patients admitted on ventilation beds over time"
              ylabel="Admissions"
              description="Patients admitted into ventilation bed"
              data={{
                xval: ventilationBed.map((d) => d.date),
                yval: ventilationBed.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <BarChart
              dateExtra
              title="Total patients admitted in hospital over time"
              ylabel="Admissions"
              description="Patients in hospitals over time"
              data={{
                xval: inHospital.map((d) => d.date),
                yval: inHospital.map((d) => d.value || 0),
              }}
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Healthcare;
