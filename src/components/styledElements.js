import tw, { styled } from "twin.macro";

export const FlexContainer = styled.div`
  ${tw`flex items-center`}
`;

export const FlexContainerRes = styled.div`
  ${tw`w-full lg:flex items-center space-y-5 lg:space-y-0 lg:gap-x-7`}
`;

export const FlexItemsEnd = styled.div`
  ${tw`flex items-end`}
`;

export const FlexFullCenter = styled(FlexContainer)`
  ${tw`justify-center`}
`;

export const FlexBetween = styled(FlexContainer)`
  ${tw`justify-between`}
`;

export const FlexBetweenRes = styled(FlexContainerRes)`
  ${tw`justify-between`}
`;

export const FlexCol = styled.div`
  ${tw`flex flex-col`}
`;

export const Flex = styled.div`
  ${tw`flex`}
`;

export const FlexRes = styled.div`
  ${tw`w-full lg:flex`}
`;

export const Label = styled.label`
  ${tw`text-[18px] text-solid no-underline`}
`;

export const YSpacer = styled.div`
  ${tw``};
  margin-top: ${({ margin }) => margin || "2em"};
`;

export const XSpacer = styled.div`
  ${tw`inline`};
  margin-left: ${({ margin }) => margin || "2em"};
`;

export const TitleText = styled.p`
  ${tw`text-2xl font-semibold`}
`;

export const PageContainer = styled.div`
  ${tw``}
`;

export const ChartContainer = styled.div`
  ${tw`p-5 rounded-[8px]`};

  > div {
    ${tw`overflow-x-auto`};
  }
`;

export const ChartsContainer = styled.section`
  ${tw`px-7 w-full space-y-7`}
`;

export const ChartWrapper = styled.div`
  ${tw`bg-primarygray h-[520px]`}
`;

export const ChartWrapperFull = styled.div`
  ${tw`bg-primarygray h-[520px] w-full`}
`;

export const ChartWrapperHalf = styled.div`
  ${tw`bg-primarygray h-[520px] w-full lg:w-1/2`}
`;

export const ChartWrapperOneQuarter = styled.div`
  ${tw`bg-primarygray h-[520px] w-full lg:w-1/4`}
`;
