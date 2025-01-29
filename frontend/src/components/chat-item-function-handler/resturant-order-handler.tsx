import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/custom/css';

import Image from 'src/components/image';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function ResturantOrderHandler({ data }: Props) {
  const theme = useTheme();

  return (
    <Stack spacing={2} sx={{ mt: 0, mb: 3 }}>
      {data.map((returant: any, index: number) => {
        const { title, address, distance, rating, reviews, perCapitaConsumption, image } = returant;
        return (
          <Stack
            key={index}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              ...bgBlur({
                color: theme.palette.grey[600],
                opacity: 0.18,
              }),
              p: 2,
              // bgcolor: `${alpha(theme.palette.grey[300], 0.08)}`,
              border: `${alpha(theme.palette.grey[300], 0.12)} 1px solid`,
              borderRadius: 1.5,
              color: 'common.white',
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" sx={{ mr: 0.5, width: 12 }}>
                {index + 1}
              </Typography>
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
                    {`${reviews}条评论`}
                  </Typography>
                  <Typography variant="caption" color={`${theme.palette.grey[300]}`}>
                    {`¥${perCapitaConsumption}/人`}
                  </Typography>
                </Stack>
                <Typography
                  variant="caption"
                  color={`${theme.palette.grey[400]}`}
                  sx={{ mt: -0.25 }}
                >
                  {address}
                </Typography>
              </Stack>
            </Stack>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              {distance}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}
