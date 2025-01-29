import { useState } from 'react';

import { Chip, Stack, Avatar } from '@mui/material';

import { useFetchTools } from 'src/api/tool';
import { useFetchKmmList } from 'src/api/kmm';

import { RHFSwitch, RHFAutocomplete } from 'src/components/hook-form';

import { ITool } from 'src/types/tool';

// ----------------------------------------------------------------------

type Props = {
  values: any;
  setValue: Function;
};

export default function GptExtensionPanel({ values, setValue }: Props) {
  const [refreshKey] = useState(0);

  const { tools } = useFetchTools();
  const { kmmList } = useFetchKmmList(refreshKey);

  const _tools = tools.map((tool) => `${tool.id}<sep>${tool.name}`);
  const _kbs = kmmList.map((kb) => `${kb.name}<sep>${kb.index}`);

  const getToolCover = (id: string) => {
    const tool = tools.filter((t) => t.id === id)[0] as ITool;
    return tool ? tool.cover : '';
  };

  return (
    <Stack spacing={1.5}>
      <Stack direction="row">
        <RHFSwitch
          name="function"
          size="medium"
          labelPlacement="end"
          label="Tool"
          sx={{ flexGrow: 1, width: 140 }}
          onClick={() => {
            if (values.function) {
              setValue('functionList', []);
            }
          }}
        />

        {!!values.function && (
          <RHFAutocomplete
            fullWidth
            name="functionList"
            size="small"
            placeholder="+ Tools"
            multiple
            isOptionEqualToValue={(option, value) => option === value}
            options={_tools.map((_option) => _option)}
            getOptionLabel={(option) => option.split('<sep>')[1]}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    alt={option.split('<sep>')[0]}
                    src={getToolCover(option.split('<sep>')[0])}
                  />
                  {option.split('<sep>')[1]}
                </Stack>
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option.split('<sep>')[1]}
                  size="small"
                  color="default"
                  variant="soft"
                  avatar={
                    <Avatar
                      alt={option.split('<sep>')[0]}
                      src={getToolCover(option.split('<sep>')[0])}
                    />
                  }
                />
              ))
            }
          />
        )}
      </Stack>

      <Stack direction="row">
        <RHFSwitch
          name="knowledge"
          labelPlacement="end"
          label="Knowledge"
          sx={{ flexGrow: 1, width: 140 }}
          onClick={() => {
            if (values.knowledge) {
              setValue('knowledgeBase', '');
            }
          }}
        />
        {!!values.knowledge && (
          <RHFAutocomplete
            fullWidth
            name="knowledgeBase"
            size="small"
            placeholder="+ Knowledge"
            options={_kbs.map((option) => option)}
            getOptionLabel={(option) => option.split('<sep>')[0]}
            renderOption={(props, option) => (
              <li {...props} key={option}>
                {option.split('<sep>')[0]}
              </li>
            )}
            renderTags={(selected, getTagProps) =>
              selected.map((option, index) => (
                <Chip
                  {...getTagProps({ index })}
                  key={option}
                  label={option.split('<sep>')[0]}
                  size="small"
                  color="primary"
                  variant="soft"
                />
              ))
            }
          />
        )}
      </Stack>
    </Stack>
  );
}
