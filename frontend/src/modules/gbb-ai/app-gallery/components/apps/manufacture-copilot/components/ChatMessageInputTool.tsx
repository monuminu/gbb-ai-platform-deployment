import closeFill from '@iconify/icons-eva/close-fill';

// mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { alpha, useTheme } from '@mui/material/styles';

// project import
import { useFetchTools } from 'src/api/tool';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  selectedTools: string[] | undefined;
  onOpenToolPopover?: () => void;
};

export default function ChatMessageInputTool({ selectedTools, onOpenToolPopover }: Props) {
  const theme = useTheme();

  const { tools, toolsLoading, toolsRefetching } = useFetchTools();

  const selectedToolSet = tools.filter((tool) => selectedTools?.includes(tool.id));

  return (
    <>
      {(!selectedTools || selectedTools.length === 0) && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          onClick={onOpenToolPopover}
          sx={{
            p: 0.5,
            borderRadius: 2,
            cursor: 'pointer',
            background: `${alpha(theme.palette.divider, 0.22)}`,
          }}
        >
          <Avatar
            alt="placeholder"
            src="/assets/icons/navbar/ic_tool.svg"
            sx={{ width: 20, height: 20 }}
          />
          <Typography sx={{ fontSize: '13px', mr: 0.75 }}>No Tool</Typography>
        </Stack>
      )}
      {(toolsLoading || toolsRefetching) &&
        selectedTools &&
        [...Array(selectedTools.length)].map((_, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ p: 0.5, borderRadius: 2, background: `${alpha(theme.palette.divider, 0.22)}` }}
          >
            <Avatar
              alt="placeholder"
              src="/assets/icons/navbar/ic_tool.svg"
              sx={{ width: 20, height: 20 }}
            />
            <Skeleton
              variant="rectangular"
              width={60}
              height={10}
              sx={{ borderRadius: 1, mr: 0.75 }}
            />
          </Stack>
        ))}

      {!toolsLoading &&
        selectedToolSet &&
        selectedToolSet.length > 0 &&
        selectedToolSet.map((tool, index) => (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={onOpenToolPopover}
            sx={{
              p: 0.5,
              maxWidth: 200,
              borderRadius: 2,
              cursor: 'pointer',
              background: `${alpha(theme.palette.divider, 0.14)}`,
              // border: `${alpha(theme.palette.divider, 0.18)} 1px solid`,
            }}
          >
            <Avatar alt={tool.name} src={tool.cover} sx={{ width: 20, height: 20 }} />
            <Box
              sx={{
                width: '100%',
                fontSize: '12px',
                overflow: 'auto',
                textTransform: 'none',
                whiteSpace: 'noWrap',
                justifyContent: 'flex-start',
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              <Typography sx={{ fontSize: '13px' }}>{tool.name || 'No Tool'}</Typography>
            </Box>

            <IconButton size="small" sx={{ p: 0.25 }} onClick={() => {}}>
              <Iconify icon={closeFill} width={16} />
            </IconButton>
          </Stack>
        ))}
    </>
  );
}
