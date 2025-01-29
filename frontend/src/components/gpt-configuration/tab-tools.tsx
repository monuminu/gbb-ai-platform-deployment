import { Icon } from '@iconify/react';
import arrowIosForwardFill from '@iconify/icons-eva/arrow-ios-forward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { useBoolean } from 'src/hooks/use-boolean';

import ToolRegistry from './tool-registry';

// ----------------------------------------------------------------------

const CollapseButtonStyle = styled(Button)(({ theme }) => ({
  ...theme.typography.overline,
  height: 30,
  borderRadius: 8,
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  marginLeft: theme.spacing(1),
  marginRight: theme.spacing(2),
  padding: theme.spacing(2.5, 1),
  paddingLeft: theme.spacing(1),
  justifyContent: 'flex-start',
  color: theme.palette.text.secondary,
}));

// ----------------------------------------------------------------------

type Props = {
  selectedTools: string[] | undefined;
  onSelectTools: (tools: string[]) => void;
};

export default function ToolTab({ selectedTools, onSelectTools }: Props) {
  const aoaiConfig = useBoolean(true);

  return (
    <Box sx={{ m: 1.25, mt: -2 }}>
      <CollapseButtonStyle
        disableRipple
        color="inherit"
        onClick={aoaiConfig.onToggle}
        startIcon={
          <Icon
            icon={aoaiConfig.value ? arrowIosDownwardFill : arrowIosForwardFill}
            width={16}
            height={16}
          />
        }
        sx={{ width: '94%', '&:hover': { backgroundColor: 'transparent' } }}
      >
        Function calling
      </CollapseButtonStyle>

      {aoaiConfig.value && (
        <ToolRegistry selectedTools={selectedTools} onSelectTools={onSelectTools} />
      )}
    </Box>
  );
}
