import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';

// ----------------------------------------------------------------------

type Props = {
  dependencies: string[];
  onAddDependency: () => void;
  onDeleteDependency: (index: number) => void;
  onUpdateDependency: (index: number, content: string) => void;
};

export default function ToolDetailTabsCodeDependencies({
  dependencies,
  onAddDependency,
  onDeleteDependency,
  onUpdateDependency,
}: Props) {
  return (
    <Card>
      <CardHeader
        title={`Dependencies (${dependencies.length})`}
        sx={{ mt: -1, mb: -0.5 }}
        action={
          <IconButton
            size="small"
            onClick={onAddDependency}
            sx={{ width: 30, height: 30, mt: 0.5, color: 'inherit' }}
          >
            <Iconify icon={plusFill} />
          </IconButton>
        }
      />

      <Divider sx={{ borderStyle: 'dashed', my: 2.5 }} />
      {dependencies && dependencies.length > 0 && (
        <Stack spacing={0.5} sx={{ mb: 2.5 }}>
          {dependencies.map((dependency, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              sx={{ pl: 1, mx: 2 }}
              justifyContent="space-between"
            >
              {/* <Typography variant="body2">{dependency}</Typography> */}

              <InputBase
                placeholder="dependency"
                value={dependency || ''}
                onChange={(event) => onUpdateDependency(index, event.target.value)}
                sx={{
                  width: '100%',
                  [`&.${inputBaseClasses.root}`]: {
                    py: 0,
                    mr: 1,
                    borderRadius: 0.75,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'transparent',
                    transition: (theme) =>
                      theme.transitions.create(['padding-left', 'border-color']),
                    [`&.${inputBaseClasses.focused}`]: {
                      pl: 0.75,
                      borderColor: 'text.primary',
                    },
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    WebkitBoxOrient: 'vertical',
                  },
                  [`& .${inputBaseClasses.input}`]: {
                    typography: 'body2',
                  },
                }}
              />

              <IconButton size="small" sx={{ p: 0.9 }} onClick={() => onDeleteDependency(index)}>
                <Iconify icon={closeFill} width={16} />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}
      {!dependencies ||
        (dependencies.length === 0 && (
          <EmptyContent filled title="No dependencies" sx={{ py: 4, m: 3 }} />
        ))}

      {/* <Divider sx={{ borderStyle: 'dashed', mt: 2 }} />

      <Stack spacing={3} direction="row" alignItems="center" sx={{ p: 2.5, px: 3 }}>
        <Button fullWidth size="small" color="error" variant="soft" onClick={() => {}}>
          Clear
        </Button>

        <Button fullWidth size="small" color="inherit" variant="soft" onClick={() => {}}>
          Import
        </Button>
      </Stack> */}
    </Card>
  );
}
