/* eslint-disable */
import { Box, Text } from '@chakra-ui/react';
import { useRef, useState, useCallback, useEffect } from 'react';
import { TbMicrophone, TbSettings } from 'react-icons/tb';
import { useAiState } from '@/context/ai-state-context';
import { useWebSocket } from '@/context/websocket-context';
import { useChatHistory } from '@/context/chat-history-context';
import { useVAD } from '@/context/vad-context';
import { useCeceMode } from '@/context/cece-mode-context';
import Subtitle from '@/components/canvas/subtitle';
import SettingUI from '@/components/sidebar/setting/setting-ui';

const QUICK_PROMPTS = ['Hair color tips', 'Skincare routine', 'Product recommendations'];

function WaveformBars() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap="4px" height="48px">
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <Box
          key={i}
          width="4px"
          borderRadius="2px"
          bg="rgba(255,255,255,0.6)"
          className="kiosk-waveform-bar"
          style={{ animationDelay: `${i * 0.12}s` }}
        />
      ))}
    </Box>
  );
}

// UI-only gate — add real auth/PIN before production
function StaffAccessGate({ onReveal }: { onReveal: () => void }) {
  const tapCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(() => {
    tapCountRef.current += 1;
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0;
      if (timerRef.current) clearTimeout(timerRef.current);
      onReveal();
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => { tapCountRef.current = 0; }, 3000);
  }, [onReveal]);

  return (
    <Box
      position="absolute"
      top={0}
      right={0}
      width="44px"
      height="44px"
      zIndex={20}
      cursor="default"
      onClick={handleTap}
    />
  );
}

function KioskOverlay(): JSX.Element {
  const { aiState } = useAiState();
  const { sendMessage } = useWebSocket();
  const { appendHumanMessage } = useChatHistory();
  const { micOn, startMic } = useVAD();
  const { switchCeceMode } = useCeceMode();

  const [staffVisible, setStaffVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isSpeaking = aiState === 'thinking-speaking';
  const isIdle = aiState === 'idle' || aiState === 'loading';

  const handleChipTap = useCallback((text: string) => {
    appendHumanMessage(text);
    sendMessage({ type: 'text-input', text, images: [] });
  }, [sendMessage, appendHumanMessage]);

  const handleScreenTap = useCallback(() => {
    if (isIdle && !micOn) {
      startMic();
    }
  }, [isIdle, micOn, startMic]);

  const handleStaffReveal = useCallback(() => {
    setStaffVisible(true);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => setStaffVisible(false), 10000);
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  if (settingsOpen) {
    return (
      <Box position="absolute" inset={0} zIndex={20} bg="#161922">
        <SettingUI
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          onToggle={() => {}}
        />
      </Box>
    );
  }

  return (
    <Box
      position="absolute"
      inset={0}
      zIndex={15}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-end"
      pb="60px"
      onClick={handleScreenTap}
    >
      <StaffAccessGate onReveal={handleStaffReveal} />

      {staffVisible && (
        <Box
          position="absolute"
          top="16px"
          right="16px"
          zIndex={25}
          display="flex"
          gap={2}
        >
          <Box
            as="button"
            px={3}
            py={2}
            borderRadius="10px"
            bg="rgba(15,17,23,0.8)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.1)"
            color="rgba(255,255,255,0.7)"
            fontSize="13px"
            display="flex"
            alignItems="center"
            gap={2}
            cursor="pointer"
            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSettingsOpen(true); }}
          >
            <TbSettings size={16} /> Settings
          </Box>
          <Box
            as="button"
            px={3}
            py={2}
            borderRadius="10px"
            bg="rgba(15,17,23,0.8)"
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.1)"
            color="rgba(255,255,255,0.7)"
            fontSize="13px"
            cursor="pointer"
            _hover={{ bg: 'rgba(255,255,255,0.1)' }}
            onClick={(e: React.MouseEvent) => { e.stopPropagation(); switchCeceMode('training'); }}
          >
            Switch to Training
          </Box>
        </Box>
      )}

      {isSpeaking && (
        <Box mb={4}>
          <WaveformBars />
        </Box>
      )}

      <Box mb={4} display="flex" justifyContent="center" width="60%" maxW="600px">
        <Subtitle />
      </Box>

      {isIdle && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap={6}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <Box display="flex" alignItems="center" gap={3}>
            <Box
              w="48px"
              h="48px"
              borderRadius="full"
              bg="rgba(255,255,255,0.08)"
              border="1px solid rgba(255,255,255,0.1)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              className="kiosk-pulse"
            >
              <TbMicrophone size={22} color="rgba(255,255,255,0.6)" />
            </Box>
            <Text
              fontSize="20px"
              fontWeight="500"
              color="rgba(255,255,255,0.7)"
              letterSpacing="-0.01em"
            >
              Tap or say hi to CeCe
            </Text>
          </Box>

          <Box display="flex" gap={2} flexWrap="wrap" justifyContent="center">
            {QUICK_PROMPTS.map((q) => (
              <Box
                key={q}
                as="button"
                px={4}
                py={2}
                borderRadius="20px"
                bg="rgba(255,255,255,0.06)"
                border="1px solid rgba(255,255,255,0.08)"
                color="rgba(255,255,255,0.65)"
                fontSize="14px"
                fontWeight="400"
                cursor="pointer"
                transition="all 0.15s ease"
                _hover={{ bg: 'rgba(255,255,255,0.1)', color: '#f0f0f5' }}
                onClick={(e: React.MouseEvent) => { e.stopPropagation(); handleChipTap(q); }}
              >
                {q}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default KioskOverlay;
