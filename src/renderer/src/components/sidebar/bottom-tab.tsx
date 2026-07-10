/* eslint-disable */
import { Box, Text } from '@chakra-ui/react'
import { TbCamera, TbDeviceDesktop, TbWorld, TbChevronRight } from 'react-icons/tb'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { sidebarStyles } from './sidebar-styles'
import CameraPanel from './camera-panel'
import ScreenPanel from './screen-panel'
import BrowserPanel from './browser-panel'

type SourceTab = 'camera' | 'screen' | 'browser' | null

function BottomTab(): JSX.Element {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<SourceTab>(null);

  const toggle = (tab: SourceTab) => {
    setActiveTab(activeTab === tab ? null : tab);
  };

  const label = activeTab === 'camera' ? t('sidebar.camera')
    : activeTab === 'screen' ? t('sidebar.screen')
    : activeTab === 'browser' ? t('sidebar.browser')
    : t('sidebar.camera');

  return (
    <Box borderTop="1px solid" borderColor="rgba(255,255,255,0.06)">
      {!activeTab && (
        <Box
          display="flex"
          alignItems="center"
          gap={2}
          px={3}
          py={2.5}
          cursor="pointer"
          color="rgba(255,255,255,0.5)"
          _hover={{ color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.03)' }}
          transition="all 0.15s ease"
          onClick={() => toggle('camera')}
        >
          <TbCamera size={16} />
          <Text fontSize="13px" flex={1}>Camera off</Text>
          <TbChevronRight size={14} />
        </Box>
      )}

      {activeTab && (
        <Box>
          <Box display="flex" gap={0} borderBottom="1px solid" borderColor="rgba(255,255,255,0.04)">
            {([
              { id: 'camera' as const, icon: <TbCamera size={14} />, label: t('sidebar.camera') },
              { id: 'screen' as const, icon: <TbDeviceDesktop size={14} />, label: t('sidebar.screen') },
              { id: 'browser' as const, icon: <TbWorld size={14} />, label: t('sidebar.browser') },
            ]).map((tab) => (
              <Box
                key={tab.id}
                flex={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap={1.5}
                py={2}
                cursor="pointer"
                fontSize="12px"
                fontWeight="500"
                color={activeTab === tab.id ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.4)'}
                borderBottom="2px solid"
                borderColor={activeTab === tab.id ? 'rgba(255,255,255,0.3)' : 'transparent'}
                _hover={{ color: 'rgba(255,255,255,0.7)' }}
                transition="all 0.15s ease"
                onClick={() => toggle(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </Box>
            ))}
          </Box>

          {activeTab === 'camera' && <CameraPanel />}
          {activeTab === 'screen' && <ScreenPanel />}
          {activeTab === 'browser' && <BrowserPanel />}
        </Box>
      )}
    </Box>
  );
}

export default BottomTab
