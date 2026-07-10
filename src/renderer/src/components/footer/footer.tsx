/* eslint-disable react/require-default-props */
import {
  Box, Textarea, IconButton, HStack,
} from '@chakra-ui/react';
import { TbMicrophone, TbMicrophoneOff, TbPaperclip, TbHandStop, TbChevronDown, TbSend } from 'react-icons/tb';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { footerStyles } from './footer-styles';
import { useFooter } from '@/hooks/footer/use-footer';

interface FooterProps {
  isCollapsed?: boolean
  onToggle?: () => void
}

interface ToggleButtonProps {
  isCollapsed: boolean
  onToggle?: () => void
}

const ToggleButton = memo(({ isCollapsed, onToggle }: ToggleButtonProps) => (
  <Box
    {...footerStyles.footer.toggleButton}
    onClick={onToggle}
    color="rgba(255,255,255,0.35)"
    style={{
      transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
    }}
  >
    <TbChevronDown />
  </Box>
));

ToggleButton.displayName = 'ToggleButton';

function Footer({ isCollapsed = false, onToggle }: FooterProps): JSX.Element {
  const { t } = useTranslation();
  const {
    inputValue,
    handleInputChange,
    handleKeyPress,
    handleCompositionStart,
    handleCompositionEnd,
    handleInterrupt,
    handleMicToggle,
    micOn,
  } = useFooter();

  return (
    <Box {...footerStyles.footer.container(isCollapsed)}>
      <ToggleButton isCollapsed={isCollapsed} onToggle={onToggle} />

      <Box px="3" pb="3">
        <HStack width="100%" gap={2} alignItems="flex-end">
          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} flexShrink={0}>
            <IconButton
              bg={micOn ? '#22c55e' : '#dc2626'}
              color="white"
              borderRadius="full"
              width="40px"
              height="40px"
              minW="40px"
              _hover={{ opacity: 0.85 }}
              transition="all 0.15s ease"
              onClick={handleMicToggle}
              aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
              title={micOn ? 'Microphone on — click to mute' : 'Microphone off — click to unmute'}
            >
              {micOn ? <TbMicrophone size="18" /> : <TbMicrophoneOff size="18" />}
            </IconButton>
            <Box fontSize="10px" color="rgba(255,255,255,0.4)" lineHeight="1" userSelect="none">Mic</Box>
          </Box>

          <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} flexShrink={0}>
            <IconButton
              aria-label="Push to talk / interrupt"
              bg="rgba(255,255,255,0.06)"
              color="rgba(255,255,255,0.6)"
              borderRadius="full"
              width="40px"
              height="40px"
              minW="40px"
              border="1px solid rgba(255,255,255,0.06)"
              _hover={{ bg: 'rgba(255,255,255,0.1)', color: '#f0f0f5' }}
              transition="all 0.15s ease"
              onClick={handleInterrupt}
              title="Push to talk / interrupt"
            >
              <TbHandStop size="18" />
            </IconButton>
            <Box fontSize="10px" color="rgba(255,255,255,0.4)" lineHeight="1" userSelect="none">Talk</Box>
          </Box>

          <Box position="relative" flex={1}>
            <IconButton
              aria-label="Attach file"
              variant="ghost"
              position="absolute"
              left="1"
              top="50%"
              transform="translateY(-50%)"
              color="rgba(255,255,255,0.4)"
              zIndex={2}
              size="sm"
              _hover={{ bg: 'transparent', color: '#f0f0f5' }}
            >
              <TbPaperclip size="18" />
            </IconButton>
            <Textarea
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              placeholder={t('footer.typeYourMessage')}
              bg="#1c2030"
              border="1px solid"
              borderColor="rgba(255,255,255,0.06)"
              borderRadius="10px"
              fontSize="14px"
              pl="10"
              pr="10"
              color="#f0f0f5"
              _placeholder={{ color: 'rgba(255,255,255,0.3)' }}
              _focus={{
                borderColor: 'rgba(255, 255, 255, 0.15)',
                bg: '#1c2030',
                boxShadow: 'none',
              }}
              resize="none"
              minHeight="42px"
              maxHeight="42px"
              height="42px"
              py="10px"
              lineHeight="1.4"
            />
            <IconButton
              aria-label="Send message"
              variant="ghost"
              position="absolute"
              right="1"
              top="50%"
              transform="translateY(-50%)"
              color="rgba(255, 255, 255, 0.4)"
              zIndex={2}
              size="sm"
              _hover={{ bg: 'transparent', color: '#f0f0f5' }}
            >
              <TbSend size="18" />
            </IconButton>
          </Box>
        </HStack>
      </Box>
    </Box>
  );
}

export default Footer;
