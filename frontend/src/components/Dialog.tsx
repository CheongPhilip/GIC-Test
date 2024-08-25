import { FC } from "react";
import { DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Dialog as MuiDialog } from "@mui/material";

interface DialogProps {
  open: boolean;
  title: string;
  description: string;
  rejectText?: string;
  confirmText?: string;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}

export const Dialog: FC<DialogProps> = ({ open, title, description, rejectText = "Cancel", confirmText = "Confirm", onCancel, onConfirm }) => {
  const onConfirmClick = async () => {
    await onConfirm();
    onCancel();
  };
  const onCancelClick = () => onCancel();

  return (
    <MuiDialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancelClick}>{rejectText}</Button>
        <Button onClick={onConfirmClick} autoFocus>
          {confirmText}
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};
