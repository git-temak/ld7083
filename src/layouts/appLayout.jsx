import React, { useContext } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { Outlet, useLocation, useParams } from "react-router-dom";
import tw, { styled } from "twin.macro";
import {
  DropdownSelect,
  Flex,
  FlexBetween,
  FlexBetweenRes,
  FlexCol,
  FlexContainer,
  Loader,
  Logo,
  NavBar,
  SearchInput,
  TitleText,
  YSpacer,
} from "../components";
import { appContext } from "../contexts";

const AppLayoutWrapper = styled(FlexCol)`
  ${tw`w-full h-[100vh]`}
`;
const HeaderWrapper = styled.header`
  ${tw`w-full`}
`;

const PageContentWrapper = styled.section`
  ${tw``}
`;

const DataUpdateText = styled.p`
  ${tw`text-sm text-textgray`}
`;

const LogoWrapper = styled(FlexBetween)`
  ${tw`p-5`}
`;

const ActionBar = styled(FlexBetweenRes)`
  ${tw`my-4 px-[2rem] 2xl:w-4/5 mx-auto`}
`;

const Utils = styled(Flex)`
  ${tw`gap-x-5`}
`;

const DisclaimerWrapper = styled.div`
  ${tw`bg-[#ECF6FF] mx-7 my-10 p-5`};

  .title {
    ${tw`font-semibold text-[16px]`}
  }

  .body-text {
    ${tw`text-base text-textgray`}
  }
`;

const AppLayout = () => {
  const { loading, lastUpdate } = useContext(appContext);

  // title text options
  const pathTexts = Object.freeze({
    overview: "Epidemic Overview",
    healthcare: "Overview of healthcare",
    vaccinations: "Overview of vaccinations",
    deaths: "Overview of deaths",
    cases: "Overview of cases",
  });

  // get the current path
  const location = useLocation();
  const path = location.pathname.split("/").filter((path) => path)[0];

  const title = pathTexts[path];
  return (
    <>
      {loading && <Loader />}
      <AppLayoutWrapper>
        {/* The header */}
        <HeaderWrapper>
          <LogoWrapper>
            <Logo />
            <DataUpdateText>Last Updated: {lastUpdate}.</DataUpdateText>
          </LogoWrapper>
          <NavBar />
        </HeaderWrapper>

        {/* Page to be rendered */}
        <PageContentWrapper>
          <ActionBar>
            <TitleText>{title} within the UK</TitleText>
            <Utils>
              <FlexContainer className="gap-x-1">
                <DropdownSelect
                  label="Disease"
                  options={[{ label: "COVID19", value: "COVID19" }]}
                />
                <FaInfoCircle size={15} color="#134C80" />
              </FlexContainer>

              <DropdownSelect
                label="Location"
                options={[{ label: "All of UK", value: "all" }]}
              />
              {/* <SearchInput /> */}
            </Utils>
          </ActionBar>
          <Outlet />
        </PageContentWrapper>
        <DisclaimerWrapper>
          <p className="title">Disclaimer:</p>
          <p className="body-text">
            All data is retrieved directly from{" "}
            <a href="https://gov.uk">gov.co.uk </a>and nothing is stored
            directly on this site.
          </p>
          <YSpacer margin="1rem" />
          <p className="title">About Data:</p>
          <p className="body-text">
            Data for the United Kingdom comes from the Department for Health and
            Social Care, Public Health England, Public Health Scotland,
          </p>
        </DisclaimerWrapper>
      </AppLayoutWrapper>
    </>
  );
};

export default AppLayout;
