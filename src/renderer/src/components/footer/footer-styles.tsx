import { SystemStyleObject } from '@chakra-ui/react';

interface FooterStyles {
  container: (isCollapsed: boolean) => SystemStyleObject
  toggleButton: SystemStyleObject
  actionButton: SystemStyleObject
  input: SystemStyleObject
  attachButton: SystemStyleObject
}

interface AIIndicatorStyles {
  container: SystemStyleObject
  text: SystemStyleObject
}

export const footerStyles: {
  footer: FooterStyles
  aiIndicator: AIIndicatorStyles
} = {
  footer: {
    container: (isCollapsed) => ({
      bg: isCollapsed ? 'transparent' : 'rgba(22, 25, 34, 0.9)',
      backdropFilter: 'blur(12px)',
      borderTopRadius: isCollapsed ? 'none' : '14px',
      transform: isCollapsed ? 'translateY(calc(100% - 24px))' : 'translateY(0)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      height: '100%',
      position: 'relative',
      overflow: isCollapsed ? 'visible' : 'hidden',
    }),
    toggleButton: {
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      color: 'rgba(255, 255, 255, 0.5)',
      _hover: { color: '#f0f0f5' },
      bg: 'transparent',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    },
    actionButton: {
      borderRadius: 'full',
      width: '56px',
      height: '56px',
      minW: '56px',
    },
    input: {
      bg: '#1c2030',
      border: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      height: '80px',
      borderRadius: '12px',
      fontSize: '18px',
      pl: '12',
      pr: '4',
      color: '#f0f0f5',
      _placeholder: {
        color: 'rgba(255, 255, 255, 0.35)',
      },
      _focus: {
        borderColor: 'rgba(118, 185, 0, 0.4)',
        bg: '#1c2030',
        boxShadow: '0 0 0 1px rgba(118, 185, 0, 0.2)',
      },
      resize: 'none',
      minHeight: '80px',
      maxHeight: '80px',
      py: '0',
      display: 'flex',
      alignItems: 'center',
      paddingTop: '28px',
      lineHeight: '1.4',
    },
    attachButton: {
      position: 'absolute',
      left: '1',
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'rgba(255, 255, 255, 0.5)',
      zIndex: 2,
      _hover: {
        bg: 'transparent',
        color: '#f0f0f5',
      },
    },
  },
  aiIndicator: {
    container: {
      color: 'rgba(255,255,255,0.6)',
      px: '12px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    text: {
      fontSize: '12px',
      fontWeight: '500',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  },
};
