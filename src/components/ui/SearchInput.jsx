import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import tw, { styled } from "twin.macro";

const InputContainer = styled.div`
  ${tw`relative`}
`;

const Input = styled.input`
  ${tw`w-auto outline-none pl-8 pr-2 text-base text-textgray rounded-[8px]`}
  border: 0.4px solid rgba(0, 0, 0, 0.2);
  height: 35px;
  width: ${(props) => props.width || "140px"};
  + div {
    width: ${(props) => props.width || "150px"};
  }
  ::placeholder {
    font-size: 14px;
    color: #005700;
  }
`;

const SearchInput = ({ availOptions = [], ...props }) => {
  const [showDrop, toggle] = useState();
  return (
    <div className="relative">
      <InputContainer>
        <Input type="search" placeholder="Search" {...props} />
        <FaSearch size="15" className="absolute text-solid top-[10px] left-2" />
      </InputContainer>
    </div>
  );
};

export default SearchInput;
