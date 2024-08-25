import { FormControl, FormLabel, RadioGroup, RadioGroupProps as MuiRadioGroupProps, FormControlLabel, Radio, styled } from "@mui/material";
import { FC } from "react";

interface RadioButtonsProps extends MuiRadioGroupProps {
  title: string;
  options: {
    value: string | number;
    label: string;
  }[];
}

const StyledContainer = styled("div")({
  width: "100%",
});

export const RadioButtons: FC<RadioButtonsProps> = ({ title, options, onChange, value, ...props }) => {
  return (
    <StyledContainer>
      <FormControl>
        <FormLabel>{title}</FormLabel>
        <RadioGroup row value={value} onChange={onChange} {...props}>
          {options?.map((option) => <FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />)}
        </RadioGroup>
      </FormControl>
    </StyledContainer>
  );
};
