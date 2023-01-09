import React from "react";
import { NavLink } from "react-router-dom";
import tw, { styled } from "twin.macro";
import appRoutes from "../../core/routes/app.routes";
import { FlexBetween } from "../styledElements";

const NavWrapper = styled.nav`
  ${tw`bg-solid h-[60px] w-full`}

  .active {
    ${tw`border-b-2 border-white font-semibold`}
  }
`;

const NavItems = styled(FlexBetween)`
  ${tw`w-3/5 mx-auto h-full`}
`;

const LinkItem = styled(NavLink)`
  ${tw`h-full flex items-center text-white text-sm`}
`;

const NavBar = () => {
  return (
    <NavWrapper>
      <NavItems>
        {appRoutes.map(({ name, path }) => (
          <LinkItem to={path} activeClassName="active" key={name}>
            {name}
          </LinkItem>
        ))}
      </NavItems>
    </NavWrapper>
  );
};

export default NavBar;
