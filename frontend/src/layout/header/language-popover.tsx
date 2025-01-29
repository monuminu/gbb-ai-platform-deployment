import { m } from 'framer-motion';
import { useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { useLocales, useTranslate } from 'src/locales';

// import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { varHover } from 'src/components/animate';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const popover = usePopover();

  const { onChangeLang } = useTranslate();

  const { allLangs, currentLang } = useLocales();

  const handleChangeLang = useCallback(
    (newLang: string) => {
      onChangeLang(newLang);
      popover.onClose();
    },
    [onChangeLang, popover]
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          ...(popover.open && {
            bgcolor: 'action.selected',
          }),
          // '& .svg-color': {
          //   background: (theme) =>
          //     `linear-gradient(135deg, ${theme.palette.grey[600]} 0%, ${theme.palette.grey[700]} 80%)`,
          // },
        }}
      >
        <SvgColor src="/assets/icons/setting/ic_language.svg" sx={{ width: 24, height: 24 }} />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 120 }}>
        {allLangs.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === currentLang.value}
            onClick={() => handleChangeLang(option.value)}
          >
            {/* <Iconify icon={option.icon} sx={{ borderRadius: 0.65, width: 28 }} /> */}

            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
