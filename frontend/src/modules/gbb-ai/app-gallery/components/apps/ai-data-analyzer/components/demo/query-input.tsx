import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';

// ----------------------------------------------------------------------

export default function QueryInput({ sx, ...other }: InputBaseProps) {
  return (
    <InputBase
      sx={{
        [`&.${inputBaseClasses.root}`]: {
          py: 0.75,
          borderRadius: 1,
          typography: 'h6',
          borderWidth: 1.5,
          borderStyle: 'solid',
          borderColor: 'transparent',
          transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
          [`&.${inputBaseClasses.focused}`]: {
            pl: 1,
            borderColor: 'text.primary',
          },
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        },
        [`& .${inputBaseClasses.input}`]: {
          typography: 'h6',
        },
        ...sx,
      }}
      {...other}
    />
  );
}
