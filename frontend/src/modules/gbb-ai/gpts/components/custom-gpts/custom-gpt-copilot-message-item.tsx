import { useState } from 'react';
import { formatDistanceToNowStrict } from 'date-fns';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

import useGetMessage from 'src/hooks/use-get-message';
import { useMockedUser } from 'src/hooks/use-mocked-user';

import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';

import { Message, Participant, MessageButton } from 'src/types/chat';

// ----------------------------------------------------------------------

type Props = {
  message: Message;
  participants: Participant[];
  isLastMessage: boolean;
  onOpenLightbox: (value: string) => void;
  onSend: Function;
  callBack?: Function;
};

export default function CopilotMessageItem({
  message,
  participants,
  isLastMessage,
  onOpenLightbox,
  onSend,
  callBack,
}: Props) {
  const { user } = useMockedUser();

  const [userReaction, setUserReaction] = useState('');

  const { me, senderDetails, hasImage } = useGetMessage({
    message,
    participants,
    currentUserId: `${user?.id}`,
  });

  const { firstName } = senderDetails;

  const isMe = senderDetails.type === 'me';

  const { body, createdAt, buttons } = message;

  const participantIds =
    participants === null ? [] : participants.map((participant) => participant.id);

  const isSystemMsg = !!message && !!body && body.startsWith('(SYS)Working');

  const handleCheckClick = () => callBack && !!body && callBack(body);

  const handleUpdateReaction = (reaction: string) => {
    setUserReaction((prev) => (reaction === prev ? '' : reaction));
  };

  const handleMessage = (msg: string) => {
    try {
      return <>{handleText(isSystemMsg, msg)}</>;
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

  const handleButtons = (_buttons: MessageButton[]) => {
    try {
      return (
        <Stack spacing={1} sx={{ mt: 1, mb: 1.5 }}>
          {_buttons.map((button: MessageButton, index: number) => (
            <Button
              key={index}
              fullWidth
              color="inherit"
              variant="outlined"
              onClick={() => {
                // //-------temp
                onSend({
                  content: button.button_content,
                  senderId: 'user',
                  mode: 'new',
                  buttonPrompt: button.button_prompt,
                });
                onSend({
                  content: '(SYS)Working on it...',
                  senderId: participantIds[0],
                  mode: 'new',
                });
              }}
            >
              {button.button_content}
            </Button>
          ))}
        </Stack>
      );
    } catch (e) {
      return null;
    }
  };

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
            <>{message.mode === 'attach' ? handleMessage(body) : handleMessage(body)}</>
          )}
        </>
      )}

      {isSystemMsg && !isMe && isLastMessage && handleSysMessage(message.body)}
      {!!buttons && handleButtons(buttons)}
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
          <IconButton size="small" onClick={handleCheckClick}>
            <Iconify icon="iconamoon:check-fill" width={16} />
          </IconButton>
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
