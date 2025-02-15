import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Theme } from '../../theme';
import styled from 'styled-components';

interface AuthError {
  message: string;
  retry?: boolean;
}

interface AuthErrorDialogProps {
  open: boolean;
  error: AuthError | null;
  onClose: () => void;
  onRetry?: () => Promise<void>;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}): JSX.Element | null => {
  if (!error) return null;

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <CloseIconButton
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon />
        </CloseIconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <StyledDialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button 
            onClick={onRetry} 
            color="primary" 
            variant="contained" 
            autoFocus
          >
            Try Again
          </Button>
        )}
      </StyledDialogActions>
    </StyledDialog>
  );
};

interface StyledProps {
  theme: Theme;
}

const StyledDialog = styled(Dialog)`
  .MuiPaper-root {
    padding: ${({ theme }: StyledProps) => theme.spacing.md};
  }
`;

const CloseIconButton = styled(IconButton)`
  position: absolute;
  right: ${({ theme }: StyledProps) => theme.spacing.sm};
  top: ${({ theme }: StyledProps) => theme.spacing.sm};
`;

const StyledDialogActions = styled(DialogActions)`
  padding: ${({ theme }: StyledProps) => theme.spacing.md} 0 0;
`;

export default AuthErrorDialog;