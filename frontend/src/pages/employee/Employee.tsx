import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { ButtonGroup, Grid, IconButton, InputAdornment, styled, Typography } from "@mui/material";
import { IEmployeeDeleteAttributes, IEmployeeGetAttributes } from "@shared/interfaces/IEmployee";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";

import { Table } from "../../components/Table";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import { employeeQueryOptions, employeesQueryOptions } from "../../providers/queries/employee";
import { clearEmployees, setEmployees } from "../../store/slices/employees";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { initialize } from "redux-form";
import { useNavigate } from "@tanstack/react-router";
import { deleteEmployee } from "../../api/employee";
import { Dialog } from "../../components/Dialog";

const StyledContainer = styled("div")({
  width: "100%",
  height: "100%",
});

const StyledSearchContainer = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  "& button": {
    marginLeft: "1rem",
  },
});

export const Employee: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cafe, setCafe] = useState<string>("");
  const [cafeInput, setCafeInput] = useState<string>("");
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployeeGetAttributes>();
  const employees = useAppSelector(({ employees }) => employees);

  const employeesQuery = useSuspenseQuery(employeesQueryOptions(cafe));
  const employeeQuery = useSuspenseQuery(employeeQueryOptions({ id: isEdit ? selectedEmployee!.id : "" }));

  const employeeDeletion = useMutation({
    mutationFn: (input: IEmployeeDeleteAttributes) => deleteEmployee(input),
    onSuccess: async () => {
      await employeesQuery.refetch();
      setDialogOpen(false);
    },
  });
  const [rowData, setRowData] = useState<IEmployeeGetAttributes[]>([]);

  const columnDefs = useMemo((): ColDef<IEmployeeGetAttributes>[] => {
    return [
      { field: "name", filter: "agTextColumnFilter" },
      { field: "email_address", filter: "agTextColumnFilter" },
      { field: "phone_number", filter: "agTextColumnFilter" },
      { field: "cafe", filter: "onDeleteEmployee " },
      {
        field: "days_worked",
        filter: "agNumberColumnFilter",
      },
      {
        cellRenderer: (cell: ICellRendererParams<IEmployeeGetAttributes>) => {
          return (
            <ButtonGroup variant="text">
              <IconButton color="success" onClick={() => onEditClick(cell.data!)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDeleteClick(cell.data!)}>
                <Delete />
              </IconButton>
            </ButtonGroup>
          );
        },
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDeleteDialogClose = () => {
    setDialogOpen(false);
    setSelectedEmployee(undefined);
  };

  const onSendButtonClick = useCallback(() => {
    setCafe(cafeInput);
  }, [cafeInput]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSendButtonClick();
      }
    },
    [onSendButtonClick]
  );

  const onCafeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setCafeInput(event.target.value);
  }, []);

  const onEditClick = (data: IEmployeeGetAttributes) => {
    setIsEdit(true);
    setSelectedEmployee(data);
  };

  const onDeleteClick = (data: IEmployeeGetAttributes) => {
    setSelectedEmployee(data);
    setDialogOpen(!dialogOpen);
  };

  const onDeleteEmployee = async (data: IEmployeeDeleteAttributes) => {
    try {
      await employeeDeletion.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setRowData(employees);
  }, [employees]);

  useEffect(() => {
    dispatch(setEmployees(employeesQuery.data));
    return () => {
      dispatch(clearEmployees());
    };
  }, [employeesQuery.data, dispatch]);

  useEffect(() => {
    if (isEdit && selectedEmployee && !employeeQuery.isFetching) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dispatch(initialize("employeeForm", employeeQuery.data, false) as any);
      navigate({ to: "/employee/info" });
    }
  }, [isEdit, selectedEmployee, dispatch, navigate, employeeQuery.data, employeeQuery.isFetching]);

  return (
    <StyledContainer>
      <Typography fontWeight={600} variant="h6" sx={{ flexGrow: 1 }}>
        Employee List
      </Typography>
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <StyledSearchContainer>
            <TextInput
              placeholder="Search By Cafe"
              value={cafeInput}
              onChange={onCafeChange}
              onKeyDown={onKeyDown}
              onBlur={onSendButtonClick}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <IconButton onClick={onSendButtonClick}>
              <Send />
            </IconButton>
          </StyledSearchContainer>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={() => navigate({ to: "/employee/info" })}>
            Create New Employee
          </Button>
        </Grid>
      </Grid>
      <Table rowData={rowData} columnDefs={columnDefs} pagination={true} paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50]} />
      <Dialog
        open={dialogOpen}
        title="Delete Confirmation"
        description="This action will permanently delete the selected data. Once deleted, the data cannot be recovered. Are you sure you want to proceed?"
        onCancel={onDeleteDialogClose}
        onConfirm={() => onDeleteEmployee({ id: selectedEmployee!.id })}
      />
    </StyledContainer>
  );
};
