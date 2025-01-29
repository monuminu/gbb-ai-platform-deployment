import { useState } from 'react';

// mui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';

// project import
import ToolDetailCodeTab from './tool-detail-tabs-code';
import ToolDetailTestTab from './tool-detail-tabs-test';
import ToolDetailConfigurationTab from './tool-detail-tabs-configuration';

// ----------------------------------------------------------------------

type Props = {
  methods?: any;
};

export default function ToolDetailTabs({ methods }: Props) {
  const [currentTab, setCurrentTab] = useState('Code');

  const TOOL_DETAIL_TABS = [
    {
      value: 'Code',
      component: <ToolDetailCodeTab methods={methods} />,
    },
    {
      value: 'Configuration',
      component: <ToolDetailConfigurationTab methods={methods} />,
    },
    {
      value: 'Test',
      component: <ToolDetailTestTab methods={methods} />,
    },
  ];

  return (
    <Stack>
      <Tabs
        value={currentTab}
        scrollButtons="auto"
        variant="scrollable"
        allowScrollButtonsMobile
        onChange={(e, value) => setCurrentTab(value)}
        sx={{
          mt: 0.25,
          mb: 3,
          justifyContent: 'center',
        }}
      >
        {TOOL_DETAIL_TABS.map((tab) => (
          <Tab
            disableRipple
            key={tab.value}
            value={tab.value}
            label={tab.value}
            style={{ marginRight: 34, minWidth: 36 }}
            sx={{ ml: 0 }}
          />
        ))}
      </Tabs>

      {TOOL_DETAIL_TABS.map((tab) => {
        const isMatched = tab.value === currentTab;
        return isMatched && <Box key={tab.value}>{tab.component}</Box>;
      })}
    </Stack>
  );
}
