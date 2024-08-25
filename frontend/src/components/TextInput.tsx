import { styled, TextField, TextFieldProps } from "@mui/material";
import { FC } from "react";

const StyledTextInput = styled(TextField)({
  margin: "1rem 0",
  "& .MuiInputBase-root": {
    borderRadius: "20px",
  },
});

export const TextInput: FC<TextFieldProps> = ({ label, size = "small", variant = "outlined", value, onChange, ...props }) => {
  return <StyledTextInput {...props} size={size} label={label} variant={variant} value={value} onChange={onChange} autoComplete="off" />;
};
