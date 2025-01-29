// mui
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';

// project import
import ToolDetailConfigurationTabEnv from './tool-detail-tabs-configuration-env';
import ToolDetailConfigurationTabAuth from './tool-detail-tabs-configuration-auth';

// ----------------------------------------------------------------------

type Props = {
  methods: any;
};

export default function ToolDetailConfigurationTab({ methods }: Props) {
  const { watch, setValue } = methods;

  const values = watch();

  const { type, envVars, apiAuth } = values;

  const handleAddEnvVar = () => {
    setValue('envVars', [...values.envVars, { key: '', value: '' }]);
  };

  const handleUpdateEnvVar = (index: number, _type: string, content: string) => {
    setValue(
      'envVars',
      values.envVars.map((item: { key: string; value: string }, i: number) =>
        i === index
          ? {
              key: _type === 'key' ? content : item.key,
              value: _type === 'value' ? content : item.value,
            }
          : item
      )
    );
  };

  const handleRemoveEnvVar = (index: number) => {
    setValue(
      'envVars',
      values.envVars.filter((_: object, i: number) => i !== index)
    );
  };

  const handleUpdateApiAuth = (_type: string, content: string) => {
    setValue('apiAuth', { ...values.apiAuth, [_type]: content });
  };

  return (
    <Stack>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          {type === 'Python' && (
            <ToolDetailConfigurationTabEnv
              envVars={envVars}
              onAddEnvVar={handleAddEnvVar}
              onUpdateEnvVar={handleUpdateEnvVar}
              onDeleteEnvVar={handleRemoveEnvVar}
            />
          )}
          {type === 'OpenAPI' && (
            <ToolDetailConfigurationTabAuth
              apiAuth={apiAuth}
              onUpdateApiAuth={handleUpdateApiAuth}
            />
          )}
        </Grid>
      </Grid>
    </Stack>
  );
}
