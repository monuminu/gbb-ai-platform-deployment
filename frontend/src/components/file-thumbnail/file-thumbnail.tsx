import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Theme, SxProps } from '@mui/material/styles';

import DownloadButton from './download-button';
import { fileData, fileThumb, fileFormat } from './utils';

// ----------------------------------------------------------------------

type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
  onClick?: (img: string) => void;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
};

export default function FileThumbnail({
  file,
  tooltip,
  imageView,
  onDownload,
  onClick,
  sx,
  imgSx,
}: FileIconProps) {
  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);
  // console.log(format);

  const renderContent =
    format === 'image' && imageView ? (
      <Box
        component="img"
        src={preview}
        sx={{
          width: 1,
          height: 1,
          flexShrink: 0,
          objectFit: 'cover',
          ...imgSx,
        }}
        onClick={() => {
          if (preview !== undefined && onClick !== undefined) onClick(preview);
        }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format)}
        sx={{
          width: 28,
          height: 28,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <>
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </>
  );
}
