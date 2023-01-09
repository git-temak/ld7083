import React from "react";
import BackDrop from "./backdrop.jsx";
import tw, { styled } from "twin.macro";

const LoaderContainer = styled.div`
  ${tw`absolute left-0 w-full h-full overflow-hidden flex justify-center top-0 items-center z-[21]`}
`;

const Spinner = styled.div`
  ${tw`w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin`}
  border-top-color:transparent
`;
const Loader = () => {
  return (
    <>
      <BackDrop show={true} />
      <LoaderContainer>
        <Spinner />
      </LoaderContainer>
    </>
  );
};

export default Loader;
