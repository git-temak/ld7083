import React, { useEffect, useState } from "react";
import { MetricsSection, PageContainer } from "../components";
import { useApiRequest } from "../hooks";
import ArrowUp from "../assets/icons/arrow-up.svg";
import ArrowDown from "../assets/icons/arrow-down.svg";

const Cases = () => {
  const { getOverview } = useApiRequest();
  const [overviewData, setOverviewData] = useState();

  const cardsDetails = Object.freeze([
    {
      number: 5000,
      text: "Total number of COVID-19 vaccinations given",
    },
    {
      number: 22000,
      text: "Total number of first dose given",
    },
    {
      number: 12000,
      text: "Total number of second dose given",
    },
    {
      number: "-16%",
      text: "Total number of third dose or booster given",
      id: `cases-3-dec`,
      icon: <img src={true ? ArrowDown : ArrowUp} alt="arrow-icon" />,
    },
  ]);

  const loadData = async () => {
    const data = await getOverview();
    if (data) setOverviewData(data);
  };

  useEffect(() => {
    loadData();
  }, []);
  return (
    <PageContainer>
      <MetricsSection cardsDetails={cardsDetails} />
    </PageContainer>
  );
};

export default Cases;
