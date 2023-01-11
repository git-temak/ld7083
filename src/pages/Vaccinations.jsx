import React, { useEffect, useState } from "react";
import {
  BarChart,
  ChartsContainer,
  ChartWrapperHalf,
  ChartWrapperFull,
  ColumnChart,
  FlexContainer,
  MetricsSection,
  PageContainer,
  SplineAreaChart,
  FlexContainerRes,
} from "../components";
import { useApiRequest } from "../hooks";
import { decToFixed } from "../utils";

const Vaccinations = () => {
  const { getVaccinationCardData, getVaccineOverview } = useApiRequest();
  const [vaccineOverview, setVaccineOverview] = useState();
  const [chartData, setChartData] = useState();
  const {
    byDate,
    byAges,
    belowTo50 = {},
    above50 = {},
    monthlyVaccines = [],
  } = chartData || {};

  const refinedVaccbyDate = byDate
    ? {
        yval: Object.entries(byDate).map(([dose, value]) => ({
          name: dose[0].toUpperCase() + dose.slice(1),
          data: value.slice(0, 500).map((d) => decToFixed(d.value / 100000, 2)),
        })),
        xval: [
          ...new Set(
            Object.values(byDate)
              .slice(0, 500)
              .flat()
              .map((v) => v.date)
          ),
        ],
      }
    : {};

  const refinedVaccineDemo = byAges
    ? {
        yval: Object.entries(byAges)?.map(([dose, value]) => ({
          name: dose[0].toUpperCase() + dose.slice(1),
          data: value?.map((v) => decToFixed(v.value / 100000, 2)),
        })),
        xval: byAges?.firstDose?.map((v) => v.age),
      }
    : {};

  const refinedBelow50 = {
    yval: Object.entries(belowTo50)?.map(([age, value]) => ({
      name: age,
      data: value.map((d) => d.value),
    })),
    xval: [
      ...new Set(
        Object.values(belowTo50)
          ?.flat()
          .map((v) => v.date)
      ),
    ],
  };

  const refinedAbove50 = {
    yval: Object.entries(above50)?.map(([age, value]) => ({
      name: age,
      data: value.map((d) => d.value),
    })),
    xval: [
      ...new Set(
        Object.values(belowTo50)
          ?.flat()
          .map((v) => v.date)
      ),
    ],
  };

  const cardsDetails = Object.freeze([
    {
      number: vaccineOverview?.total ?? "N/A",
      text: "Total number of COVID-19 vaccinations given",
      id: `vaccinations-0`,
    },
    {
      number: vaccineOverview?.firstDose ?? "N/A",
      text: "Total number of first dose given",
    },
    {
      number: vaccineOverview?.secondDose ?? "N/A",
      text: "Total number of second dose given",
    },
    {
      number: vaccineOverview?.thirdDose ?? "N/A",
      text: "Total number of third dose or booster given",
    },
  ]);

  /*************
   * Functions
   *************/

  // fetches cards and chart data on page initial render
  const loadData = async () => {
    const chartsData = await getVaccinationCardData("", true);
    const data = await getVaccineOverview("", true);

    if (data) setVaccineOverview(data);
    if (chartsData) {
      setChartData(chartsData);
    }
  };

  // filters data by provided date
  const updateChartDataByDate = async (date) => {
    const filteredByDate = await getVaccinationCardData(date);
    const filteredCardByDate = await getVaccineOverview(date);

    setChartData(filteredByDate);
    setVaccineOverview(filteredCardByDate);
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
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperHalf>
            <ColumnChart
              dateExtra
              scaleFactor
              data={refinedVaccbyDate}
              stacked
              title="Vaccinations given by vaccination date"
              ylabel="Vaccinations"
              description="An overview on vaccines given to people based on dose types and date."
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <ColumnChart
              scaleFactor
              data={refinedVaccineDemo}
              title="Vaccine intake by age"
              ylabel="Vaccinations"
              description="An overview of the total number of COVID-19 vaccines given since the start of pandemic based on age and sex. "
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperHalf>
            <SplineAreaChart
              type="line"
              dateExtra
              data={refinedBelow50}
              yFormatter={(val = 0) => {
                return val.toLocaleString();
              }}
              title="Vaccine dose intake by people aged 50 and less"
              ylabel="Vaccinations"
              description="A visualization overview of the number of COVID’19 vaccine doses given to people aged 0-49 based on the dose type."
            />
          </ChartWrapperHalf>
          <ChartWrapperHalf>
            <SplineAreaChart
              type="line"
              data={refinedAbove50}
              dateExtra
              yFormatter={(val) => {
                return val.toLocaleString();
              }}
              title="Vaccine dose intake by people aged 51 & above"
              ylabel="Vaccinations"
              description="A visualization overview of the number of COVID’19 vaccine doses given to people aged 51+ based on the dose type."
            />
          </ChartWrapperHalf>
        </FlexContainerRes>
        <FlexContainerRes className="gap-x-7 mt-7">
          <ChartWrapperFull>
            <BarChart
              dateExtra
              data={{
                xval: monthlyVaccines.map((d) => d.date),
                yval: monthlyVaccines.map((d) => d.value || 0),
              }}
              yFormatter={(val = 0) => {
                return val.toLocaleString();
              }}
              title="Overview of monthly complete vaccinations"
              ylabel="Vaccinations"
              description="An overview on the monthly increase of COVID-19 complete vaccinations over the years since the start of pandemic."
            />
          </ChartWrapperFull>
        </FlexContainerRes>
      </ChartsContainer>
    </PageContainer>
  );
};

export default Vaccinations;
