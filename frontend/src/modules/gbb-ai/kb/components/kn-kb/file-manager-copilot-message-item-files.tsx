import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import FileThumbnail from 'src/components/file-thumbnail';

// ----------------------------------------------------------------------

type Props = {
  data: { label: string; url: string }[];
};

export default function ChatMessageItemFilesHandler({ data }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={1.5} sx={{ mt: 0, mb: 2 }}>
      {data.map((file: any, index: number) => {
        const { label, url } = file;
        return (
          <Stack
            key={index}
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{
              p: 1,
              px: 1.25,
              border: `${alpha(theme.palette.divider, 0.18)} 1px solid`,
              borderRadius: 1,
            }}
          >
            <Typography variant="overline" sx={{ mr: -0.5, minWidth: 12 }}>
              {index + 1}
            </Typography>
            <FileThumbnail file={url} sx={{ width: 20, height: 20 }} />
            <Typography variant="caption">{label}</Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
