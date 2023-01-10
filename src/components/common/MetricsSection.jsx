import React, { useState } from "react";
import tw, { styled } from "twin.macro";
import { FlexContainer } from "../styledElements";
import PeriodTab from "./PeriodTab";
import { DateTime } from "luxon";

const MetricsWrapper = styled.section`
  ${tw`bg-primarygray p-5 px-[2rem]`}
`;

const PeriodTabsContainer = styled(FlexContainer)`
  ${tw`gap-x-3 2xl:w-4/5 mx-auto`}
`;

const CardsContainer = styled.div`
  ${tw`gap-x-3 my-5 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-4 justify-between 2xl:w-4/5 mx-auto`}
`;

const CardWrapper = styled.div`
  ${tw`bg-white rounded-[8px] h-[150px] w-full mx-auto pt-[40px] px-5`};
  border: 0.4px solid rgba(19, 76, 128, 0.4);
  .number {
    ${tw`text-solid font-bold text-3xl`}
  }

  .text {
    ${tw`text-[#555555] text-sm mt-2`}
  }

  ${({ id, number }) => {
    if (!number || number === "N/A") return;
    switch (id) {
      case "overview-3":
        return `
              background: #134C80;
              .text, .number{
                  color: white;
              }
            `;
      case "vaccinations-0":
        return `
              background: #F0F8FF;
              color: white !important;
              border: 2px solid #134C80;
              box-shadow: 4px 4px 0px #134C80;
            `;
      case "cases-3-inc":
        return `
              background: #038A00;
              .text, .number{
                color: white;
            }
            `;
      case "deaths-3-dec":
      case "cases-3-dec":
        return `
              background: ${number > 0 ? "#9F0000" : "#038A00"};
              .text, .number{
                color: white;
            }
            `;
      case "deaths-0":
      case "healthcare-0":
        return `
              background: #134C80;
              .text, .number{
                color: white;
            }
            `;
      default:
    }
  }}
`;

const DataCard = ({
  text,
  number = 0,
  id = "",
  icon,
  symbol = "",
  clickHandler = () => null,
}) => {
  const showCardExtras = !!number && number !== "N/A";
  return (
    <CardWrapper id={id} number={number}>
      <FlexContainer className="gap-x-2">
        <p className="number">
          {number?.toLocaleString() + (showCardExtras ? symbol : "")}
        </p>
        {showCardExtras && icon}
      </FlexContainer>
      <p className="text">{text}</p>
    </CardWrapper>
  );
};

const MetricsSection = ({
  cardsDetails = [],
  clickHandler = () => null,
  showFilters = true,
}) => {
  const [periodTab, setPeriodTab] = useState(0);
  const tabOptions = Object.freeze([
    {
      text: "All Time",
      handler: () => setPeriodTab(0),
      active: periodTab === 0,
    },
    {
      text: "7 days",
      handler: () => setPeriodTab(1),
      active: periodTab === 1,
    },
    {
      text: "1 month",
      handler: () => setPeriodTab(2),
      active: periodTab === 2,
    },
    {
      text: "3 months",
      handler: () => setPeriodTab(3),
      active: periodTab === 3,
    },
    {
      text: "6 months",
      handler: () => setPeriodTab(4),
      active: periodTab === 4,
    },
    {
      text: "1 year",
      handler: () => setPeriodTab(5),
      active: periodTab === 5,
    },
  ]);

  const handleDateRange = (idx) => {
    setPeriodTab(idx);
    let endDate = "";
    switch (idx) {
      case 0:
        endDate = "";
        break;
      case 1:
        endDate = DateTime.now().minus({ weeks: 1 }).toISODate();
        break;
      case 2:
        endDate = DateTime.now().minus({ months: 1 }).toISODate();
        break;
      case 3:
        endDate = DateTime.now().minus({ months: 3 }).toISODate();
        break;
      case 4:
        endDate = DateTime.now().minus({ months: 6 }).toISODate();
        break;
      case 5:
        endDate = DateTime.now().minus({ years: 1 }).toISODate();
        break;
      default:
    }
    clickHandler(endDate);
  };

  return (
    <MetricsWrapper>
      {showFilters && (
        <PeriodTabsContainer>
          {tabOptions.map((period, idx) => (
            <PeriodTab
              key={period.text}
              {...period}
              handler={() => handleDateRange(idx)}
            />
          ))}
        </PeriodTabsContainer>
      )}
      <CardsContainer>
        {cardsDetails.map((card) => (
          <DataCard {...card} key={card.text} />
        ))}
      </CardsContainer>
    </MetricsWrapper>
  );
};

export default MetricsSection;
