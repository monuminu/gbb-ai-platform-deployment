import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import isJsonString from 'src/utils/json-string';

import { getFileSas } from 'src/api/app-gallery';

// ----------------------------------------------------------------------

type Props = {
  title: string;
  content: string;
  icon?: React.ReactNode;
  onSend: Function;
  attachments?: Record<string, string[]>;
};

export default function ChatPromptExampleCard({
  title,
  content,
  icon,
  onSend,
  attachments,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [avatarSrc, setAvatarSrc] = useState<string[]>([]);
  const [promptContent, setPromptContent] = useState(content);

  async function urlToFile(url: string, filename: string, mimeType: string) {
    const response = await fetch(url);
    const data = await response.blob();
    return new File([data], filename, { type: mimeType });
  }

  const handleAvatarSrc = useCallback(async () => {
    const isJsonStr = isJsonString(content);
    const parsedPrompt = isJsonStr ? JSON.parse(content) : undefined;

    if (isJsonStr && parsedPrompt.attachments) {
      setPromptContent(parsedPrompt.content);
      const avatarNames = parsedPrompt.attachments;

      const promises = avatarNames.map(async (_avatarName: string) => {
        const avatarSas = await getFileSas(_avatarName);
        const fileName = avatarSas.split('?')[0].split('/').pop() as string;
        const fileType = fileName.split('.').pop();
        const file = await urlToFile(avatarSas, fileName, `image/${fileType}`);
        Object.assign(file, { preview: URL.createObjectURL(file) });

        return { avatarSas, file };
      });

      const results = await Promise.all(promises);

      results.forEach(({ avatarSas, file }) => {
        setAvatarSrc((prev) => [...prev, avatarSas]);
        setFiles((prev) => [...prev, file]);
      });

      // for (const _avatarName of avatarNames) {
      //   const avatarSas = await getFileSas(_avatarName);
      //   setAvatarSrc((prev) => [...prev, avatarSas]);

      //   const fileName = avatarSas.split('?')[0].split('/').pop() as string;
      //   const fileType = fileName.split('.').pop();
      //   const file = await urlToFile(avatarSas, fileName, `image/${fileType}`);
      //   Object.assign(file, { preview: URL.createObjectURL(file) });
      //   setFiles((prev) => [...prev, file]);
      // }
    } else if (attachments && `prompt-${title}` in attachments) {
      setAvatarSrc([attachments[`prompt-${title}`][0]]);
    }
  }, [title, content, attachments]);

  useEffect(() => {
    handleAvatarSrc();
  }, [handleAvatarSrc]);

  const handleSendPrompt = async (message: string) => {
    if (!message) return;

    onSend({
      content: message,
      senderId: 'user',
      mode: 'new',
      ...(avatarSrc && avatarSrc.length > 0 && { attachments: files }),
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: 'assistant',
      mode: 'new',
    });
  };
  // console.log(attachments);

  return (
    <Card
      sx={{
        px: 1,
        py: 0.25,
        borderRadius: 1,
        bgcolor: 'background.white',
        boxShadow: (theme) => theme.customShadows.z3,
        '&:hover': { boxShadow: (theme) => theme.customShadows.z20 },
      }}
      onClick={() => handleSendPrompt(promptContent)}
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ p: 0.25, px: 0 }}
        alignItems="center"
        justifyContent="space-between"
      >
        <Stack sx={{ py: 1 }} direction="row" alignItems="center">
          {avatarSrc && avatarSrc.length > 0 && (
            <Box
              sx={{
                ml: 1,
                mx: 0.75,
                width: 62,
                height: 62,
                position: 'relative',
              }}
            >
              <Avatar
                alt={`prompt-${title}`}
                src={avatarSrc[0]}
                variant="square"
                sx={{
                  width: 62,
                  height: 62,
                  borderRadius: 1,
                  // boxShadow: theme.customShadows.z3,
                  border: (theme) => `solid 1px ${alpha(theme.palette.grey[500], 0.4)}`,
                }}
              />
              {avatarSrc.length > 1 && (
                <Chip
                  size="small"
                  color="info"
                  label={`+${avatarSrc.length - 1}`}
                  sx={{
                    px: 0,
                    top: 1.5,
                    right: 1.5,
                    height: 16,
                    fontSize: '12px',
                    borderRadius: 0.75,
                    position: 'absolute',
                  }}
                />
              )}
            </Box>
          )}

          <Typography
            variant="body2"
            sx={{
              px: 1,
              display: '-webkit-box',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3,
            }}
          >
            {promptContent}
          </Typography>
        </Stack>

        {!!icon && icon}
      </Stack>
    </Card>
  );
}
