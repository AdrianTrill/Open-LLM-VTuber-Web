/* eslint-disable react/require-default-props */
import { Box, Button, Text, Menu } from '@chakra-ui/react';
import {
  TbSettings, TbClock, TbPlus, TbChevronLeft, TbUsers, TbStack2, TbSparkles
} from 'react-icons/tb';
import { memo, useState, useEffect } from 'react';
import { sidebarStyles } from './sidebar-styles';
import SettingUI from './setting/setting-ui';
import ChatHistoryPanel from './chat-history-panel';
import BottomTab from './bottom-tab';
import HistoryDrawer from './history-drawer';
import { useSidebar } from '@/hooks/sidebar/use-sidebar';
import GroupDrawer from './group-drawer';
import { ModeType } from '@/context/mode-context';

interface SidebarProps {
  isCollapsed?: boolean
  onToggle: () => void
}

interface HeaderButtonsProps {
  onSettingsOpen: () => void
  onNewHistory: () => void
  setMode: (mode: ModeType) => void
  currentMode: 'window' | 'pet'
  isElectron: boolean
}

const ToggleButton = memo(({ isCollapsed, onToggle }: {
  isCollapsed: boolean
  onToggle: () => void
}) => (
  <Box
    {...sidebarStyles.sidebar.toggleButton}
    style={{
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
    onClick={onToggle}
  >
    <TbChevronLeft />
  </Box>
));

ToggleButton.displayName = 'ToggleButton';


const CeceHeader = memo(({ ceceMode }: { ceceMode: string }) => (
  <Box
    px={4}
    py={3}
    borderBottom="1px solid"
    borderColor="rgba(255, 255, 255, 0.06)"
    display="flex"
    alignItems="center"
    justifyContent="space-between"
  >
    <Box display="flex" alignItems="center" gap={2.5}>
      <Box
        w="32px"
        h="32px"
        borderRadius="8px"
        bg="#76B900"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexShrink={0}
      >
        <TbSparkles size="18" color="white" />
      </Box>
      <Text fontSize="16px" fontWeight="600" color="#f0f0f5" letterSpacing="-0.01em">
        CeCe
      </Text>
    </Box>
    <Box display="flex" gap={1} bg="rgba(255,255,255,0.04)" borderRadius="8px" p="2px">
      <Box
        px={3}
        py={1}
        borderRadius="6px"
        fontSize="12px"
        fontWeight="500"
        cursor="pointer"
        transition="all 0.15s ease"
        bg={ceceMode !== 'training' ? 'rgba(118, 185, 0, 0.15)' : 'transparent'}
        color={ceceMode !== 'training' ? '#76B900' : 'rgba(255,255,255,0.45)'}
        _hover={{ color: ceceMode !== 'training' ? '#76B900' : 'rgba(255,255,255,0.7)' }}
        userSelect="none"
      >
        Customer event
      </Box>
      <Box
        px={3}
        py={1}
        borderRadius="6px"
        fontSize="12px"
        fontWeight="500"
        cursor="pointer"
        transition="all 0.15s ease"
        bg={ceceMode === 'training' ? 'rgba(245, 158, 11, 0.15)' : 'transparent'}
        color={ceceMode === 'training' ? '#f59e0b' : 'rgba(255,255,255,0.45)'}
        _hover={{ color: ceceMode === 'training' ? '#f59e0b' : 'rgba(255,255,255,0.7)' }}
        userSelect="none"
      >
        Associate training
      </Box>
    </Box>
  </Box>
));

CeceHeader.displayName = 'CeceHeader';

const IconWithLabel = memo(({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
    <Box fontSize="18px" lineHeight="1">{icon}</Box>
    <Text fontSize="10px" color="inherit" lineHeight="1" userSelect="none">{label}</Text>
  </Box>
));
IconWithLabel.displayName = 'IconWithLabel';

const HeaderButtons = memo(({ onSettingsOpen, onNewHistory, setMode, currentMode, isElectron }: HeaderButtonsProps) => (
  <Box display="flex" gap={0} px={1} py={1.5} justifyContent="space-around" borderBottom="1px solid" borderColor="rgba(255,255,255,0.04)">
    <Button onClick={onSettingsOpen} size="sm" variant="ghost" color="rgba(255,255,255,0.5)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} px={3} py={2} height="auto">
      <IconWithLabel icon={<TbSettings />} label="Settings" />
    </Button>

    <GroupDrawer>
      <Button size="sm" variant="ghost" color="rgba(255,255,255,0.5)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} px={3} py={2} height="auto">
        <IconWithLabel icon={<TbUsers />} label="Contacts" />
      </Button>
    </GroupDrawer>

    <HistoryDrawer>
      <Button size="sm" variant="ghost" color="rgba(255,255,255,0.5)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} px={3} py={2} height="auto">
        <IconWithLabel icon={<TbClock />} label="History" />
      </Button>
    </HistoryDrawer>

    <Button onClick={onNewHistory} size="sm" variant="ghost" color="rgba(255,255,255,0.5)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} px={3} py={2} height="auto">
      <IconWithLabel icon={<TbPlus />} label="New" />
    </Button>

    <Menu.Root>
      <Menu.Trigger as={Button} size="sm" variant="ghost" color="rgba(255,255,255,0.5)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} px={3} py={2} height="auto">
        <IconWithLabel icon={<TbStack2 />} label="Layers" />
      </Menu.Trigger>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.RadioItemGroup value={currentMode}>
            <Menu.RadioItem value="window" onClick={() => setMode('window')}>
              <Menu.ItemIndicator />
              Live Mode
            </Menu.RadioItem>
            <Menu.RadioItem
              value="pet"
              onClick={() => { if (isElectron) setMode('pet'); }}
              disabled={!isElectron}
              title={!isElectron ? "Pet mode is only available in desktop app" : undefined}
            >
              <Menu.ItemIndicator />
              Pet Mode
            </Menu.RadioItem>
          </Menu.RadioItemGroup>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  </Box>
));

HeaderButtons.displayName = 'HeaderButtons';

const SidebarContent = memo(({ 
  onSettingsOpen, 
  onNewHistory, 
  setMode, 
  currentMode,
  isElectron,
  ceceMode,
}: HeaderButtonsProps & { ceceMode: string }) => (
  <Box {...sidebarStyles.sidebar.content}>
    <CeceHeader ceceMode={ceceMode} />
    <Box {...sidebarStyles.sidebar.header}>
      <HeaderButtons
        onSettingsOpen={onSettingsOpen}
        onNewHistory={onNewHistory}
        setMode={setMode}
        currentMode={currentMode}
        isElectron={isElectron}
      />
    </Box>
    <ChatHistoryPanel />
    <BottomTab />
  </Box>
));

SidebarContent.displayName = 'SidebarContent';

function Sidebar({ isCollapsed = false, onToggle }: SidebarProps): JSX.Element {
  const {
    settingsOpen,
    onSettingsOpen,
    onSettingsClose,
    createNewHistory,
    setMode,
    currentMode,
    isElectron,
  } = useSidebar();

  const [ceceMode, setCeceMode] = useState('customer');

  useEffect(() => {
    const baseUrl = localStorage.getItem('baseUrl') || '';
    fetch(`${baseUrl}/api/mode`)
      .then((r) => r.json())
      .then((d) => setCeceMode(d.mode || 'customer'))
      .catch(() => {});

    const interval = setInterval(() => {
      fetch(`${baseUrl}/api/mode`)
        .then((r) => r.json())
        .then((d) => setCeceMode(d.mode || 'customer'))
        .catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box {...sidebarStyles.sidebar.container(isCollapsed)}>
      <ToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />

      {!isCollapsed && !settingsOpen && (
        <SidebarContent
          onSettingsOpen={onSettingsOpen}
          onNewHistory={createNewHistory}
          setMode={setMode}
          currentMode={currentMode}
          isElectron={isElectron}
          ceceMode={ceceMode}
        />
      )}

      {!isCollapsed && settingsOpen && (
        <SettingUI
          open={settingsOpen}
          onClose={onSettingsClose}
          onToggle={onToggle}
        />
      )}
    </Box>
  );
}

export default Sidebar;
