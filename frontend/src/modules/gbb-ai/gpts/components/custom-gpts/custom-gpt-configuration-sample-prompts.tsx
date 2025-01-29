import { useCallback } from 'react';
import closeFill from '@iconify/icons-eva/close-fill';

import { Stack, TextField, IconButton } from '@mui/material';

import Iconify from 'src/components/iconify';
import { UploadIconButton, MultiFilePreview } from 'src/components/upload';

// import Attachments from "../../Attachments";

// ----------------------------------------------------------------------

type Props = {
  samplePrompts: string[];
  onUpdateSamplePrompt: (index: number, content: string) => void;
  onDeleteSamplePrompt: (index: number) => void;
  attachments: Record<string, (File | string)[]> | undefined;
  onUpdateAttachments: (
    acceptedFiles: (File | string)[],
    promptOrder: number,
    mode: 'add' | 'remove'
  ) => void;
};

export default function SamplePromptPanel({
  samplePrompts,
  onUpdateSamplePrompt,
  onDeleteSamplePrompt,
  attachments,
  onUpdateAttachments,
}: Props) {
  const handleUpdateSamplePrompt = (index: number, value: string) => {
    onUpdateSamplePrompt(index, value);
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[], promptOrder: number) => {
      const newFiles = acceptedFiles.map((file: File) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      onUpdateAttachments(newFiles, promptOrder, 'add');
    },
    [onUpdateAttachments]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string, promptOrder: number) => {
      onUpdateAttachments([inputFile], promptOrder, 'remove');
    },
    [onUpdateAttachments]
  );

  if (samplePrompts.length === 0) {
    return null;
  }

  return (
    <Stack sx={{ mt: 1.5 }} spacing={2}>
      {samplePrompts.map((content, index) => (
        <Stack key={index} direction="row" alignItems="center" spacing={0.5}>
          <TextField
            fullWidth
            multiline
            maxRows={3}
            size="small"
            placeholder=""
            value={content}
            onChange={(event) => {
              handleUpdateSamplePrompt(index, event.target.value);
            }}
            inputProps={{ style: { fontSize: '14px' } }}
          />

          <Stack direction="row" alignItems="center">
            {attachments && `prompt-${index}` in attachments && (
              <MultiFilePreview
                thumbnail
                files={attachments[`prompt-${index}`]}
                onRemove={(file) => handleRemoveFile(file, index)}
                sx={{ width: 39, height: 39, borderRadius: 1 }}
              />
            )}
          </Stack>

          <UploadIconButton
            onDrop={(acceptedFiles) => handleDrop(acceptedFiles, index)}
            sx={{ width: 30, height: 30, mr: -0.25 }}
            placeholder={<Iconify icon="solar:gallery-add-bold" width={20} />}
          />

          <IconButton
            size="small"
            onClick={() => {
              onDeleteSamplePrompt(index);
            }}
          >
            <Iconify icon={closeFill} />
          </IconButton>
        </Stack>
      ))}
    </Stack>
  );
}
