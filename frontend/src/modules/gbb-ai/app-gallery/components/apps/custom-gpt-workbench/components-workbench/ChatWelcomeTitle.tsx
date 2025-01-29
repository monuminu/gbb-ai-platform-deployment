import { m } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { textGradient } from 'src/custom/css';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

const StyledDescription = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledGradientText = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, #64B189 5%,
    #22A3E7 20%,
    #DA57A5 50%,
    #F79D5D 60%,
    #ED6D1E 80%`
  ),
  color: theme.palette.text.primary,
  backgroundSize: '200%',
  // fontFamily: "'Barlow', sans-serif",
  fontSize: `${36 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1.25,
  marginBottom: 20,
  letterSpacing: 0,
  [theme.breakpoints.up('md')]: {
    fontSize: `${44 / 16}rem`,
  },
}));

export default function ChatWelcomeTitle({ title }: Props) {
  return (
    <Container sx={{ display: { md: 'flex' } }}>
      <StyledDescription>
        <StyledGradientText animate={{ backgroundPosition: '200% center' }}>
          {title}
        </StyledGradientText>
      </StyledDescription>
    </Container>
  );
}
