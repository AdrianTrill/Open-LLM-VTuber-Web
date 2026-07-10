/* eslint-disable */
import { Tabs } from '@chakra-ui/react'
import { TbCamera, TbDeviceDesktop, TbWorld } from 'react-icons/tb'
import { useTranslation } from 'react-i18next'
import { sidebarStyles } from './sidebar-styles'
import CameraPanel from './camera-panel'
import ScreenPanel from './screen-panel'
import BrowserPanel from './browser-panel'

function BottomTab(): JSX.Element {
  const { t } = useTranslation();
  
  return (
    <Tabs.Root 
      defaultValue="camera" 
      variant="plain"
      {...sidebarStyles.bottomTab.container}
    >
      <Tabs.List {...sidebarStyles.bottomTab.list}>
        <Tabs.Trigger value="camera" {...sidebarStyles.bottomTab.trigger}>
          <TbCamera />
          {t('sidebar.camera')}
        </Tabs.Trigger>
        <Tabs.Trigger value="screen" {...sidebarStyles.bottomTab.trigger}>
          <TbDeviceDesktop />
          {t('sidebar.screen')}
        </Tabs.Trigger>
        <Tabs.Trigger value="browser" {...sidebarStyles.bottomTab.trigger}>
          <TbWorld />
          {t('sidebar.browser')}
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="camera">
        <CameraPanel />
      </Tabs.Content>
      
      <Tabs.Content value="screen">
        <ScreenPanel />
      </Tabs.Content>
      
      <Tabs.Content value="browser">
        <BrowserPanel />
      </Tabs.Content>
    </Tabs.Root>
  );
}

export default BottomTab
