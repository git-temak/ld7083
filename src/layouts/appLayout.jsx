import React, { useContext, useState } from "react";
import { FaInfoCircle } from "react-icons/fa";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Link, Outlet, useLocation, useParams } from "react-router-dom";
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
  AppLayoutWrapper,
  HeaderWrapper,
} from "../components";
import { appContext } from "../contexts";

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
  ${tw`gap-x-5`};

  // .more-icon:hover + .info-div {
  //   ${tw`absolute block`}
  // }
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

const InfoContainer = styled.div`
  ${tw`border bg-[#1D6FB8] text-white w-[400px] p-5  absolute right-0 top-[2.5rem] rounded-[8px]`}
`;
const AppLayout = () => {
  const { loading, lastUpdate } = useContext(appContext);
  const [showInfo, setShowInfo] = useState(false);

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
            <DataUpdateText>Last Updated: {lastUpdate}</DataUpdateText>
          </LogoWrapper>
          <NavBar />
        </HeaderWrapper>

        {/* Page to be rendered */}
        <PageContentWrapper>
          <ActionBar>
            <TitleText>{title} within the UK</TitleText>
            <Utils>
              <FlexContainer className="gap-x-1 relative">
                <DropdownSelect
                  label="Disease"
                  options={[{ label: "COVID-19", value: "COVID19" }]}
                />
                <FaInfoCircle
                  size={15}
                  color="#134C80"
                  className="more-icon"
                  onMouseOver={() => setShowInfo(true)}
                />
                {showInfo && (
                  <InfoContainer
                    className="info-div"
                    onMouseOver={() => setShowInfo(true)}
                    onMouseOut={() => setShowInfo(false)}
                  >
                    <p className="text-sm">
                      The COVID-19 pandemic, also known as the coronavirus
                      pandemic, is an ongoing global pandemic of coronavirus
                      disease 2019 (COVID-19) caused by severe acute respiratory
                      syndrome coronavirus 2 (SARS-CoV-2).
                      <br />
                      <Link
                        className="font-bold italic flex text-base"
                        to={"/info"}
                      >
                        Learn More <MdKeyboardArrowRight size={20} />{" "}
                      </Link>
                    </p>
                  </InfoContainer>
                )}
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
            <a className="underline" href="https://coronavirus.data.gov.uk/details/developers-guide">gov.uk </a>and no information is stored.
          </p>
          <YSpacer margin="1rem" />
          <p className="title">About Data:</p>
          <p className="body-text">
            Data used in this application comes from the <a className="underline" href="https://coronavirus.data.gov.uk/details/developers-guide">UK Health Security Agency</a>.
          </p>
        </DisclaimerWrapper>
      </AppLayoutWrapper>
    </>
  );
};

export default AppLayout;
