import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { bgBlur } from 'src/custom/css';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  data: any;
};

export default function FootballMatchHandler({ data }: Props) {
  const theme = useTheme();

  const localTeam = data['local team'].name;
  const localTeamImage = data['local team'].image;
  const localTeamScore = data['local team'].score;
  const visitorTeam = data['visitor team'].name;
  const visitorTeamImage = data['visitor team'].image;
  const visitorTeamScore = data['visitor team'].score;

  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      // spacing={2}
      sx={{
        ...bgBlur({
          color: theme.palette.grey[600],
          opacity: 0.18,
        }),
        p: 2,
        mt: 0,
        mb: 4,
        mx: 0,
        width: '100%',
        // bgcolor: `${alpha(theme.palette.grey[300], 0.08)}`,
        border: `${alpha(theme.palette.grey[300], 0.12)} 1px solid`,
        borderRadius: 1.5,
        color: 'common.white',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={3}>
        <Stack alignItems="center">
          <Image
            alt={localTeam}
            src={localTeamImage}
            sx={{ width: 56, height: 56, mt: 1, mb: 1 }}
          />
          <Typography variant="subtitle1">{localTeam}</Typography>
        </Stack>
        <Typography variant="h3">{localTeamScore}</Typography>
      </Stack>

      <Iconify
        icon="fad:digital-colon"
        width={60}
        sx={{ opacity: 0.48, verticalAlign: 'center', mx: 1 }}
      />

      <Stack direction="row" alignItems="center" spacing={3}>
        <Typography variant="h3">{visitorTeamScore}</Typography>
        <Stack alignItems="center">
          <Image
            alt={visitorTeam}
            src={visitorTeamImage}
            sx={{ width: 56, height: 56, mt: 1, mb: 1 }}
          />
          <Typography variant="subtitle1">{visitorTeam}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
