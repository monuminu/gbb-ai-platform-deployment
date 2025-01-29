import { Icon } from '@iconify/react';
import ReactPlayer from 'react-player';
import { formatDistanceToNowStrict } from 'date-fns';
import linkFill from '@iconify/icons-eva/external-link-fill';
import functionFilled from '@iconify/icons-tabler/function-filled';
import textbox16Filled from '@iconify/icons-fluent/textbox-16-filled';
import thinking24Filled from '@iconify/icons-fluent/thinking-24-filled';
import playCircleFilled from '@iconify/icons-ant-design/play-circle-filled';
import checkmarkCircle2fill from '@iconify/icons-eva/checkmark-circle-2-fill';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Paper, Button, Divider } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { getSourceFiles } from 'src/components/rag-source-panel/rag-source-dialog';

import { Message, Participant } from 'src/types/chat';

import ChatMessageItemFuncHandler from './custom-gpt-chat-bench-func-handler';

// ----------------------------------------------------------------------

const imageSuffixes = ['jpg', 'gif', 'png', 'gif', 'bmp', 'svg', 'webp'];
const regex = new RegExp(`https.*\\.(${imageSuffixes.join('|')}).*(?=\\))`, 'i');

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(3),
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 680,
  fontSize: 13,
  padding: theme.spacing(0, 1.5, 0, 1.5),
  marginTop: theme.spacing(0.5),
  borderRadius: 6,
  // boxShadow: `0 0 1px 0 ${alpha(
  //   theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[400],
  //   0.52
  // )}, 0 1px 3px -1px ${alpha(
  //   theme.palette.mode === 'light' ? theme.palette.grey[500] : theme.palette.grey[700],
  //   0.24
  // )}`,
  backgroundColor: theme.palette.background.paper,
}));

const InfoStyle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(0.75),
  color: theme.palette.text.secondary,
}));

const MessageImgStyle = styled('img')(({ theme }) => ({
  width: '100%',
  cursor: 'pointer',
  objectFit: 'cover',
  borderRadius: 6,
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.up('md')]: {
    height: 240,
    minWidth: 296,
  },
}));

const processUrl = (url: string) => {
  let tmpUrl = url;
  if (url.startsWith('<')) tmpUrl = tmpUrl.slice(1);
  if (url.endsWith('>')) tmpUrl = tmpUrl.slice(0, -1);
  return tmpUrl;
};

// ----------------------------------------------------------------------

type Props = {
  message: Message;
  avatarUrl: string;
  participants: Participant[];
  isLastMessage: boolean;
  onOpenLightbox: (value: string) => void;
  onOpenRagSourcePanel: (thoughts: any, selected: string) => void;
};

