import React from "react";
import tw, { styled } from "twin.macro";
import { Flex } from "../styledElements";

const SelectWrapper = styled(Flex)`
  ${tw`gap-x-2 items-center`};

  label {
    ${tw`text-sm`}
  }
`;

const DataSelect = styled.select`
  ${tw`h-[35px] w-[160px] text-sm border rounded-[8px] outline-none pl-2`};
  border: 0.4px solid rgba(0, 0, 0, 0.2);
`;

const DropdownSelect = ({
  options = [],
  label = "",
  name = "",
  defaultValue = "",
  changeHandler = () => null,
}) => {
  return (
    <SelectWrapper>
      <label htmlFor={name}>{label}</label>
      <DataSelect name={name} value={defaultValue} onChange={changeHandler}>
        {options.map(({ label, value }) => (
          <option value={value} key={value}>
            {label}
          </option>
        ))}
      </DataSelect>
    </SelectWrapper>
  );
};

export default DropdownSelect;
