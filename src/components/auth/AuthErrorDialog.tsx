import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface AuthErrorDialogProps {
  open: boolean;
  error: {
    message: string;
    retry?: boolean;
  } | null;
  onClose: () => void;
  onRetry?: () => void;
}

const AuthErrorDialog: React.FC<AuthErrorDialogProps> = ({
  open,
  error,
  onClose,
  onRetry
}) => {
  if (!error) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="auth-error-dialog-title"
    >
      <DialogTitle id="auth-error-dialog-title">
        Authentication Error
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText>{error.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
        {error.retry && onRetry && (
          <Button onClick={onRetry} color="primary" variant="contained" autoFocus>
            Try Again
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AuthErrorDialog;