import { useState, useCallback } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import ListItemButton from '@mui/material/ListItemButton';

import { useBoolean } from 'src/hooks/use-boolean';

import axios from 'src/utils/axios';

import { FUNCTION_API } from 'src/config-global';

import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import Scrollbar from 'src/components/scrollbar';
import { MarkdownImg } from 'src/components/markdown';
import EmptyContent from 'src/components/empty-content';
import { RHFUpload, RHFTextField, RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';

import CustomGptCopilot from './custom-gpt-copilot';
import GptExtensionPanel from './custom-gpt-configuration-extensions';
import SamplePromptPanel from './custom-gpt-configuration-sample-prompts';

// ----------------------------------------------------------------------

const CATEGORIES = ['Writing', 'Productivity', 'Programming', 'Image', 'Lifestyle', 'Education'];

const COVER_OPTIONS = [
  { value: 'custom', label: 'Custom' },
  { value: 'dalle', label: 'Dall·E' },
];

// ----------------------------------------------------------------------

type Props = {
  methods?: any;
  attachments?: Record<string, (File | string)[]>;
  onUpdateAttachments: (
    acceptedFiles: (File | string)[],
    promptOrder: number,
    mode: 'add' | 'remove'
  ) => void;
};

export default function CustomGptNewEditConfiguration({
  methods,
  attachments,
  onUpdateAttachments,
}: Props) {
  const expand = useBoolean();

  const [copilotTrigger, setCopilotTrigger] = useState('');

  const [selectedText] = useState<{
    start: number;
    length: number;
    text: string;
  } | null>(null);

  const [isGeneratingImg, setGeneratingImg] = useState<boolean>(false);

  const [generatedImgs, setGeneratedImgs] = useState<string[]>([]);

  const { watch, setValue } = methods;

  const values = watch();

  // console.log(values);

  const handleCopilotClick = (trigger: string) => {
    setCopilotTrigger(trigger);
  };

  const handleCopilotCallback = (trigger: string) => {
    setCopilotTrigger(trigger);
  };

  const handleAddSamplePrompt = () => {
    setValue('samplePrompts', [...values.samplePrompts, '']);
  };

  const handleUpdateSamplePrompt = (index: number, value: string) => {
    setValue(
      'samplePrompts',
      values.samplePrompts.map((item: string, i: number) => (i === index ? value : item))
    );
  };

  const handleRemoveSamplePrompt = (index: number) => {
    setValue(
      'samplePrompts',
      values.samplePrompts.filter((_: string, i: number) => i !== index)
    );
  };

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('coverUrl', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handleRemoveFile = useCallback(() => {
    setValue('coverUrl', null);
  }, [setValue]);

  async function handleDrawImage() {
    if (selectedText && selectedText.text.length > 0) {
      const { text } = selectedText;
      setGeneratingImg(true);
      const params = { prompt: text };
      const response = await axios.post(FUNCTION_API, { action: 'draw', params });
      setGeneratingImg(false);
      if (response.data.image_url) {
        setGeneratedImgs((prev) => [...prev, response.data.image_url]);
      }
    }
  }

  return (
    <Card sx={{ height: 'calc(100% + 52px)' }}>
      <CardHeader
        title="Configuration"
        sx={{ mt: -1, mb: 2 }}
        action={
          <Stack direction="row" spacing={1} alignItems="center" sx={{ py: -1.5 }}>
            <IconButton size="small" onClick={() => handleCopilotClick('config')}>
              <Box
                component="img"
                src="/assets/icons/modules/ic_copilot.svg"
                sx={{ width: 26, height: 26, cursor: 'pointer' }}
              />
            </IconButton>
          </Stack>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', mb: 0.25 }} />
      <Scrollbar sx={{ flexDirection: 'row' }}>
        <Stack spacing={2.5} sx={{ p: 3, pb: 11 }}>
          <RHFTextField name="name" label="GPT name" />

          <RHFTextField name="description" label="Description" multiline rows={2} />

          <Box sx={{ position: 'relative' }}>
            <RHFTextField name="instruction" label="System prompt" multiline rows={3} />

            <IconButton
              onClick={expand.onTrue}
              sx={{
                p: 0,
                right: 2,
                bottom: 2,
                zIndex: 9,
                opacity: 1,
                width: '18px',
                height: '18px',
                position: 'absolute',
                bgcolor: 'transparent',
                justifyContent: 'center',
                '&:hover': { opacity: 0.8 },
              }}
            >
              <Iconify icon="eva:expand-fill" width={18} />
            </IconButton>
          </Box>

          <RHFAutocomplete
            name="category"
            label="Category"
            placeholder="Select a category"
            options={CATEGORIES.map((option) => option)}
            getOptionLabel={(option) => option}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option}
                  size="small"
                  color="info"
                  variant="soft"
                />
              ))
            }
          />

          <Box sx={{ mt: -0.5 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography noWrap variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                Sample prompts
              </Typography>
              <IconButton size="small" onClick={handleAddSamplePrompt}>
                <Iconify icon={plusFill} />
              </IconButton>
            </Stack>

            <SamplePromptPanel
              samplePrompts={values.samplePrompts}
              onUpdateSamplePrompt={handleUpdateSamplePrompt}
              onDeleteSamplePrompt={handleRemoveSamplePrompt}
              attachments={attachments}
              onUpdateAttachments={onUpdateAttachments}
            />
          </Box>

          <Divider sx={{ borderStyle: 'dashed', mb: 0.25 }} />

          <GptExtensionPanel values={values} setValue={setValue} />

          <Divider sx={{ borderStyle: 'dashed', mb: 0.25 }} />

          <Stack spacing={1.5} sx={{ my: 0, mt: -1 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle2">Cover Image</Typography>
              <Stack direction="row" alignItems="center" spacing={2}>
                <RHFRadioGroup row spacing={3} name="coverType" options={COVER_OPTIONS} />
                {values.coverType === 'dalle' && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <ListItemButton
                      sx={{ px: 1, borderRadius: 0.75, height: 30 }}
                      onClick={() => handleDrawImage()}
                    >
                      <ListItemIcon>
                        <Box
                          component="span"
                          className="icon"
                          sx={{ width: 18, color: 'secondary.light' }}
                        >
                          <SvgColor
                            src="/assets/icons/app/ai_content_generator/ic_ai_draw.svg"
                            sx={{ width: 1, height: 1 }}
                          />
                        </Box>
                      </ListItemIcon>
                      <ListItemText primary="Draw" sx={{ ml: -1 }} />
                    </ListItemButton>
                  </Box>
                )}
              </Stack>
            </Stack>

            {values.coverType === 'custom' && (
              <RHFUpload
                name="coverUrl"
                maxSize={10145728}
                onDrop={handleDrop}
                onDelete={handleRemoveFile}
              />
            )}

            {values.coverType === 'dalle' && (
              <Stack spacing={1.5}>
                {isGeneratingImg && (
                  <Stack direction="row" spacing={2}>
                    {[...Array(3)].map((_, index) => (
                      <Skeleton
                        key={`b${index}`}
                        variant="rectangular"
                        width="100%"
                        height={180}
                        sx={{ mb: index === 2 ? 0 : 3, borderRadius: 1 }}
                      />
                    ))}
                  </Stack>
                )}

                {!isGeneratingImg && generatedImgs.length > 0 && (
                  <Box
                    sx={{
                      my: 1,
                      display: 'grid',
                      gap: 2.5,
                      gridTemplateColumns: {
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(2, 1fr)',
                        md: 'repeat(3, 1fr)',
                        lg: 'repeat(3, 1fr)',
                      },
                    }}
                  >
                    {generatedImgs.map((img, index) => (
                      <MarkdownImg key={index} children={`![Image](${img})`} sx={{ my: -2.5 }} />
                    ))}
                  </Box>
                )}

                {!isGeneratingImg && generatedImgs.length === 0 && (
                  <EmptyContent
                    filled
                    title="No Images"
                    description="You can ask AI to draw for you"
                    sx={{ pt: 6, pb: 9 }}
                  />
                )}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Scrollbar>

      <CustomGptCopilot
        open={!!copilotTrigger}
        trigger={copilotTrigger}
        context={values.name}
        onClose={() => handleCopilotClick('')}
        callBack={handleCopilotCallback}
      />

      <Dialog fullWidth maxWidth="md" open={expand.value} onClose={expand.onFalse}>
        <DialogTitle sx={{ p: (theme) => theme.spacing(2.5, 3, 1.5, 3) }}>
          System prompt
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none', height: '100%' }}>
          <RHFTextField
            sx={{ maxHeight: 'auto' }}
            name="instruction"
            multiline
            minRows={5}
            maxRows={30}
          />
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={expand.onFalse}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
