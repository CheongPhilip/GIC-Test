import { FC } from "react";
import { Field, InjectedFormProps, reduxForm } from "redux-form";
import { TextInput } from "../../components/TextInput";
import { styled } from "@mui/material";
import { Button } from "../../components/Button";
import { useMutation } from "@tanstack/react-query";
import { ICafeUpdateAttributes } from "@shared/interfaces/ICafe";
import { postCafe, putCafe } from "../../api/cafe";
import { useNavigate } from "@tanstack/react-router";

type FormValues = ICafeUpdateAttributes;
type FormProps = InjectedFormProps<FormValues>;

// Styled components
const StyledFormContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%",
});

const StyledForm = styled("form")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderTextInput = ({ input, label }: { input: any; label: string }) => {
  return <TextInput {...input} label={label} />;
};

const Form: FC<FormProps> = (props) => {
  const navigate = useNavigate();
  const { handleSubmit } = props;

  // Mutation for creating or updating a cafe
  const cafeMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      if (values.id) {
        await putCafe(values);
      } else {
        await postCafe(values);
      }
    },
    onSuccess: () => {
      navigate({ to: "/cafe" });
    },
  });

  const onSubmit = async (values: FormValues) => {
    return await cafeMutation.mutateAsync(values);
  };

  return (
    <StyledFormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Field name="name" component={renderTextInput} label="Cafe Name" />
        <Field name="description" component={renderTextInput} label="Description" />
        <Field name="location" component={renderTextInput} label="Location" />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </StyledForm>
    </StyledFormContainer>
  );
};

const CafeForm = reduxForm<FormValues>({
  form: "cafeForm",
})(Form);

export default CafeForm;
