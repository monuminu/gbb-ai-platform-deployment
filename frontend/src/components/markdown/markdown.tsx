/* eslint-disable perfectionist/sort-imports */
import 'src/utils/highlight';

// markdown plugins
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';

import Link from '@mui/material/Link';

import { NavigationLink } from 'src/routes/components';

import Image from '../image';
import StyledMarkdown from './styles';
import { MarkdownProps } from './types';

// ----------------------------------------------------------------------

export default function Markdown({ sx, ...other }: MarkdownProps) {
  return (
    <StyledMarkdown sx={sx}>
      <ReactMarkdown
        rehypePlugins={[rehypeRaw, rehypeHighlight, [remarkGfm, { singleTilde: false }]]}
        components={components}
        {...other}
      />
    </StyledMarkdown>
  );
}

// ----------------------------------------------------------------------

const components = {
  img: ({ ...props }) => {
    const imgUrl = props.src.replaceAll('amp;', '');
    return (
      <Image alt={props.alt} ratio="16/9" sx={{ borderRadius: 1, my: 1 }} {...props} src={imgUrl} />
    );
  },
  a: ({ ...props }) => {
    const isHttp = props.href?.includes('http') || false;

    return isHttp ? (
      <Link target="_blank" rel="noopener" {...props} />
    ) : (
      <Link component={NavigationLink} path={props.href} {...props}>
        {props.children}
      </Link>
      // <Link component={RouterLink} {...otherProps} to={href || '/'}>
      //   {children}
      // </Link>
    );
  },
};
