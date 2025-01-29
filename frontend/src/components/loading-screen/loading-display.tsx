// mui
import { SxProps } from '@mui/system';
import { Box, CircularProgress } from '@mui/material';

// ----------------------------------------------------------------------

interface LoadingProps {
  sx?: SxProps;
  [key: string]: any;
}

const LoadingDisplay = ({ sx, ...otherProps }: LoadingProps) => {
  const styles = {
    px: 5,
    flexGrow: 1,
    width: '100%',
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...sx,
  };

  return (
    <Box sx={styles} {...otherProps}>
      <CircularProgress color="primary" sx={{ width: '100%' }} />
    </Box>
  );
};

export default LoadingDisplay;
