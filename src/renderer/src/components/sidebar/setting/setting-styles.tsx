const isElectron = window.api !== undefined;
export const settingStyles = {
  settingUI: {
    container: {
      width: '100%',
      height: '100%',
      p: 4,
      gap: 4,
      position: 'relative',
      overflowY: 'auto',
      css: {
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          bg: 'transparent',
        },
        '&::-webkit-scrollbar-thumb': {
          bg: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 'full',
        },
      },
    },
    header: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    },
    title: {
      ml: 4,
      fontSize: 'lg',
      fontWeight: 'bold',
    },
    tabs: {
      root: {
        width: '100%',
        variant: 'plain' as const,
        colorPalette: 'gray',
      },
      content: {},
      trigger: {
        color: 'rgba(255, 255, 255, 0.45)',
        css: {
          fontSize: '11px',
          padding: '5px 10px',
          minWidth: 'unset',
          borderRadius: '6px',
          transition: 'all 0.15s ease',
        },
        _selected: {
          color: '#fff',
          bg: 'rgba(118, 185, 0, 0.15)',
        },
        _hover: {
          color: 'rgba(255, 255, 255, 0.85)',
          bg: 'rgba(255, 255, 255, 0.05)',
        },
      },
      list: {
        display: 'flex',
        flexWrap: 'wrap' as const,
        justifyContent: 'flex-start',
        width: '100%',
        borderBottom: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        mb: 4,
        pb: 2,
        pl: 0,
        css: {
          gap: '4px 6px',
        },
      },
    },
    footer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 2,
      mt: 'auto',
      pt: 4,
      borderTop: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    drawerContent: {
      bg: '#0f1117',
      maxWidth: '540px',
      height: isElectron ? 'calc(100vh - 30px)' : '100vh',
      borderRight: '1px solid',
      borderColor: 'rgba(118, 185, 0, 0.15)',
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      position: 'relative',
      px: 6,
      py: 4,
      borderBottom: '1px solid',
      borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    drawerTitle: {
      color: '#f0f0f5',
      fontSize: 'lg',
      fontWeight: '600',
    },
    closeButton: {
      position: 'absolute',
      right: 1,
      top: 1,
      color: 'rgba(255, 255, 255, 0.6)',
    },
  },
  general: {
    container: {
      align: 'stretch',
      gap: 6,
      p: 4,
    },
    field: {
      label: {
        color: 'rgba(255, 255, 255, 0.7)',
      },
    },
    select: {
      root: {
        colorPalette: 'gray',
        bg: '#1c2030',
      },
      trigger: {
        bg: '#1c2030',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        _hover: {
          borderColor: 'rgba(118, 185, 0, 0.3)',
        },
      },
    },
    input: {
      bg: '#1c2030',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      _hover: {
        borderColor: 'rgba(118, 185, 0, 0.3)',
      },
    },
    buttonGroup: {
      gap: 4,
      width: '100%',
    },
    button: {
      width: '50%',
      variant: 'outline' as const,
      bg: '#76B900',
      color: 'white',
      borderColor: '#76B900',
      _hover: {
        bg: '#6aaa00',
      },
    },
    fieldLabel: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  common: {
    field: {
      orientation: 'horizontal' as const,
    },
    fieldLabel: {
      fontSize: 'sm',
      color: 'rgba(255, 255, 255, 0.7)',
      whiteSpace: 'nowrap' as const,
    },
    switch: {
      size: 'md' as const,
      colorPalette: 'green' as const,
      variant: 'solid' as const,
    },
    numberInput: {
      root: {
        pattern: '[0-9]*\\.?[0-9]*',
        inputMode: 'decimal' as const,
      },
      input: {
        bg: '#1c2030',
        borderColor: 'rgba(255, 255, 255, 0.08)',
        _hover: {
          borderColor: 'rgba(118, 185, 0, 0.3)',
        },
      },
    },
    container: {
      gap: 8,
      maxW: 'sm',
      css: { '--field-label-width': '120px' },
    },
    input: {
      bg: '#1c2030',
      borderColor: 'rgba(255, 255, 255, 0.08)',
      _hover: {
        borderColor: 'rgba(118, 185, 0, 0.3)',
      },
    },
  },
  live2d: {
    container: {
      gap: 8,
      maxW: 'sm',
      css: { '--field-label-width': '120px' },
    },
    emotionMap: {
      title: {
        fontWeight: 'bold',
        mb: 4,
      },
      entry: {
        mb: 2,
      },
      button: {
        colorPalette: 'green',
        mt: 2,
      },
      deleteButton: {
        colorPalette: 'red',
      },
    },
  },
};
