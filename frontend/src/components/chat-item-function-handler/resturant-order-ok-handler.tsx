import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { fDateTimeYMdHm } from 'src/utils/format-time';

import { bgBlur } from 'src/custom/css';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function ResturantOrderOkHandler({ data }: Props) {
  const theme = useTheme();
  const { title, address, distance, rating, reviews, perCapitaConsumption, image } = data;
  return (
    <Stack
      // direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={3}
      sx={{
        ...bgBlur({
          color: theme.palette.grey[600],
          opacity: 0.18,
        }),
        p: 2,
        mt: 0,
        mb: 3,
        // bgcolor: `${alpha(theme.palette.grey[300], 0.08)}`,
        border: `${alpha(theme.palette.grey[300], 0.12)} 1px solid`,
        borderRadius: 1.5,
        color: 'common.white',
      }}
    >
      <Stack alignItems="center" spacing={1}>
        <Iconify icon="solar:verified-check-bold" width={32} sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mr: 0 }}>
          {/* 预定成功 */}
          Booking done
        </Typography>
      </Stack>

      <Stack
        rowGap={5}
        columnGap={5}
        flexWrap="wrap"
        direction="row"
        alignItems="center"
        sx={{ color: `${theme.palette.grey[300]}`, typography: 'caption' }}
      >
        <Stack direction="row" alignItems="center">
          <Iconify width={16} icon="solar:calendar-date-bold" sx={{ mr: 0.5, flexShrink: 0 }} />
          {/* 2024年1月3日 18:00 */}
          {fDateTimeYMdHm(new Date())}
        </Stack>

        <Stack direction="row" alignItems="center">
          <Iconify
            width={16}
            icon="solar:users-group-rounded-bold"
            sx={{ mr: 0.5, flexShrink: 0 }}
          />
          {/* 4人用餐 */}4 Persons
        </Stack>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={0}
        sx={{ width: 1, px: 1, mt: 1 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Image alt={title} src={image} sx={{ width: 60, height: 60, borderRadius: 0.5 }} />
          <Stack alignItems="flex-start" justifyContent="flex-start" spacing={0} sx={{ pt: 0 }}>
            <Typography variant="body1">{title}</Typography>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 0.75 }}>
              <Rating
                value={rating}
                readOnly
                size="small"
                sx={{ transform: 'scale(0.7)', ml: -1.9, mr: -2 }}
              />
              <Typography variant="caption" color={`${theme.palette.grey[300]}`}>
                {/* {`${reviews}条评论`} */}
                {`${reviews} Reviews`}
              </Typography>
              <Typography variant="caption" color={`${theme.palette.grey[300]}`}>
                {/* {`¥${perCapitaConsumption}/人`} */}
                {`¥${perCapitaConsumption}/Person`}
              </Typography>
            </Stack>
            <Typography variant="caption" color={`${theme.palette.grey[400]}`} sx={{ mt: -0.25 }}>
              {address}
            </Typography>
          </Stack>
        </Stack>
        <Typography variant="body2" sx={{ mt: 0.25 }}>
          {distance}
        </Typography>
      </Stack>
    </Stack>
  );
}
