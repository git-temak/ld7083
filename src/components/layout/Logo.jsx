import React from "react";
import tw, { styled } from "twin.macro";
import { Flex } from "../";
import LogoIcon from "../../assets/icons/logo.svg";

const LogoWrapper = styled(Flex)`
  ${tw`gap-x-1`}
`;

const LogoText = styled.p`
  ${tw`font-bold text-lg`}
`;

const Logo = () => {
  return (
    <LogoWrapper>
      <img src={LogoIcon} alt="logo" />
      <LogoText>MedStats</LogoText>
    </LogoWrapper>
  );
};

export default Logo;
