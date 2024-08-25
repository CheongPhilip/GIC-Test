import { FC, useEffect, useMemo, useState, useCallback } from "react";
import { ButtonGroup, Grid, IconButton, InputAdornment, styled, Typography } from "@mui/material";
import { ICafeDeleteAttributes, ICafeGetAttributes } from "@shared/interfaces/ICafe";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { cafesQueryOptions } from "../../providers/queries/cafe";

import { Table } from "../../components/Table";
import { TextInput } from "../../components/TextInput";
import { Button } from "../../components/Button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearCafes, setCafes } from "../../store/slices/cafe";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import { deleteCafe } from "../../api/cafe";
import { ColDef, ICellRendererParams } from "@ag-grid-community/core";
import { useNavigate } from "@tanstack/react-router";
import { initialize } from "redux-form";
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

export const Cafe: FC = () => {
  const dispatch = useAppDispatch();
  const cafes = useAppSelector(({ cafes }) => cafes);
  const navigate = useNavigate();

  const [rowData, setRowData] = useState<ICafeGetAttributes[]>([]);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedCafe, setSelectedCafe] = useState<ICafeDeleteAttributes>({ id: "" });
  const [location, setLocation] = useState<string>("");
  const [locationInput, setLocationInput] = useState<string>("");

  const cafeQuery = useSuspenseQuery(cafesQueryOptions(location));
  const cafeDeletion = useMutation({
    mutationFn: (input: ICafeDeleteAttributes) => deleteCafe(input),
    onSuccess: () => {
      cafeQuery.refetch();
    },
  });

  const columnDefs = useMemo((): ColDef<ICafeGetAttributes>[] => {
    return [
      { field: "name", filter: "agTextColumnFilter" },
      { field: "description" },
      { field: "location", filter: "agTextColumnFilter" },
      { field: "logo" },
      { field: "employees" },
      {
        cellRenderer: (cell: ICellRendererParams<ICafeGetAttributes>) => {
          return (
            <ButtonGroup variant="text">
              <IconButton color="success" onClick={() => onEditClick(cell.data!)}>
                <Edit />
              </IconButton>
              <IconButton color="error" onClick={() => onDeleteClick({ id: cell.data!.id! })}>
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
    setDialogOpen(!dialogOpen);
  };

  const onEditClick = (data: ICafeGetAttributes) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(initialize("cafeForm", data, false) as any);
    navigate({ to: "/cafe/info" });
  };

  const onDeleteClick = (data: ICafeDeleteAttributes) => {
    setSelectedCafe(data);
    setDialogOpen(!dialogOpen);
  };

  const onDeleteCafe = async (data: ICafeDeleteAttributes) => {
    try {
      await cafeDeletion.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  const onLocationChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(event.target.value);
  }, []);

  const onSendButtonClick = useCallback(() => {
    setLocation(locationInput);
  }, [locationInput]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter") {
        onSendButtonClick();
      }
    },
    [onSendButtonClick]
  );

  useEffect(() => {
    setRowData(cafes);
  }, [cafes]);

  useEffect(() => {
    dispatch(setCafes(cafeQuery.data));
    return () => {
      dispatch(clearCafes());
    };
  }, [cafeQuery.data, dispatch]);

  return (
    <StyledContainer>
      <Typography fontWeight={600} variant="h6" sx={{ flexGrow: 1 }}>
        Cafe List
      </Typography>
      <Grid container justifyContent={"space-between"}>
        <Grid item>
          <StyledSearchContainer>
            <TextInput
              placeholder="Search By Location"
              value={locationInput}
              onChange={onLocationChange}
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
          <Button variant="contained" onClick={() => navigate({ to: "/cafe/info" })}>
            Create New Cafe
          </Button>
        </Grid>
      </Grid>
      <Table rowData={rowData} columnDefs={columnDefs} pagination={true} paginationPageSize={10} paginationPageSizeSelector={[10, 25, 50]} />
      <Dialog
        open={dialogOpen}
        title="Delete Confirmation"
        description="This action will permanently delete the selected data. Once deleted, the data cannot be recovered. Are you sure you want to proceed?"
        onCancel={onDeleteDialogClose}
        onConfirm={() => onDeleteCafe(selectedCafe)}
      />
    </StyledContainer>
  );
};
