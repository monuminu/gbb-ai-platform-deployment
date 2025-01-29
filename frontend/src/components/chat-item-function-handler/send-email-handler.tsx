import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

// import { fDateTimeYMdHm } from 'src/utils/format-time';

import { bgBlur } from 'src/custom/css';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function SendEmailHandler({ data }: Props) {
  const theme = useTheme();

  // const now = new Date();

  return (
    <Stack spacing={1.5} sx={{ mt: 2, mb: 2 }}>
      {data.map((reply: any, index: number) => {
        const { name, date } = reply;
        return (
          <Stack
            key={index}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              ...bgBlur({
                color: theme.palette.grey[500],
                opacity: 0.1,
              }),
              p: 2,
              // bgcolor: `${alpha(theme.palette.grey[300], 0.08)}`,
              border: `${alpha(theme.palette.grey[500], 0.12)} 1px solid`,
              borderRadius: 1,
              // color: 'common.white',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ mr: 0.25, width: 12 }}>
                {index + 1}
              </Typography>
              <Image
                alt={name}
                src={`/assets/avatars/avatar_${index + 3}.jpg`}
                sx={{ width: 48, height: 48, borderRadius: 0.75 }}
              />
              <Stack
                alignItems="flex-start"
                justifyContent="flex-start"
                spacing={1}
                sx={{ ml: 0.5 }}
              >
                <Typography variant="subtitle1">{name}</Typography>

                <Stack
                  rowGap={5}
                  columnGap={5}
                  flexWrap="wrap"
                  direction="row"
                  alignItems="center"
                  sx={{ color: 'text.secondary', typography: 'caption' }}
                >
                  <Stack direction="row" alignItems="center">
                    <Iconify
                      width={16}
                      icon="solar:calendar-date-bold"
                      sx={{ mr: 0.5, flexShrink: 0 }}
                    />
                    {date}
                    {/* {fDateTimeYMdHm(new Date(now.setHours(now.getHours() + 1)))} */}
                  </Stack>

                  <Stack direction="row" alignItems="center">
                    <Iconify
                      width={16}
                      icon="solar:users-group-rounded-bold"
                      sx={{ mr: 0.5, flexShrink: 0 }}
                    />
                    门店经理
                  </Stack>
                </Stack>
              </Stack>
            </Stack>
            <Iconify icon="solar:verified-check-bold" width={24} sx={{ color: 'success.main' }} />
          </Stack>
        );
      })}
    </Stack>
  );
}
