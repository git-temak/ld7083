import React, { useContext } from "react";
import tw, { styled } from "twin.macro";
import { FlexBetween, Logo, NavBar, HeaderWrapper } from "../";
import { appContext } from "../../contexts";
import { LogoWrapper } from "../styledElements";

const DataUpdateText = styled.p`
  ${tw`text-sm text-textgray`}
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
