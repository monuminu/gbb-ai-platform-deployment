// import { sentenceCase } from "change-case";
import { BoxProps } from '@mui/material';

import { ColorType } from 'src/custom/palette';

import Tag from './Tag';

// ----------------------------------------------------------------------

type LabelVariant = 'filled' | 'outlined' | 'ghost';

interface TagProps extends BoxProps {
  title: string;
  color?: ColorType;
  variant?: LabelVariant;
}

export default function AppTag({ title, color, variant, sx }: TagProps) {
  return (
    <Tag
      // variant={theme.palette.mode === "light" ? "ghost" : "filled"}
      color={color !== undefined ? color : 'default'}
      variant={variant}
      sx={sx}
    >
      {title}
      {/* {sentenceCase(title)} */}
    </Tag>
  );
}
