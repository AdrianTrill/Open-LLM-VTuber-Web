import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';
import { TbCamera, TbChevronRight } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { Tooltip } from '@/components/ui/tooltip';
import { sidebarStyles } from './sidebar-styles';
import { useCameraPanel } from '@/hooks/sidebar/use-camera-panel';

function LiveIndicator() {
  const { t } = useTranslation();

  return (
    <Box color="red.500" display="flex" alignItems="center" gap={2}>
      <Box w="8px" h="8px" borderRadius="full" bg="red.500" animation="pulse 2s infinite" />
      <Text fontSize="sm">{t('sidebar.live')}</Text>
    </Box>
  );
}

function VideoStream({
  videoRef,
  isStreaming,
}: {
  videoRef: React.RefObject<HTMLVideoElement>
  isStreaming: boolean
}) {
  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      style={sidebarStyles.cameraPanel.video}
      {...(isStreaming ? {} : { display: 'none' })}
    />
  );
}

function CameraPanel(): JSX.Element {
  const { t } = useTranslation();
  const {
    videoRef,
    error,
    isHovering,
    isStreaming,
    stream,
    toggleCamera,
    handleMouseEnter,
    handleMouseLeave,
  } = useCameraPanel();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isStreaming && !error) {
    return (
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
        onClick={toggleCamera}
      >
        <TbCamera size={16} />
        <Text fontSize="13px" flex={1}>Camera off</Text>
        <TbChevronRight size={14} />
      </Box>
    );
  }

  return (
    <Box {...sidebarStyles.cameraPanel.container}>
      <Box {...sidebarStyles.cameraPanel.header}>
        {isStreaming && <LiveIndicator />}
      </Box>

      <Tooltip
        showArrow
        content={isStreaming ? t('footer.cameraStopping') : t('footer.cameraControl')}
        open={isHovering && !error}
      >
        <Box
          {...sidebarStyles.cameraPanel.videoContainer}
          onClick={toggleCamera}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          cursor="pointer"
          position="relative"
          _hover={{
            bg: 'whiteAlpha.100',
          }}
        >
          {error ? (
            <Text color="red.300" fontSize="sm" textAlign="center">
              {error}
            </Text>
          ) : (
            <VideoStream videoRef={videoRef} isStreaming={isStreaming} />
          )}
        </Box>
      </Tooltip>
    </Box>
  );
}

export default CameraPanel;
