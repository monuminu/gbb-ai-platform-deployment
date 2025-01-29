import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import CustomPopover from 'src/components/custom-popover';
import { ToolRegistry } from 'src/components/gpt-configuration';

// ----------------------------------------------------------------------

type Props = {
  searchText: string;
  moveUpper: boolean;
  anchorWidth: number;
  selectedTools: string[];
  openPopover: HTMLElement | null;
  onClosePopover: () => void;
  onSelectTools: (tools: string[]) => void;
};

export default function ChatMessageInputToolPopover({
  searchText,
  moveUpper,
  anchorWidth,
  openPopover,
  selectedTools,
  onClosePopover,
  onSelectTools,
}: Props) {
  const theme = useTheme();
  const lgUp = useResponsive('up', 'lg');

  return (
    <CustomPopover
      open={openPopover}
      onClose={onClosePopover}
      arrow="bottom-left"
      style={{ transform: moveUpper ? 'translateY(-4px)' : 'translateY(-4px)' }}
      sx={{
        ml: lgUp ? 0 : 0.9,
        p: 0,
        width: anchorWidth,
        maxWidth: anchorWidth,
        // height: searchText === '' ? 412 : 486,
        height: 406,
        maxHeight: 500,
        boxShadow: theme.customShadows.z4,
      }}
      hiddenArrow
      disableAutoFocus
      disableEnforceFocus
    >
      <ToolRegistry
        selectedTools={selectedTools}
        onSelectTools={onSelectTools}
        layout="compact"
        searchText={searchText}
      />
    </CustomPopover>
  );
}
