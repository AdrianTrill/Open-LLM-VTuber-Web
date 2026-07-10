/* eslint-disable react/require-default-props */
import {
  Box, Textarea, IconButton, HStack,
} from '@chakra-ui/react';
import { TbMicrophone, TbMicrophoneOff, TbPaperclip, TbHandStop, TbChevronDown } from 'react-icons/tb';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@/components/ui/input-group';
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

interface ActionButtonsProps {
  micOn: boolean
  onMicToggle: () => void
  onInterrupt: () => void
}

interface MessageInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  onCompositionStart: () => void
  onCompositionEnd: () => void
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

const ActionButtons = memo(({ micOn, onMicToggle, onInterrupt }: ActionButtonsProps) => (
  <HStack gap={3}>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <IconButton
        bg={micOn ? '#76B900' : '#dc2626'}
        color="white"
        borderRadius="full"
        width="52px"
        height="52px"
        minW="52px"
        _hover={{ opacity: 0.9 }}
        transition="all 0.15s ease"
        onClick={onMicToggle}
        aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
        title={micOn ? 'Microphone on — click to mute' : 'Microphone off — click to unmute'}
      >
        {micOn ? <TbMicrophone size="22" /> : <TbMicrophoneOff size="22" />}
      </IconButton>
      <Box fontSize="10px" color="rgba(255,255,255,0.45)" lineHeight="1" userSelect="none">
        Mic
      </Box>
    </Box>
    <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
      <IconButton
        aria-label="Push to talk / interrupt"
        bg="rgba(255,255,255,0.08)"
        color="rgba(255,255,255,0.7)"
        borderRadius="full"
        width="44px"
        height="44px"
        minW="44px"
        border="1px solid rgba(255,255,255,0.08)"
        _hover={{ bg: 'rgba(255,255,255,0.12)', color: '#f0f0f5' }}
        transition="all 0.15s ease"
        onClick={onInterrupt}
        title="Push to talk / interrupt"
      >
        <TbHandStop size="20" />
      </IconButton>
      <Box fontSize="10px" color="rgba(255,255,255,0.45)" lineHeight="1" userSelect="none">
        Talk
      </Box>
    </Box>
  </HStack>
));

ActionButtons.displayName = 'ActionButtons';

const MessageInput = memo(({
  value,
  onChange,
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
}: MessageInputProps) => {
  const { t } = useTranslation();

  return (
    <InputGroup flex={1}>
      <Box position="relative" width="100%">
        <IconButton
          aria-label="Attach file"
          variant="ghost"
          {...footerStyles.footer.attachButton}
        >
          <TbPaperclip size="20" />
        </IconButton>
        <Textarea
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onCompositionStart={onCompositionStart}
          onCompositionEnd={onCompositionEnd}
          placeholder={t('footer.typeYourMessage')}
          {...footerStyles.footer.input}
        />
      </Box>
    </InputGroup>
  );
});

MessageInput.displayName = 'MessageInput';

function Footer({ isCollapsed = false, onToggle }: FooterProps): JSX.Element {
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

      <Box pt="0" px="4">
        <HStack width="100%" gap={4} alignItems="center">
          <ActionButtons
            micOn={micOn}
            onMicToggle={handleMicToggle}
            onInterrupt={handleInterrupt}
          />

          <MessageInput
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
          />
        </HStack>
      </Box>
    </Box>
  );
}

export default Footer;
