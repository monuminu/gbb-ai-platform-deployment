import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

type PresetType = 'default' | 'cyan';

export function createPresets(preset: PresetType) {
  const primaryColor = getPrimary(preset);

  const theme = {
    palette: {
      primary: primaryColor,
    },
    customShadows: {
      primary: `0 8px 16px 0 ${alpha(`${primaryColor?.main}`, 0.24)}`,
    },
  };

  return {
    ...theme,
  };
}

// ----------------------------------------------------------------------

const cyan = {
  lighter: '#CAFCF9',
  light: '#61E7F2',
  main: '#00A7D6',
  dark: '#00619A',
  darker: '#003266',
  contrastText: '#FFFFFF',
};

export const presetOptions = [
  { name: 'default', value: cyan.main },
  { name: 'cyan', value: cyan.main },
];

export function getPrimary(preset: PresetType) {
  return {
    default: cyan,
    cyan,
  }[preset];
}
