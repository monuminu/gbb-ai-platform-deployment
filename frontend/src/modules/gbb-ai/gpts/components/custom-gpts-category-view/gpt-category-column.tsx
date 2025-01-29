import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Scrollbar from 'src/components/scrollbar';

import { MlAppStruct } from 'src/types/app';

import GptCategoryItem from './gpt-category-item';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  mlApps: MlAppStruct[];
  onDelete: (_id: string) => Promise<void>;
};

export default function GptCategoryColumn({ title, mlApps, onDelete }: Props) {
  return (
    <Paper sx={{ pb: 1.5, borderRadius: 1, bgcolor: 'background.dark' }}>
      <Stack>
        <Typography variant="h6" color="text.secondary" noWrap sx={{ px: 2, mt: 2, mb: 1.25 }}>
          {title}
        </Typography>

        <Scrollbar sx={{ width: 324, maxHeight: 'calc(100vh - 298px)' }}>
          <Stack spacing={2} sx={{ px: 2, pt: 1, pb: 0.5 }}>
            {mlApps.map((app, index) => (
              <GptCategoryItem key={app.id} index={index} mlApp={app} onDelete={onDelete} />
            ))}
          </Stack>
        </Scrollbar>

        {/* <Button
          fullWidth
          size="medium"
          color="inherit"
          startIcon={<Iconify icon={refreshFill} width={18} sx={{ mr: 0 }} />}
          onClick={openAddTask.onToggle}
          sx={{ fontSize: 15, mt: 0.5, mb: 2 }}
        >
          Load more
        </Button> */}
      </Stack>
    </Paper>
  );
}
