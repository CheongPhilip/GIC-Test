import { FC } from "react";
import { Select as MuiSelect, SelectProps as MuiSelectProps, FormControl, InputLabel, MenuItem, SelectChangeEvent } from "@mui/material";

type SelectProps = MuiSelectProps & {
  title: string;
  value: string;
  options: {
    label: string;
    value: string;
  }[];
  onChange: (event: SelectChangeEvent) => void;
};

export const Select: FC<SelectProps> = ({ title, value = "", options, onChange }) => {
  return (
    <FormControl sx={{ m: 1, minWidth: 220 }} size="small">
      <InputLabel>{title}</InputLabel>
      <MuiSelect value={value} label={title} onChange={onChange}>
        <MenuItem value={""}>
          <em>None</em>
        </MenuItem>
        {options?.map((option) => {
          return (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          );
        })}
      </MuiSelect>
    </FormControl>
  );
};
