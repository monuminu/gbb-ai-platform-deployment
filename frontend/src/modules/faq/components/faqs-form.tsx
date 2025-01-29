import { m } from 'framer-motion';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

export default function FaqsForm() {
  return (
    <Stack component={MotionViewport} spacing={4}>
      <m.div variants={varFade().inUp}>
        <Typography variant="h4">{`Haven't answered your question?`}</Typography>
      </m.div>

      <m.div variants={varFade().inUp}>
        <TextField fullWidth label="Enter your question here" multiline rows={4} />
      </m.div>

      <m.div variants={varFade().inUp}>
        <Button size="medium" variant="contained">
          Submit
        </Button>
      </m.div>
    </Stack>
  );
}
