/* eslint-disable react/require-default-props */
import {
  Box, Textarea, IconButton, HStack,
} from '@chakra-ui/react';
import { BsMicFill, BsMicMuteFill, BsPaperclip } from 'react-icons/bs';
import { IoHandRightSharp } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { InputGroup } from '@/components/ui/input-group';
import { footerStyles } from './footer-styles';
import AIStateIndicator from './ai-state-indicator';
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
    <FiChevronDown />
  </Box>
));

ToggleButton.displayName = 'ToggleButton';

const ActionButtons = memo(({ micOn, onMicToggle, onInterrupt }: ActionButtonsProps) => (
  <HStack gap={3}>
    <IconButton
      bg={micOn ? '#76B900' : '#dc2626'}
      color="white"
      borderRadius="full"
      width="56px"
      height="56px"
      minW="56px"
      boxShadow={micOn ? '0 4px 14px rgba(118, 185, 0, 0.35)' : '0 4px 14px rgba(220, 38, 38, 0.3)'}
      _hover={{ transform: 'scale(1.05)', boxShadow: micOn ? '0 6px 20px rgba(118, 185, 0, 0.45)' : '0 6px 20px rgba(220, 38, 38, 0.4)' }}
      transition="all 0.2s ease"
      onClick={onMicToggle}
      aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
    >
      {micOn ? <BsMicFill size="22" /> : <BsMicMuteFill size="22" />}
    </IconButton>
    <IconButton
      aria-label="Interrupt"
      bg="rgba(255,255,255,0.08)"
      color="rgba(255,255,255,0.7)"
      borderRadius="full"
      width="44px"
      height="44px"
      minW="44px"
      border="1px solid rgba(255,255,255,0.08)"
      _hover={{ bg: 'rgba(255,255,255,0.12)', color: '#f0f0f5' }}
      transition="all 0.2s ease"
      onClick={onInterrupt}
    >
      <IoHandRightSharp size="20" />
    </IconButton>
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
          <BsPaperclip size="20" />
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
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <AIStateIndicator />
            <ActionButtons
              micOn={micOn}
              onMicToggle={handleMicToggle}
              onInterrupt={handleInterrupt}
            />
          </Box>

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