export default function ChatBenchMessageItem({
  message,
  avatarUrl,
  participants,
  isLastMessage,
  onOpenLightbox,
  onOpenRagSourcePanel,
}: Props) {
  const theme = useTheme();

  const smUp = useResponsive('up', 'sm');

  const settings = useSettingsContext();
  const isStretched = settings.themeStretch;

  const sourceFiles = getSourceFiles(message.thoughts);

  const sender = participants.find((participant) => participant.id === message.senderId);
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

  const handleText = (msgText: string) => {
    try {
      if (isSystemMsg) return null;
      let content = msgText;

      if (imageUrl.length > 0) {
        if (content.includes('](http') && !content.includes('!['))
          content = content.replace('[', '![');
        if (content.endsWith(')。')) content = content.replace(')。', ')');
      }
      return (
        <Box
          onClick={() => {
            if (imageUrl.length > 0) onOpenLightbox(imageUrl);
          }}
        >
          {isMe && (
            <Box sx={{ py: 1, wordBreak: 'break-word', whiteSpace: 'pre-line' }}>{content}</Box>
          )}
          {!isMe && (
            <Markdown
              sx={{
                '& p': { fontSize: 15 },
                '& .component-image': { my: 0, borderRadius: 1 },
                '& a': { wordBreak: 'break-all' },
                '& code': { wordBreak: 'break-word', whiteSpace: 'pre-wrap' },
                '& pre, & pre > code': { py: 1, fontSize: 13, lineHeight: 1.75 },
                ...(!smUp && {
                  '& pre, & pre > code': {
                    fontSize: 13,
                    py: 1,
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                  },
                }),
              }}
              children={content}
            />
          )}
        </Box>
      );
    } catch (error) {
      return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
    }
  };

  const handleVideo = (msgText: string) => {
    try {
      if (isSystemMsg) return null;

      return (
        <>
          <Box>
            <Markdown children={msgText.replace('<eos>', '')} />
          </Box>
          <Box sx={{ py: 1.5 }}>
            <Paper
              sx={{
                pb: 2,
                pt: 2.9,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '5px',
                backgroundColor: `${theme.palette.grey[900]}`,
              }}
            >
              <ReactPlayer
                url={videoUrl}
                width="100%"
                height="100%"
                playIcon={<Icon icon={playCircleFilled} width={36} height={36} />}
                controls
              />
            </Paper>
          </Box>
        </>
      );
    } catch (error) {
      return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
    }
  };

  const handleMessage = (msg: string) => {
    try {
      return (
        <>
          {handleText(msg)}
          {!isMe && <ChatMessageItemFuncHandler function_calls={message.function_calls || []} />}
          {msg && handleFeedbackComp()}
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

  const handleSysMessage = (msg: string) => {
    if (msg.startsWith('(SYS)function')) {
      const functionName = message.body.split(':')[1].trim();
      const status = msg.includes('calling') ? 'running' : 'executed';
      return (
        <Stack>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
            <Iconify
              icon={status === 'running' ? functionFilled : thinking24Filled}
              sx={{ ml: -0.5, height: 24, width: 24, color: `${theme.palette.primary.main}` }}
            />
            <Box>
              {status === 'running' && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ fontSize: 14, py: 1 }}>Calling: </Box>
                  <Markdown
                    sx={{ transform: 'translateY(-1px)' }}
                    children={`\`${functionName}\``}
                  />
                </Stack>
              )}
              {status === 'executed' && (
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ fontSize: 14, py: 1 }}>Keep working ...</Box>
                </Stack>
              )}

              <LinearProgress color="primary" sx={{ mt: 0, mb: 1.5 }} />
            </Box>
          </Stack>
          {status === 'executed' && (
            <>
              <Divider sx={{ mt: 0.5, borderStyle: 'dashed' }} />
              <Stack spacing={0} sx={{ my: 1 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ my: -0.5 }}>
                  <Iconify
                    icon={checkmarkCircle2fill}
                    sx={{
                      ml: -0.05,
                      height: 17,
                      width: 17,
                      transform: 'translateY(1.5px)',
                      color: `${theme.palette.success.main}`,
                    }}
                  />
                  <Markdown
                    sx={{ '& code': { fontSize: 12, borderRadius: 0.5 } }}
                    children={`\`${functionName}\``}
                  />
                  <Box sx={{ fontSize: 13, py: 1, ml: -1.25, transform: 'translateY(0.5px)' }}>
                    executed
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {}}
                    sx={{ ml: -1, transform: 'translateY(1.5px)' }}
                  >
                    <Iconify
                      icon={textbox16Filled}
                      sx={{
                        height: 16,
                        width: 16,
                        color: `${theme.palette.text.secondary}`,
                      }}
                    />
                  </IconButton>
                </Stack>
                {/* <Stack direction="row" alignItems="center" spacing={2} sx={{ my: -0.5 }}>
                  <Iconify
                    icon={checkmarkCircle2fill}
                    sx={{
                      ml: -0.05,
                      height: 17,
                      width: 17,
                      transform: 'translateY(1.5px)',
                      color: `${theme.palette.success.main}`,
                    }}
                  />
                  <Markdown
                    sx={{
                      '& code': {
                        fontSize: 12,
                        borderRadius: 0.5,
                      },
                    }}
                    children={'`' + message.body.split(':')[1].trim() + '`'}
                  />
                  <Box sx={{ fontSize: 13, py: 1, ml: -1.25, transform: 'translateY(0.5px)' }}>
                    executed
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => {}}
                    sx={{
                      ml: -1,
                      transform: 'translateY(1.5px)',
                    }}
                  >
                    <Iconify
                      icon={eyeFill}
                      sx={{
                        height: 16,
                        width: 16,
                      }}
                    />
                  </IconButton>
                </Stack> */}
              </Stack>
            </>
          )}
        </Stack>
      );
    }
    if (msg.startsWith('(SYS)Working on it')) {
      return (
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify
            icon={thinking24Filled}
            sx={{ ml: -0.5, height: 24, width: 24, color: `${theme.palette.primary.main}` }}
          />
          <Box>
            <Box sx={{ fontSize: 14, py: 1 }}>Working on it</Box>
            <LinearProgress color="primary" sx={{ mt: 0, mb: 1.5 }} />
          </Box>
        </Stack>
      );
    }
    return null;
  };

  const handleFeedbackComp = () =>
    message &&
    message.body &&
    !isMe &&
    !isSystemMsg && (
      <>
        {((message.thoughts && message.thoughts.length > 2) ||
          (message.sources && message.sources.length > 0) ||
          (message.function_calls && message.function_calls.length > 0)) && (
          <Divider sx={{ borderStyle: 'dashed', mb: 0.75, mt: 1.5 }} />
        )}

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            pb: 0.75,
            maxWidth: '100%',
            scrollbarWidth: 'none', // Hide scrollbar for Firefox
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          {message.thoughts && message.thoughts.length > 2 && (
            <>
              <Button
                sx={{
                  px: 0,
                  py: 0,
                  width: 72,
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
                onClick={() => onOpenRagSourcePanel(message.thoughts, 'All')}
              >
                Sources ({sourceFiles.length})
              </Button>

              <Scrollbar sx={{ flexGrow: 1, maxWidth: 1 }}>
                <Stack display="flex" spacing={1} direction="row">
                  {sourceFiles.length > 0 &&
                    sourceFiles.map((sourceFile: any, index) => (
                      <Box key={index}>
                        <Button
                          variant="soft"
                          color="info"
                          size="medium"
                          startIcon={<Iconify icon="codicon:book" sx={{ height: 14, mx: -0.5 }} />}
                          sx={{
                            pl: 1.25,
                            pr: 0.75,
                            height: 24,
                            fontSize: '12px',
                            fontWeight: 400,
                            // maxWidth: 180,
                            overflow: 'auto',
                            textTransform: 'none',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'noWrap',
                            borderRadius: 0.5,
                            justifyContent: 'flex-start',
                            scrollbarWidth: 'none', // Hide scrollbar for Firefox
                            '&::-webkit-scrollbar': { display: 'none' },
                          }}
                          onClick={() => {
                            onOpenRagSourcePanel(message.thoughts, sourceFile);
                          }}
                        >
                          {sourceFile}
                        </Button>
                      </Box>
                    ))}
                </Stack>
              </Scrollbar>
            </>
          )}

          {message.sources && message.sources.length > 0 && (
            <>
              <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 80 }}>
                Sources ({message.sources.length})
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
                        startIcon={<Iconify icon={linkFill} sx={{ height: 14, mx: -0.5 }} />}
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
                        }}
                      >
                        {item.label}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Scrollbar>
            </>
          )}

          {message.function_calls && message.function_calls.length > 0 && (
            <>
              <Typography
                variant="caption"
                sx={{ fontWeight: 600, minWidth: 80, color: 'text.secondary' }}
              >
                Function calls ({message.function_calls.length})
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
                        }}
                      >
                        {item.funcName}
                      </Button>
                    </Box>
                  ))}
                </Stack>
              </Scrollbar>
            </>
          )}
        </Stack>
      </>
    );

  return (
    <RootStyle>
      {!isMe && <Avatar alt="copilot" src={avatarUrl} sx={{ width: 30, height: 30, mr: 1.25 }} />}
      <Box sx={{ display: 'flex', ...(isMe && { ml: 'auto' }) }}>
        <div>
          <InfoStyle variant="caption" sx={{ ...(isMe && { justifyContent: 'flex-end' }) }}>
            {timeDistanceToNow.startsWith('0 sec') ? 'Just now' : timeDistanceToNow}
          </InfoStyle>

          <ContentStyle
            sx={{
              typography: 'body2',
              bgcolor: 'background.neutral',
              ...(isMe && { color: 'grey.800', bgcolor: '#d5f6fe' }),
              ...(isImage && { p: 1 }),
              ...(!isMe &&
                message.body &&
                !isSystemMsg && {
                  pt: 0.05,
                  px: 1.5,
                  minWidth: { xs: 'auto', md: chartIncluded ? 600 : 400 },
                }),
              ...(chartIncluded && {
                pt: 0.75,
                px: 2.25,
                minWidth: { xs: 'auto', md: 600 },
              }),
              maxWidth: isStretched ? { lg: 340, xl: 400 } : 320,
            }}
          >
            {isImage && (
              <MessageImgStyle
                alt="attachment"
                src={message.body}
                onClick={() => onOpenLightbox(message.body)}
              />
            )}

            {!!videoUrl && <>{handleVideo(message.body)}</>}

            {!isImage && !videoUrl && <>{handleMessage(message.body)}</>}

            {message.attachments !== undefined && message.attachments.length > 0 && (
              <>
                {message.attachments.map((attachment, index) => (
                  <MessageImgStyle
                    key={index}
                    alt="attachment"
                    src={attachment.preview}
                    onClick={() => onOpenLightbox(attachment.preview)}
                  />
                ))}
              </>
            )}

            {isSystemMsg && !isMe && isLastMessage && handleSysMessage(message.body)}
          </ContentStyle>
        </div>
      </Box>
    </RootStyle>
  );
}
