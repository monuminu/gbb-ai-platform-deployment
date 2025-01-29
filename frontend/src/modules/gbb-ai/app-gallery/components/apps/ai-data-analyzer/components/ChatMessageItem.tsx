import { Icon } from '@iconify/react';
import thumbUp from '@iconify/icons-mdi/thumb-up';
import { formatDistanceToNowStrict } from 'date-fns';
import thumbDown from '@iconify/icons-mdi/thumb-down';
import { useState, useEffect, useCallback } from 'react';
import refreshFill from '@iconify/icons-eva/refresh-fill';
import linkFill from '@iconify/icons-eva/external-link-fill';
import functionFilled from '@iconify/icons-tabler/function-filled';

import Dialog from '@mui/material/Dialog';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import ButtonBase from '@mui/material/ButtonBase';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { alpha, styled, useTheme } from '@mui/material/styles';
import { Box, Stack, Button, Divider, IconButton, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import isJsonString, { checkChartAvailability } from 'src/utils/json-string';

import { ColorType } from 'src/custom/palette';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { Message, Conversation } from 'src/types/chat';

import QueryInput from './demo/query-input';
import DataCodeEditor from './data-code-editor';
import DataVisualizationHandler from './data-visualization-handler';
import ChatMessageItemFuncHandler from './ChatMessageItemFuncHandler';

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

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const processUrl = (url: string) => {
  let tmpUrl = url;
  if (url.startsWith('<')) tmpUrl = tmpUrl.slice(1);
  if (url.endsWith('>')) tmpUrl = tmpUrl.slice(0, -1);
  return tmpUrl;
};

// ----------------------------------------------------------------------

type ChatMessageItemProps = {
  message: Message;
  conversation: Conversation;
  onOpenLightbox: (value: string) => void;
  selected?: boolean;
  onSelect?: VoidFunction;
  onSendQuery: (messageId: string, query: string) => void;
  onOpenReport?: (msgId: string) => void;
};

export default function ChatMessageItem({
  message,
  conversation,
  onOpenLightbox,
  selected,
  onSelect,
  onSendQuery,
  onOpenReport,
}: ChatMessageItemProps) {
  const theme = useTheme();

  const expand = useBoolean();
  const checkbox = useBoolean();

  const popover = usePopover();
  const smUp = useResponsive('up', 'sm');

  // console.log(message.mode);

  const [seriesType, setSeriesType] = useState('Line');
  const [query, setQuery] = useState(message.query || '');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const elapsedTime =
    endTime && startTime && endTime > startTime ? Math.floor((endTime - startTime) / 1000) : null;

  const isJsonStr = isJsonString(message.body);
  const bodyItems = isJsonStr ? JSON.parse(message.body) : null;

  const [userReaction, setUserReaction] = useState('');

  const sender = conversation.participants.find(
    (participant) => participant.id === message.senderId
  );
  const senderDetails =
    message.senderId === 'user'
      ? { type: 'me' }
      : { avatar: sender?.avatarUrl, name: sender?.name };

  const isMe = senderDetails.type === 'me';
  const isImage = message.contentType === 'image';
  const chartIncluded =
    !!message.function_calls &&
    message.function_calls.length > 0 &&
    !!message.function_calls[0].results &&
    (message.function_calls[0].funcName.includes('sales') ||
      message.function_calls[0].funcName.includes('stock'));

  const matchVid = message.body ? message.body.match(/\/(.*\.mp4)/) : null;
  const videoUrl = matchVid ? `/${matchVid[1]}` : '';

  // const matchImg = message.body.match(/\((https.*)\)/);
  const matchImg = message.body ? message.body.match(regex) : null;
  const imageUrl = matchImg ? matchImg[0] : '';

  const timeDistanceToNow = formatDistanceToNowStrict(new Date(message.createdAt), {
    addSuffix: true,
  });
  const isSystemMsg =
    message &&
    message.body &&
    (message.body.startsWith('(SYS)Working') || message.body.startsWith('(SYS)function'));

  useEffect(() => {
    if (message.status) {
      if (message.status === 'running') {
        setStartTime(Date.now());
      } else {
        setEndTime(Date.now());
      }
    }
  }, [message.status]);

  const handleSetQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    },
    [setQuery]
  );

  const handleUpdateReaction = (reaction: string) => {
    // if (message.log_timestamp !== undefined) {
    //   let feedbackValue = 0;
    //   if (reaction === 'Yes') {
    //     feedbackValue = 1;
    //   } else if (reaction === 'No') {
    //     feedbackValue = -1;
    //   }
    // }
    setUserReaction((prev) => (reaction === prev ? '' : reaction));
  };

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
        <Box
          sx={{ px: 3, py: 1 }}
          onClick={() => {
            if (imageUrl.length > 0) onOpenLightbox(imageUrl);
          }}
        >
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

  const handleOpenReport = useCallback(() => {
    if (onOpenReport) onOpenReport(message.id);
  }, [message.id, onOpenReport]);

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

      return (
        <>
          {handleText(msg)}
          {!isMe && <ChatMessageItemFuncHandler function_calls={message.function_calls || []} />}
          {handleFeedbackComp()}
        </>
      );
    } catch (e) {
      return (
        <>
          {msg ? <Box sx={{ typography: 'body2' }}>{msg}</Box> : handleText('Nothing to display')}
          {msg && handleFeedbackComp()}
        </>
      );
    }
  };
  // console.log(message);

  const handleFeedbackComp = () =>
    message &&
    // message.body &&
    // !isMe &&
    !isSystemMsg && (
      <>
        <Divider sx={{ borderStyle: 'dashed', mb: 1, mt: 0 }} />

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ mt: -0.4, mb: 0.5, maxWidth: '100%', pl: 1.75, pr: 1 }}
        >
          {bodyItems && bodyItems.code && (
            <Button
              onClick={expand.onTrue}
              variant="soft"
              color="success"
              size="medium"
              startIcon={<Iconify icon="tabler:code" sx={{ height: 14, ml: 0, mr: -0.5 }} />}
              sx={{
                ml: -0.75,
                mt: 0.15,
                px: 1.25,
                height: 24,
                fontSize: '12px',
                fontWeight: 400,
                width: 124,
                maxWidth: 136,
                overflow: 'hidden',
                textTransform: 'none',
                textOverflow: 'ellipsis',
                whiteSpace: 'noWrap',
                borderRadius: 0.5,
                justifyContent: 'flex-start',
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
                '&::-webkit-scrollbar': {
                  // Hide scrollbar for Chrome, Safari and Opera
                  display: 'none',
                },
              }}
            >
              Code
            </Button>
          )}

          {message.mode !== 'insight' && elapsedTime && (
            <Typography variant="caption" sx={{ fontWeight: 400, minWidth: 184 }}>
              Elapsed time: {elapsedTime} s
            </Typography>
          )}

          {message.sources?.length > 0 && (
            <>
              <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 64 }}>
                Sources ({message.sources.length}):
              </Typography>

              <Scrollbar sx={{ flexGrow: 1, maxWidth: '99%' }}>
                <Stack display="flex" spacing={1} direction="row">
                  {message.sources.map((item, index) => (
                    <Box key={index}>
                      <Button
                        href={processUrl(item.url)}
                        target="_blank"
                        variant="soft"
                        color="info"
                        size="medium"
                        startIcon={
                          <Iconify
                            icon={
                              message.mode !== 'insight'
                                ? linkFill
                                : 'ant-design:bar-chart-outlined'
                            }
                            sx={{ height: 14, ml: -0.25, mr: -0.75 }}
                          />
                        }
                        sx={{
                          px: 1.25,
                          height: 24,
                          fontSize: '12px',
                          fontWeight: 400,
                          maxWidth: 140,
                          overflow: 'auto',
                          textTransform: 'none',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'noWrap',
                          borderRadius: 0.5,
                          justifyContent: 'flex-start',
                          scrollbarWidth: 'none', // Hide scrollbar for Firefox
                          '&::-webkit-scrollbar': {
                            // Hide scrollbar for Chrome, Safari and Opera
                            display: 'none',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Scrollbar>

              <Divider orientation="vertical" flexItem sx={{ borderStyle: 'solid' }} />
            </>
          )}

          {message.function_calls && message.function_calls.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, minWidth: 80, color: 'text.secondary' }}
              >
                Function calls ({message.function_calls.length}):
              </Typography>

              <Scrollbar sx={{ flexGrow: 1, maxWidth: '99%' }}>
                <Stack display="flex" spacing={1} direction="row">
                  {message.function_calls.map((item, index) => (
                    <Box key={index}>
                      <Button
                        variant="soft"
                        color="warning"
                        size="medium"
                        startIcon={<Iconify icon={functionFilled} sx={{ height: 14, mx: -0.5 }} />}
                        sx={{
                          px: 1.25,
                          height: 24,
                          fontSize: '12px',
                          fontWeight: 400,
                          maxWidth: 180,
                          overflow: 'auto',
                          textTransform: 'none',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'noWrap',
                          borderRadius: 0.5,
                          justifyContent: 'flex-start',
                          scrollbarWidth: 'none', // Hide scrollbar for Firefox
                          '&::-webkit-scrollbar': {
                            // Hide scrollbar for Chrome, Safari and Opera
                            display: 'none',
                          },
                        }}
                      >
                        {item.funcName}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Scrollbar>

              <Divider orientation="vertical" flexItem sx={{ borderStyle: 'solid' }} />
            </>
          )}

          {(!message.sources || message.sources.length === 0) &&
            (!message.function_calls || message.function_calls.length === 0) && (
              <Box sx={{ width: '100%' }} />
            )}

          <Stack direction="row">
            {['Yes', 'No'].map((content: string) => (
              <IconButton
                key={content}
                color={getColor(content, userReaction)}
                onClick={() => handleUpdateReaction(content)}
              >
                <Icon icon={content === 'Yes' ? thumbUp : thumbDown} width={12} height={12} />
              </IconButton>
            ))}
          </Stack>
        </Stack>
      </>
    );

  const renderIcon = (
    <Checkbox
      size="medium"
      checked={selected}
      onClick={onSelect}
      icon={<Iconify icon="eva:radio-button-off-fill" />}
      checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
      sx={{ p: 0.25 }}
    />
  );
  // checkbox.value || selected ? (
  //   <Checkbox
  //     size="medium"
  //     checked={selected}
  //     onClick={onSelect}
  //     icon={<Iconify icon="eva:radio-button-off-fill" />}
  //     checkedIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
  //     sx={{ p: 0.25 }}
  //   />
  // ) : (
  //   <Box
  //     component="img"
  //     src="/assets/icons/soft/ic-da.svg"
  //     sx={{ width: 24, height: 24, color: 'primary' }}
  //   />
  // );

  return (
    <RootStyle>
      <Box sx={{ width: '100%', display: 'flex', ...(isMe && { ml: 'auto' }) }}>
        <Stack sx={{ width: '100%' }}>
          <InfoStyle variant="caption">
            {/* <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}> */}
            {timeDistanceToNow.startsWith('0 sec') ? 'Just now' : timeDistanceToNow}
          </InfoStyle>

          <ContentStyle
            sx={{
              ...(isImage && { p: 1 }),
              ...(!isMe && message.body && !isSystemMsg && { pt: 0.75 }),
              ...(chartIncluded && { pt: 0 }),
            }}
          >
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
                <Box onMouseEnter={checkbox.onTrue} onMouseLeave={checkbox.onFalse}>
                  {renderIcon}
                </Box>

                <QueryInput
                  disabled={message.status === 'running'}
                  sx={{ width: '100%' }}
                  placeholder="Query"
                  value={query || ''}
                  onChange={handleSetQuery}
                  onKeyUp={() => {}}
                />
              </Stack>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Tooltip title="Re-run the query">
                  <span>
                    <IconButton
                      disabled={message.status === 'running'}
                      size="medium"
                      onClick={() => onSendQuery(message.id, query)}
                      sx={{ p: 0.75 }}
                    >
                      <Iconify icon={refreshFill} width={16} />
                    </IconButton>
                  </span>
                </Tooltip>
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
                      sx={{ ml: 0.5 }}
                      icon={
                        popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'
                      }
                    />
                  </ButtonBase>
                )}
                {message.mode === 'insight' && (
                  <Button
                    size="small"
                    color="inherit"
                    variant="soft"
                    onClick={handleOpenReport}
                    startIcon={
                      <Iconify
                        icon="bxs:report"
                        sx={{ height: 16, ml: -0.25, mr: -0.5, color: 'text.primary' }}
                      />
                    }
                    sx={{ height: 30, py: 0.15 }}
                  >
                    Report
                  </Button>
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

      {bodyItems && bodyItems.code && (
        <Dialog fullWidth maxWidth="md" open={expand.value} onClose={expand.onFalse}>
          <DialogTitle sx={{ p: (_theme) => _theme.spacing(1.75, 2.5, 0.75, 2.5) }}>
            Code
          </DialogTitle>

          <DialogContent dividers sx={{ px: 2.5, pt: 1, pb: 0, mb: -3.75, border: 'none' }}>
            <DataCodeEditor code={bodyItems.code} updateCode={() => {}} minHeight={240} />
          </DialogContent>

          <DialogActions sx={{ px: 2.5, pb: 2 }}>
            <Button
              size="small"
              color="error"
              variant="contained"
              onClick={expand.onFalse}
              startIcon={<Icon icon={refreshFill} width={16} />}
            >
              Reset
            </Button>
            <Button size="small" variant="contained" onClick={expand.onFalse}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </RootStyle>
  );
}

// ----------------------------------------------------------------------

function getColor(content: string, userReaction: string) {
  let color = 'default';
  if (userReaction !== content) {
    color = 'default';
  } else {
    switch (userReaction) {
      case 'Yes':
        color = 'success';
        break;
      case 'No':
        color = 'error';
        break;
      default:
        color = 'default';
        break;
    }
  }
  return color as ColorType;
}
