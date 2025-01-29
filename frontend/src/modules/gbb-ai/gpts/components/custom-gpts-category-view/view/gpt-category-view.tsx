import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import Scrollbar from 'src/components/scrollbar';
// import EmptyContent from 'src/components/empty-content';

import { MlAppStruct } from 'src/types/app';

import GptCategoryColumn from '../gpt-category-column';
import { GptCategorySkeleton } from '../gpt-category-skeleton';

// ----------------------------------------------------------------------

const CATEGORIES = ['Writing', 'Productivity', 'Programming', 'Image', 'Lifestyle', 'Education'];

// ----------------------------------------------------------------------

type Props = {
  mlApps: MlAppStruct[];
  isLoading: boolean;
  onDelete: (_id: string) => Promise<void>;
};

export default function KanbanView({ mlApps, isLoading, onDelete }: Props) {
  const renderSkeleton = (
    <Stack direction="row" alignItems="flex-start" spacing={3}>
      {[...Array(4)].map((_, index) => (
        <GptCategorySkeleton key={index} index={index} />
      ))}
    </Stack>
  );

  const subCategories = mlApps
    .map((app) => app.category)
    .filter((category) => CATEGORIES.includes(category));

  const dsipayCategories = [...new Set(subCategories)];

  return (
    <Box sx={{ px: '0 !important' }}>
      {isLoading && renderSkeleton}

      {/* {boardEmpty && (
        <EmptyContent filled title="No Data" sx={{ py: 10, maxHeight: { md: 480 } }} />
      )} */}

      <Scrollbar
        sx={{
          // height: 'calc(100vh - 232px)',
          pb: 3,
          // minHeight: { xs: 'calc(100vh - 232px)', md: 'unset' },
        }}
      >
        <Stack
          spacing={3}
          direction="row"
          alignItems="flex-start"
          sx={{ p: 0.25, px: 0, height: 1 }}
        >
          {dsipayCategories.map((category) => (
            <GptCategoryColumn
              key={category}
              title={category}
              mlApps={mlApps.filter((app) => app.category === category)}
              onDelete={onDelete}
            />
          ))}
        </Stack>
      </Scrollbar>
    </Box>
  );
}
