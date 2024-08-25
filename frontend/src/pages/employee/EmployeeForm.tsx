import { FC, useMemo, useState } from "react";
import { Field, FormErrors, InjectedFormProps, reduxForm } from "redux-form";
import { TextInput } from "../../components/TextInput";
import { RadioButtons } from "../../components/RadioButtons";
import { capitalize, styled } from "@mui/material";
import { IEmployeeUpdateAttributes } from "@shared/interfaces/IEmployee";
import { useBlocker, useNavigate } from "@tanstack/react-router";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { postEmployee, putEmployee } from "../../api/employee";
import { Button } from "../../components/Button";
import { EGender } from "@shared/constants/enums";
import { Select } from "../../components/Select";
import { cafesQueryOptions } from "../../providers/queries/cafe";
import { employeeValidationSchema } from "@shared/zodSchema/employee";
import { ErrorWrapper } from "../../components/ErrorWrapper";
import { Dialog } from "../../components/Dialog";

type FormValues = IEmployeeUpdateAttributes;
type Props = InjectedFormProps<FormValues>;

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

const StyledSelect = styled(Select)({
  width: "100%",
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderTextInput = ({ input, label, meta: { touched, error } }: any) => {
  return (
    <div>
      <TextInput {...input} label={label} error={touched && error?.length > 0} helperText={touched && error} />
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderRadioGroup = ({ input, label, options, title, meta: { touched, error } }: any) => {
  return (
    <ErrorWrapper error={touched && error?.length > 0} errMsg={error}>
      <RadioButtons {...input} label={label} options={options} title={title} />
    </ErrorWrapper>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderSelect = ({ input, title, label, options, meta: { touched, error } }: any) => {
  return (
    <ErrorWrapper error={touched && error?.length > 0} errMsg={error}>
      <StyledSelect {...input} title={title} label={label} options={options} />
    </ErrorWrapper>
  );
};

const validate = (values: FormValues): FormErrors<FormValues> => {
  let validated;
  if (values.id) {
    validated = employeeValidationSchema.update.safeParse(values);
  } else {
    validated = employeeValidationSchema.create.safeParse(values);
  }
  if (!validated.success) {
    const errors: FormErrors<FormValues> = {};
    validated.error.errors.forEach((error) => {
      if (error.path.length > 0) {
        errors[error.path[0] as keyof FormValues] = error.message;
      }
    });
    return errors;
  }
  return {};
};

const Form: FC<Props> = (props) => {
  const navigate = useNavigate();
  const { handleSubmit, reset } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const cafeQuery = useSuspenseQuery(cafesQueryOptions(""));
  const employeeMutation = useMutation({
    mutationFn: async (values: FormValues) => {
      setIsSubmitting(true);
      if (values.id) {
        await putEmployee(values);
      } else {
        await postEmployee(values);
      }
      setIsSubmitting(false);
    },
    onSuccess: () => {
      reset();
      navigate({ to: "/employee" });
    },
  });

  const genderOptions = useMemo(() => {
    return Object.values(EGender).map((gender) => ({
      label: capitalize(gender),
      value: gender,
    }));
  }, []);

  const cafeOptions = useMemo(() => {
    return cafeQuery.data?.map((cafe) => ({
      label: cafe.name,
      value: cafe.id,
    }));
  }, [cafeQuery.data]);

  const onSubmit = async (values: FormValues) => {
    const response = await employeeMutation.mutateAsync(values);
    return response;
  };

  const {
    proceed,
    reset: resetBlocker,
    status,
  } = useBlocker({
    condition: props.dirty && !isSubmitting,
  });

  const onCancel = async () => {
    resetBlocker();
  };

  const onConfirm = async () => {
    proceed();
  };
  return (
    <StyledFormContainer>
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        <Field name="name" component={renderTextInput} label="Name" type="text" />
        <Field name="email_address" component={renderTextInput} label="Email Address" type="email" />
        <Field name="phone_number" component={renderTextInput} label="Phone Number" type="text" />
        <Field name="gender" component={renderRadioGroup} options={genderOptions} label="Gender" title="Gender" />
        <Field name="cafe_id" title="Assign To" component={renderSelect} type="text" options={cafeOptions} />
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </StyledForm>
      <Dialog
        open={status === "blocked"}
        title="Unsaved Changes Detected"
        description="Are you sure you want to leave? You have unsaved changes that will be lost."
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </StyledFormContainer>
  );
};

// Wrap the form component with reduxForm
const EmployeeForm = reduxForm<FormValues>({ form: "employeeForm", validate })(Form);

export default EmployeeForm;
