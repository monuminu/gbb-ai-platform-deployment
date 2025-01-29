import { m } from 'framer-motion';

import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';

import { textGradient } from 'src/custom/css';

import { MotionContainer } from 'src/components/animate';

// ----------------------------------------------------------------------

type Props = {
  title: string;
};

const StyledDescription = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(0, 0, 3, 0),
}));

const StyledGradientText = styled(m.h2)(({ theme }) => ({
  ...textGradient(
    `300deg, #64B189 5%,
    #22A3E7 20%,
    #DA57A5 50%,
    #F79D5D 60%,
    #ED6D1E 80%`
  ),
  backgroundSize: '200%',
  // fontFamily: "'Barlow', sans-serif",
  fontSize: `${42 / 16}rem`,
  textAlign: 'center',
  lineHeight: 1.25,
  marginBottom: 20,
  letterSpacing: 0,
  [theme.breakpoints.up('md')]: {
    fontSize: `${48 / 16}rem`,
  },
}));

export default function ChatWelcomeTitle({ title }: Props) {
  return (
    <>
      {/* <Typography
        variant="h2"
        sx={{
          textAlign: "center",
          background:
            "-webkit-linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {title}
      </Typography> */}

      <Container
        component={MotionContainer}
        sx={{
          display: { md: 'flex' },
          justifyContent: { md: 'space-between' },
        }}
      >
        <StyledDescription>
          {/* <m.div variants={varFade().inUp}> */}
          <StyledGradientText
            animate={{ backgroundPosition: '200% center' }}
            // transition={{
            //   repeatType: 'reverse',
            //   ease: 'linear',
            //   duration: 20,
            //   repeat: Infinity,
            // }}
          >
            {title}
          </StyledGradientText>
          {/* </m.div> */}
        </StyledDescription>
      </Container>
    </>
  );
}
