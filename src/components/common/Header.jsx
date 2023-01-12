import React, { useContext } from "react";
import tw, { styled } from "twin.macro";
import { FlexBetween, Logo, NavBar, HeaderWrapper } from "../";
import { appContext } from "../../contexts";

const DataUpdateText = styled.p`
  ${tw`text-sm text-textgray`}
`;

const LogoWrapper = styled(FlexBetween)`
  ${tw`p-5`}
`;
const Header = ({ updateTime = true }) => {
  const { loading, lastUpdate } = useContext(appContext);
  return (
    <HeaderWrapper>
      <LogoWrapper>
        <Logo />
        {updateTime && (
          <DataUpdateText>Last Updated: {lastUpdate}</DataUpdateText>
        )}
      </LogoWrapper>
    </HeaderWrapper>
  );
};

export default Header;
