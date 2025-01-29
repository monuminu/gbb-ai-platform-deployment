import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Portal from '@mui/material/Portal';
import Backdrop from '@mui/material/Backdrop';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';

import { Message } from 'src/types/chat';

import DataReportSourceItem from './data-report-source-item';

// ----------------------------------------------------------------------

const ZINDEX = 1199;

const POSITION = 96;

type Props = {
  insightMessage: Message | undefined;
  sourceMessages: Message[];
  onCloseCompose: VoidFunction;
};

export default function DataReport({ insightMessage, sourceMessages, onCloseCompose }: Props) {
  const smUp = useResponsive('up', 'sm');
  const theme = useTheme();

  // console.log(insightMessage);
  // console.log(sourceMessages);

  const fullScreen = useBoolean(true);

  return (
    <Portal>
      <Backdrop open sx={{ zIndex: ZINDEX }} />

      <Paper
        sx={{
          right: 0,
          bottom: 0,
          borderRadius: 1,
          display: 'flex',
          position: 'fixed',
          zIndex: ZINDEX + 1,
          m: `${POSITION}px`,
          overflow: 'hidden',
          flexDirection: 'column',
          boxShadow: (_theme) => _theme.customShadows.dropdown,
          ...(fullScreen.value && {
            m: 0,
            right: POSITION / 2,
            bottom: POSITION / 2,
            width: `calc(100% - ${POSITION}px)`,
            height: `calc(100% - ${POSITION}px)`,
          }),
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            bgcolor: 'background.neutral',
            borderBottom: `dashed 1px ${theme.palette.divider}`,
            p: (_theme) => _theme.spacing(1.5, 1, 1.5, 2),
          }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Data Analysis Report
          </Typography>

          <IconButton onClick={onCloseCompose}>
            <Iconify icon="mingcute:close-line" />
          </IconButton>
        </Stack>

        <Grid container spacing={1} sx={{ height: `calc(100% - ${POSITION + 24}px)` }}>
          <Grid xs={6} md={6} lg={6} sx={{ height: 1 }}>
            <Scrollbar sx={{ pt: 0, height: 1 }}>
              <Stack spacing={0} flexGrow={1} sx={{ p: 2 }}>
                {sourceMessages.map((message) => (
                  <DataReportSourceItem key={message.id} message={message} />
                ))}

                {/* <ContentStyle>
                  <AnalyticsWebsiteVisits
                    title="Website Visits"
                    subheader="(+43%) than last year"
                    chart={{
                      labels: [
                        '01/01/2003',
                        '02/01/2003',
                        '03/01/2003',
                        '04/01/2003',
                        '05/01/2003',
                        '06/01/2003',
                        '07/01/2003',
                        '08/01/2003',
                        '09/01/2003',
                        '10/01/2003',
                        '11/01/2003',
                      ],
                      series: [
                        {
                          name: 'Team A',
                          type: 'column',
                          fill: 'solid',
                          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                        },
                        {
                          name: 'Team B',
                          type: 'area',
                          fill: 'gradient',
                          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                        },
                        {
                          name: 'Team C',
                          type: 'line',
                          fill: 'solid',
                          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                        },
                      ],
                    }}
                  />
                </ContentStyle>

                <ContentStyle>
                  <AnalyticsWebsiteVisits
                    title="Website Visits"
                    subheader="(+43%) than last year"
                    chart={{
                      labels: [
                        '01/01/2003',
                        '02/01/2003',
                        '03/01/2003',
                        '04/01/2003',
                        '05/01/2003',
                        '06/01/2003',
                        '07/01/2003',
                        '08/01/2003',
                        '09/01/2003',
                        '10/01/2003',
                        '11/01/2003',
                      ],
                      series: [
                        {
                          name: 'Team A',
                          type: 'column',
                          fill: 'solid',
                          data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                        },
                        {
                          name: 'Team B',
                          type: 'area',
                          fill: 'gradient',
                          data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                        },
                        {
                          name: 'Team C',
                          type: 'line',
                          fill: 'solid',
                          data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                        },
                      ],
                    }}
                  />
                </ContentStyle> */}
              </Stack>
            </Scrollbar>
          </Grid>

          <Grid xs={6} md={6} lg={6} sx={{ height: 1 }}>
            {insightMessage && (
              <Scrollbar sx={{ pt: 0, height: 1 }}>
                <Box sx={{ p: 3, pr: 5 }}>
                  <Markdown
                    sx={{
                      '& .component-image': { mt: 1.5, borderRadius: 1 },
                      '& code': { wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
                      '& pre, & pre > code': { py: 1, lineHeight: 1.75 },
                      ...(!smUp && {
                        '& pre, & pre > code': { py: 1, lineHeight: 1.5, whiteSpace: 'pre-wrap' },
                      }),
                    }}
                    children={insightMessage.body}
                  />
                </Box>
              </Scrollbar>
            )}
          </Grid>
        </Grid>

        <Stack
          spacing={2}
          flexGrow={1}
          sx={{ p: 2, borderTop: `dashed 1px ${theme.palette.divider}` }}
        >
          <Stack direction="row" alignItems="center" justifyContent="flex-end">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Button
                variant="contained"
                color="inherit"
                endIcon={<Iconify icon="mingcute:download-3-fill" />}
              >
                Download
              </Button>

              <Button
                variant="contained"
                color="primary"
                endIcon={<Iconify icon="iconamoon:send-fill" />}
              >
                Share
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Portal>
  );
}
