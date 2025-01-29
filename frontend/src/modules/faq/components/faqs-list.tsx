import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Accordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';

import { useFetchFaqList } from 'src/api/documentation';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

export default function FaqsList() {
  const { faqList, isLoading, isEmpty } = useFetchFaqList();

  return (
    <div>
      {isLoading && (
        <Stack spacing={3} sx={{ p: 0.25, my: 1 }}>
          {[...Array(8)].map((_, index) => (
            <Skeleton
              key={index}
              variant="rectangular"
              sx={{ width: 0.95, height: 28, borderRadius: 0.75 }}
            />
          ))}
        </Stack>
      )}

      {!isLoading &&
        faqList.map((accordion) => (
          <Accordion key={accordion.id}>
            <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
              <Typography variant="subtitle1">{accordion.question}</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Markdown
                sx={{
                  mt: -2,
                  mb: -1.5,
                  hr: { marginY: 3 },
                  '& p': { fontSize: 15 },
                  '& li': { fontSize: 15 },
                  '& code': { fontSize: 13, borderRadius: 0.5, mx: 0 },
                  // '& pre, & pre > code': { fontSize: 13, px: 0, py: 0.75, my: 1, lineHeight: 2.25 },
                }}
                children={accordion.answer}
              />
            </AccordionDetails>
          </Accordion>
        ))}

      {!isLoading && isEmpty && <EmptyContent filled title="No FAQ" sx={{ py: 8 }} />}
    </div>
  );
}
