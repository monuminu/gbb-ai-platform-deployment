import { useState } from 'react';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';

import { useMockedUser } from 'src/hooks/use-mocked-user';

// ----------------------------------------------------------------------

type Props = {
  buttonDisabled: boolean;
  onSend: Function;
};

export default function FunctionDetailsCopilotInput({ buttonDisabled, onSend }: Props) {
  const { user } = useMockedUser();

  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message) {
      return;
    }
    onSend({
      content: message,
      senderId: 'user',
      mode: 'new',
    });
    onSend({
      content: '(SYS)Working on it...',
      senderId: 'assistant',
      mode: 'new',
    });

    setMessage('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ pt: 2, pb: 2.75, px: 2.25 }}>
      <Avatar sx={{ width: 32, height: 32 }} src={user?.photoURL} alt={user?.displayName} />

      <Paper variant="outlined" sx={{ p: 1, flexGrow: 1, bgcolor: 'transparent' }}>
        <InputBase
          disabled={buttonDisabled}
          fullWidth
          multiline
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={handleKeyDown}
          sx={{ px: 1 }}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button disabled={buttonDisabled} size="small" variant="contained" onClick={handleSend}>
            Send
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
}
