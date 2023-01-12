import React, { useEffect, useState } from "react";
import {
  BarChart,
  ChartsContainer,
  ChartWrapperFull,
  ChartWrapperHalf,
  FlexContainerRes,
  MetricsSection,
  PageContainer,
  SplineAreaChart,
} from "../components";
import { useApiRequest } from "../hooks";
import ArrowUp from "../assets/icons/arrow-up.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";
import { chartMultiSeries } from "../utils";

const Cases = () => {
  const { getCasesOverview, getCasesChartData } = useApiRequest();
  const [overviewData, setOverviewData] = useState();
  const [chartData, setChartData] = useState();

  const {
    caseTypes,
    byAge = [],
    byRegion = [],
    monthlyCases = [],
  } = chartData || {};

  const refinedCaseTypes = chartMultiSeries(caseTypes);
  const refinedRegions = chartMultiSeries(byRegion);

  const cardsDetails = Object.freeze([
    {
      number: overviewData?.total || "N/A",
      text: "Total number of COVID-19 cases",
    },
    {
      number: overviewData?.firstEpisodes || "N/A",
      text: "First COVID-19 infections",
    },
    {
      number: overviewData?.reinfections || "N/A",
      text: "Reinfections",
    },
    {
      number: overviewData?.rate || "N/A",
      symbol: "%",
      text: "Total cases by publish date rate",
      id: `cases-3-dec`,
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
    const data = await getCasesOverview("", true);
    const chartData = await getCasesChartData();
    if (data) setOverviewData(data);
    if (chartData) setChartData(chartData);
  };

  const updateChartDataByDate = async (date) => {
    const filteredByDate = await getCasesOverview(date);
    const chartData = await getCasesChartData(date);
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
            <SplineAreaChart
              scaleFactor={false}
              type="area"
              dateExtra
              data={refinedCaseTypes}
              yFormatter={(val = 0) => {
                return val.toLocaleString();
              }}
              title="Growth rate of COVID-19 cases"
              ylabel="Cases"
              description="An overview on the growth of COVID-19 cases over the months since the start of pandemic."
            />
          </ChartWrapperFull>
        </FlexContainerRes>
        <FlexContainerRes>
          <ChartWrapperHalf>
            <BarChart
              title="COVID-19 cases by age"
              ylabel="Cases"
              description="An overview of the total number of COVID-19 cases since the start of pandemic based on ages. "
              data={{
                xval: Object.keys(byAge).map((age) => age.split("_").join("-")),
                yval: Object.values(byAge),
              }}
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <SplineAreaChart
              dateExtra
              data={refinedRegions}
              yFormatter={(val = 0) => {
                return val.toLocaleString();
              }}
              title="Growth rate of COVID-19 cases"
              ylabel="Cases"
              description="An overview on the growth of COVID-19 cases over the months since the start of pandemic."
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes>
          <ChartWrapperFull>
            <BarChart
              dateExtra
              title="Monthly cases of COVID-19"
              ylabel="Cases"
              description="An overview on the monthly increase and decrease of COVID-19 cases over the years since the start of pandemic."
              data={{
                xval: monthlyCases.map((d) => d.date),
                yval: monthlyCases.map((d) => d.value),
              }}
            />
          </ChartWrapperFull>
        </FlexContainerRes>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Cases;
