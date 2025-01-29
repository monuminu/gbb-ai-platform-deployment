import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

import FaqsList from '../faqs-list';
import FaqsForm from '../faqs-form';

// ----------------------------------------------------------------------

export default function FaqsView() {
  const settings = useSettingsContext();
  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        pb: 6,
        pt: { xs: 1, md: 1 },
        position: 'relative',
      }}
    >
      <Typography
        variant="h3"
        sx={{
          my: { xs: 4, md: 4 },
          color: 'primary.main',
          textTransform: 'capitalize',
        }}
      >
        Frequently asked questions
      </Typography>

      <Grid container spacing={{ xs: 3, md: 8 }} disableEqualOverflow>
        <Grid xs={12} md={8}>
          <FaqsList />
        </Grid>
        <Grid xs={12} md={4}>
          <FaqsForm />
        </Grid>
      </Grid>
    </Container>
  );
}
