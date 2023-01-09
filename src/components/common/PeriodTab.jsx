import React from "react";
import tw, { styled } from "twin.macro";

const PeriodTabWrapper = styled.div`
  ${tw`rounded-full px-3 py-[3px] text-sm cursor-pointer text-sm`};
  border: 0.4px solid rgba(0, 0, 0, 0.4);
  background-color: ${({ active }) => (active ? "#134C80" : "transparent")};
  color: ${({ active }) => (active ? "white" : "#333333")};
`;

const PeriodTab = ({ text = "", handler = () => null, active = false }) => {
  return (
    <PeriodTabWrapper onClick={handler} active={active}>
      <span>{text}</span>
    </PeriodTabWrapper>
  );
};

export default PeriodTab;
