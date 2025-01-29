import { useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import CustomPopover from 'src/components/custom-popover';
import { KbRegistry } from 'src/components/gpt-configuration';

// ----------------------------------------------------------------------

type Props = {
  searchText: string;
  moveUpper: boolean;
  anchorWidth: number;
  selectedIndex: string;
  openPopover: HTMLElement | null;
  onClosePopover: () => void;
  onSelectIndex: (index: string) => void;
};

export default function ChatMessageInputKbPopover({
  searchText,
  moveUpper,
  anchorWidth,
  openPopover,
  selectedIndex,
  onClosePopover,
  onSelectIndex,
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
        height: 408,
        maxHeight: 500,
        boxShadow: theme.customShadows.z4,
      }}
      hiddenArrow
      disableAutoFocus
      disableEnforceFocus
    >
      <KbRegistry
        selectedIndex={selectedIndex}
        onSelectIndex={onSelectIndex}
        layout="compact"
        searchText={searchText}
      />
    </CustomPopover>
  );
}
