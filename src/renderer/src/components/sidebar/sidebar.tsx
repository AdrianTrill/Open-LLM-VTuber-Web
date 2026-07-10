/* eslint-disable react/require-default-props */
import { Box, Button, Text, Badge, Menu } from '@chakra-ui/react';
import {
  FiSettings, FiClock, FiPlus, FiChevronLeft, FiUsers, FiLayers
} from 'react-icons/fi';
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
    <FiChevronLeft />
  </Box>
));

ToggleButton.displayName = 'ToggleButton';

const ModeMenu = memo(({ setMode, currentMode, isElectron }: {
  setMode: (mode: ModeType) => void
  currentMode: ModeType
  isElectron: boolean
}) => (
  <Menu.Root>
    <Menu.Trigger as={Button} aria-label="Mode Menu" title="Change Mode">
      <FiLayers />
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
            onClick={() => {
              if (isElectron) setMode('pet');
            }}
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
));

ModeMenu.displayName = 'ModeMenu';

const CeceHeader = memo(({ ceceMode }: { ceceMode: string }) => (
  <Box
    px={4}
    py={3}
    borderBottom="1px solid"
    borderColor="rgba(255, 255, 255, 0.06)"
    display="flex"
    alignItems="center"
    gap={3}
  >
    <Box
      w="36px"
      h="36px"
      borderRadius="10px"
      bg="#76B900"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      boxShadow="0 2px 8px rgba(118, 185, 0, 0.25)"
    >
      <Text fontSize="16px" fontWeight="800" color="white" lineHeight="1">C</Text>
    </Box>
    <Box flex={1}>
      <Text fontSize="15px" fontWeight="600" color="#f0f0f5" letterSpacing="-0.01em">
        CeCe AI
      </Text>
      <Text fontSize="11px" color="rgba(255,255,255,0.4)" mt="-1px">
        Beauty Consultant
      </Text>
    </Box>
    <Badge
      px={2}
      py={0.5}
      borderRadius="6px"
      fontSize="10px"
      fontWeight="600"
      textTransform="uppercase"
      letterSpacing="0.05em"
      bg={ceceMode === 'training' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(118, 185, 0, 0.12)'}
      color={ceceMode === 'training' ? '#f59e0b' : '#76B900'}
      border="1px solid"
      borderColor={ceceMode === 'training' ? 'rgba(245, 158, 11, 0.25)' : 'rgba(118, 185, 0, 0.2)'}
    >
      {ceceMode === 'training' ? 'Training' : 'Live'}
    </Badge>
  </Box>
));

CeceHeader.displayName = 'CeceHeader';

const HeaderButtons = memo(({ onSettingsOpen, onNewHistory, setMode, currentMode, isElectron }: HeaderButtonsProps) => (
  <Box display="flex" gap={1} px={2} py={1}>
    <Button onClick={onSettingsOpen} size="sm" variant="ghost" color="rgba(255,255,255,0.6)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} title="Settings">
      <FiSettings />
    </Button>

    <GroupDrawer>
      <Button size="sm" variant="ghost" color="rgba(255,255,255,0.6)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} title="Contacts">
        <FiUsers />
      </Button>
    </GroupDrawer>

    <HistoryDrawer>
      <Button size="sm" variant="ghost" color="rgba(255,255,255,0.6)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} title="History">
        <FiClock />
      </Button>
    </HistoryDrawer>

    <Button onClick={onNewHistory} size="sm" variant="ghost" color="rgba(255,255,255,0.6)" _hover={{ color: '#f0f0f5', bg: 'rgba(255,255,255,0.06)' }} title="New conversation">
      <FiPlus />
    </Button>

    <ModeMenu setMode={setMode} currentMode={currentMode} isElectron={isElectron} />
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
