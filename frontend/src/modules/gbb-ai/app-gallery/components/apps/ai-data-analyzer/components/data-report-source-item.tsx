import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';
import { Box, Stack, Typography } from '@mui/material';
import { alpha, styled, useTheme } from '@mui/material/styles';

import { useResponsive } from 'src/hooks/use-responsive';

import isJsonString, { checkChartAvailability } from 'src/utils/json-string';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { Message } from 'src/types/chat';

import DataVisualizationHandler from './data-visualization-handler';

// ----------------------------------------------------------------------

const seriesTypes = ['Line', 'Bar', 'Bar (ltr)', 'Pie', 'Donut', 'Stack', 'Stack (ltr)', 'Text'];
const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(0.25, 0, 0.25, 0),
  marginTop: theme.spacing(0.5),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.neutral,
}));

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
};

export default function DataReportSourceItem({ message }: ChatMessageItemProps) {
  const theme = useTheme();

  const popover = usePopover();
  const smUp = useResponsive('up', 'sm');

  const [seriesType, setSeriesType] = useState('Line');
  const query = message.query || '';

  const isJsonStr = isJsonString(message.body);
  const bodyItems = isJsonStr ? JSON.parse(message.body) : null;

  const isImage = message.contentType === 'image';

  const matchVid = message.body ? message.body.match(/\/(.*\.mp4)/) : null;
  const videoUrl = matchVid ? `/${matchVid[1]}` : '';

  const matchImg = message.body ? message.body.match(regex) : null;
  const imageUrl = matchImg ? matchImg[0] : '';

  const isSystemMsg =
    message &&
    message.body &&
    (message.body.startsWith('(SYS)Working') || message.body.startsWith('(SYS)function'));

  const handleText = (msgText: string) => {
    try {
      if (isSystemMsg || !msgText) return null;

      let content = msgText;

      if (bodyItems) {
        if (seriesType !== 'Text' && bodyItems.response_type === 'dict') {
          try {
            if (checkChartAvailability(bodyItems.response))
              return <DataVisualizationHandler data={bodyItems.response} chartType={seriesType} />;
          } catch (error) {
            console.error(error);
          }
        }
        content = JSON.stringify(bodyItems.response, null, 2);
      }

      if (imageUrl.length > 0) {
        if (content.includes('](http') && !content.includes('!['))
          content = content.replace('[', '![');
        if (content.endsWith(')。')) content = content.replace(')。', ')');
      }

      return (
        <Box sx={{ p: 2, py: 1 }}>
          <Markdown
            sx={{
              '& .component-image': { mt: 1.5, borderRadius: 1 },
              '& code': { wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
              '& pre, & pre > code': { py: 1, lineHeight: 1.75 },
              ...(!smUp && {
                '& pre, & pre > code': { py: 1, lineHeight: 1.5, whiteSpace: 'pre-wrap' },
              }),
            }}
            children={content}
          />
        </Box>
      );
    } catch (error) {
      return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
    }
  };

  const handleChangeSeriesType = useCallback(
    (newValue: string) => {
      popover.onClose();
      setSeriesType(newValue);
    },
    [popover]
  );

  const handleMessage = (msg: string) => {
    try {
      if (message.status === 'running')
        return (
          <Stack
            spacing={2.5}
            sx={{
              px: 2,
              py: 2.5,
              m: 2,
              borderRadius: 1,
              backgroundColor: `${alpha(theme.palette.background.paper, 0.86)}`,
            }}
          >
            {[100, 70, 55, 40, 30].map((width, index) => (
              <Stack key={index} direction="row" spacing={2} alignItems="center">
                <Skeleton variant="circular" width={16} height={16} />
                <Skeleton
                  variant="rectangular"
                  height={16}
                  width={`${width}%`}
                  sx={{ borderRadius: 1 }}
                />
              </Stack>
            ))}
          </Stack>
        );

      return <>{handleText(msg)}</>;
    } catch (e) {
      return (
        <>
          {msg ? <Box sx={{ typography: 'body2' }}>{msg}</Box> : handleText('Nothing to display')}
        </>
      );
    }
  };
  // console.log(message);

  return (
    <RootStyle>
      <Box sx={{ width: '100%', display: 'flex', ml: 'auto' }}>
        <Stack sx={{ width: '100%' }}>
          <ContentStyle>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.5}
              sx={{
                p: 2,
                py: 1,
                borderBottom: `${alpha(theme.palette.grey[500], 0.22)} 1px dashed`,
              }}
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
                <Typography variant="h6">{query}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                {bodyItems && checkChartAvailability(bodyItems.response) && (
                  <ButtonBase
                    onClick={popover.onOpen}
                    sx={{
                      pl: 1,
                      py: 0.15,
                      pr: 0.5,
                      borderRadius: 0.5,
                      typography: 'subtitle2',
                      bgcolor: alpha(theme.palette.grey[400], 0.24),
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {seriesType}

                    <Iconify
                      width={16}
                      icon={
                        popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                      }
                      sx={{ ml: 0.5 }}
                    />
                  </ButtonBase>
                )}
              </Stack>
            </Stack>

            {!isImage && !videoUrl && <>{handleMessage(message.body)}</>}
          </ContentStyle>
        </Stack>
      </Box>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {seriesTypes.map((type) => (
          <MenuItem
            key={type}
            selected={type === seriesType}
            onClick={() => handleChangeSeriesType(type)}
          >
            {type}
          </MenuItem>
        ))}
      </CustomPopover>
    </RootStyle>
  );
}
