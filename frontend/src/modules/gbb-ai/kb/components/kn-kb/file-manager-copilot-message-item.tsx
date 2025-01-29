import { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import useGetMessage from 'src/hooks/use-get-message';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import Scrollbar from 'src/components/scrollbar';
import { getSourceFiles } from 'src/components/rag-source-panel/rag-source-dialog';

import { Message, Participant } from 'src/types/chat';

import ChatMessageItemFilesHandler from './file-manager-copilot-message-item-files';

// ----------------------------------------------------------------------

type Props = {
  message: Message;
  participants: Participant[];
  isLastMessage: boolean;
  onOpenLightbox: (value: string) => void;
  onOpenRagSourcePanel: (thoughts: any, selected: string) => void;
};

export default function CopilotMessageItem({
  message,
  participants,
  isLastMessage,
  onOpenLightbox,
  onOpenRagSourcePanel,
}: Props) {
  const { user } = useMockedUser();

  const sourceFiles = getSourceFiles(message.thoughts);

  const [userReaction, setUserReaction] = useState('');

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName } = senderDetails;

  const isMe = senderDetails.type === 'me';

  const { body, createdAt, sources } = message;

  const isSystemMsg = !!message && !!body && body.startsWith('(SYS)Working');

  const handleUpdateReaction = (reaction: string) => {
    setUserReaction((prev) => (reaction === prev ? '' : reaction));
  };

  const handleMessage = (msg: string) => {
    try {
      return (
        <>
          {handleText(isSystemMsg, msg)}{' '}
          {message.thoughts && message.thoughts.length > 2 && handleMessageFooter()}
        </>
      );
    } catch (e) {
      return <Box sx={{ typography: 'body2' }}>{msg.replace('<eos>', '')}</Box>;
    }
  };

  const handleSysMessage = (msg: string) => (
    <Box>
      <Box sx={{ fontSize: 15, py: 1 }}>{msg.replace('(SYS)', '')}</Box>
      <LinearProgress color="primary" sx={{ mt: 0, mb: 1.5 }} />
    </Box>
  );

  const handleMessageFooter = () =>
    message &&
    message.body &&
    !isMe &&
    !isSystemMsg && (
      <>
        <Divider sx={{ borderStyle: 'dashed', mb: 0.75, mt: 0 }} />

        <Stack
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{
            mb: 0.85,
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
                  width: 68,
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
        </Stack>
      </>
    );

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{ mb: 1, color: 'text.disabled', ...(!me && { mr: 'auto' }) }}
    >
      {formatDistanceToNowStrict(new Date(createdAt), { addSuffix: true })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        px: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        ...(me && { color: 'grey.800', bgcolor: 'primary.lighter' }),
        ...(hasImage && { p: 0, bgcolor: 'transparent' }),
      }}
    >
      {!isSystemMsg && (
        <>
          {hasImage ? (
            <Box
              component="img"
              alt="attachment"
              src={body}
              onClick={() => onOpenLightbox(body)}
              sx={{
                minHeight: 220,
                borderRadius: 1.5,
                cursor: 'pointer',
                '&:hover': { opacity: 0.9 },
              }}
            />
          ) : (
            <>{handleMessage(body)}</>
          )}
        </>
      )}

      {isSystemMsg && !isMe && isLastMessage && handleSysMessage(message.body)}
      {sources && sources.length > 0 && <ChatMessageItemFilesHandler data={sources} />}
    </Stack>
  );

  const renderActions = (
    <Stack
      direction="row"
      className="message-actions"
      sx={{
        pt: 0.5,
        opacity: 0,
        top: '100%',
        left: 0,
        position: 'absolute',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        ...(me && { left: 'unset', right: 0 }),
      }}
    >
      {isMe && (
        <>
          <IconButton size="small">
            <Iconify icon="solar:reply-bold" width={16} />
          </IconButton>
          <IconButton size="small" sx={{ width: 26, height: 26 }}>
            <Iconify icon="lucide:copy" width={12} />
          </IconButton>
        </>
      )}
      {!isMe && (
        <>
          <IconButton
            size="small"
            color={userReaction !== 'Yes' ? 'default' : 'success'}
            onClick={() => handleUpdateReaction('Yes')}
          >
            <Iconify icon="fluent:thumb-like-16-regular" width={16} />
          </IconButton>
          <IconButton
            size="small"
            color={userReaction !== 'No' ? 'default' : 'error'}
            onClick={() => handleUpdateReaction('No')}
          >
            <Iconify icon="fluent:thumb-dislike-16-regular" width={16} />
          </IconButton>
        </>
      )}
    </Stack>
  );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 3 }}>
      {!me && (
        <Avatar
          alt={firstName}
          src="/assets/avatars/avatar_copilot.jpg"
          sx={{ width: 30, height: 30, mr: 2 }}
        />
      )}

      <Stack alignItems="flex-end">
        {renderInfo}

        <Stack
          direction="row"
          alignItems="center"
          sx={{ position: 'relative', '&:hover': { '& .message-actions': { opacity: 1 } } }}
        >
          {renderBody}
          {!isSystemMsg && !message.buttons && renderActions}
        </Stack>
      </Stack>
    </Stack>
  );
}

// ----------------------------------------------------------------------

function isJsonString(str: string) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

function handleText(isSystemMsg: boolean, msgText: string) {
  try {
    if (isSystemMsg) return null;

    const text = msgText.replace('<eos>', '');

    return (
      <Box sx={{ wordBreak: 'break-word' }}>
        <Markdown
          sx={{
            '& p': { fontSize: 14 },
            '& code': {
              fontSize: 13,
              borderRadius: 0.5,
              mx: 0.25,
              whiteSpace: 'pre-wrap',
            },
            '& pre, & pre > code': { fontSize: 13, p: 0.75 },
          }}
          children={isJsonString(text) ? `\`\`\`json\n ${text}` : text}
        />
      </Box>
    );
  } catch (error) {
    return <Box sx={{ typography: 'body2' }}>{msgText.replace('<eos>', '')}</Box>;
  }
}
