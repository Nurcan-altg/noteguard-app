import designConfig from '../../design.json';

// Design system utility functions
export const getDesignValue = (path: string): any => {
  const keys = path.split('.');
  let value: any = designConfig;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Color utilities
export const getColor = (colorName: string): string => {
  return getDesignValue(`theme.colors.${colorName}`) || getDesignValue(`theme.cssVariables.colors.--color-${colorName}`);
};

export const getGradient = (gradientName: string): string => {
  return getDesignValue(`theme.colors.gradient.${gradientName}`) || getDesignValue(`theme.cssVariables.colors.--gradient-${gradientName}`);
};

// Spacing utilities
export const getSpacing = (size: string): string => {
  return getDesignValue(`theme.spacing.${size}`) || getDesignValue(`theme.cssVariables.spacing.--space-${size}`);
};

// Typography utilities
export const getFontSize = (size: string): string => {
  return getDesignValue(`theme.typography.fontSize.${size}`) || getDesignValue(`theme.cssVariables.typography.--font-size-${size}`);
};

export const getFontWeight = (weight: string): number => {
  return getDesignValue(`theme.typography.fontWeight.${weight}`);
};

export const getFontFamily = (family: string): string => {
  return getDesignValue(`theme.typography.fontFamily.${family}`) || getDesignValue(`theme.cssVariables.typography.--font-family-${family}`);
};

// Border radius utilities
export const getBorderRadius = (size: string): string => {
  return getDesignValue(`theme.borderRadius.${size}`) || getDesignValue(`theme.cssVariables.layout.--border-radius-${size}`);
};

// Shadow utilities
export const getShadow = (size: string): string => {
  return getDesignValue(`theme.shadows.${size}`);
};

// Component styles
export const getComponentStyle = (component: string, variant?: string): any => {
  if (variant) {
    return getDesignValue(`components.${component}.${variant}`);
  }
  return getDesignValue(`components.${component}`);
};

// Breakpoint utilities
export const getBreakpoint = (size: string): string => {
  return getDesignValue(`layout.breakpoints.${size}`);
};

// Animation utilities
export const getAnimation = (type: string): string => {
  return getDesignValue(`animations.transitions.${type}`) || getDesignValue(`animations.duration.${type}`);
};

// CSS Variables for direct use
export const cssVariables = {
  colors: {
    primary: getColor('primary-500'),
    secondary: getColor('primary-600'),
    background: getColor('background-primary'),
    text: getColor('text-primary'),
    border: getColor('border'),
    success: getColor('success'),
    warning: getColor('warning'),
    error: getColor('error'),
    info: getColor('info')
  },
  spacing: {
    xs: getSpacing('xs'),
    sm: getSpacing('sm'),
    md: getSpacing('md'),
    lg: getSpacing('lg'),
    xl: getSpacing('xl'),
    '2xl': getSpacing('2xl'),
    '3xl': getSpacing('3xl')
  },
  typography: {
    fontFamily: getFontFamily('primary'),
    fontSize: {
      xs: getFontSize('xs'),
      sm: getFontSize('sm'),
      base: getFontSize('base'),
      lg: getFontSize('lg'),
      xl: getFontSize('xl'),
      '2xl': getFontSize('2xl'),
      '3xl': getFontSize('3xl'),
      '4xl': getFontSize('4xl')
    },
    fontWeight: {
      normal: getFontWeight('normal'),
      medium: getFontWeight('medium'),
      semibold: getFontWeight('semibold'),
      bold: getFontWeight('bold')
    }
  },
  borderRadius: {
    sm: getBorderRadius('sm'),
    md: getBorderRadius('md'),
    lg: getBorderRadius('lg'),
    xl: getBorderRadius('xl'),
    full: getBorderRadius('full')
  },
  shadows: {
    sm: getShadow('sm'),
    md: getShadow('md'),
    lg: getShadow('lg'),
    xl: getShadow('xl')
  }
};

// Tailwind CSS class generators
export const generateTailwindClasses = {
  // Background colors
  bgPrimary: 'bg-slate-500',
  bgSecondary: 'bg-slate-600',
  bgSuccess: 'bg-emerald-500',
  bgWarning: 'bg-amber-500',
  bgError: 'bg-red-500',
  bgInfo: 'bg-blue-500',
  
  // Text colors
  textPrimary: 'text-slate-800',
  textSecondary: 'text-slate-600',
  textSuccess: 'text-emerald-600',
  textWarning: 'text-amber-600',
  textError: 'text-red-600',
  textInfo: 'text-blue-600',
  
  // Border colors
  borderPrimary: 'border-slate-200',
  borderSecondary: 'border-slate-300',
  
  // Spacing
  p: {
    xs: 'p-1',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
    '2xl': 'p-12',
    '3xl': 'p-16'
  },
  
  px: {
    xs: 'px-1',
    sm: 'px-2',
    md: 'px-4',
    lg: 'px-6',
    xl: 'px-8',
    '2xl': 'px-12',
    '3xl': 'px-16'
  },
  
  py: {
    xs: 'py-1',
    sm: 'py-2',
    md: 'py-4',
    lg: 'py-6',
    xl: 'py-8',
    '2xl': 'py-12',
    '3xl': 'py-16'
  },
  
  m: {
    xs: 'm-1',
    sm: 'm-2',
    md: 'm-4',
    lg: 'm-6',
    xl: 'm-8',
    '2xl': 'm-12',
    '3xl': 'm-16'
  },
  
  mx: {
    xs: 'mx-1',
    sm: 'mx-2',
    md: 'mx-4',
    lg: 'mx-6',
    xl: 'mx-8',
    '2xl': 'mx-12',
    '3xl': 'mx-16'
  },
  
  my: {
    xs: 'my-1',
    sm: 'my-2',
    md: 'my-4',
    lg: 'my-6',
    xl: 'my-8',
    '2xl': 'my-12',
    '3xl': 'my-16'
  },
  
  // Border radius
  rounded: {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full'
  },
  
  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  },
  
  // Typography
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl'
  },
  
  font: {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }
};

// Component style generators
export const componentStyles = {
  card: {
    base: 'bg-white border border-slate-200 rounded-xl shadow-md p-4 md:p-6',
    hover: 'hover:shadow-lg transition-shadow duration-300'
  },
  
  button: {
    primary: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-md font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
    secondary: 'bg-white text-slate-600 border border-slate-200 px-6 py-3 rounded-md font-medium hover:bg-slate-50 hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-300',
    success: 'bg-emerald-500 text-white px-6 py-3 rounded-md font-medium hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
    warning: 'bg-amber-500 text-white px-6 py-3 rounded-md font-medium hover:bg-amber-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300',
    error: 'bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300'
  },
  
  input: {
    base: 'w-full px-4 py-3 border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300',
    error: 'border-red-300 focus:ring-red-500'
  },
  
  navigation: {
    item: 'px-4 py-3 rounded-md text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-800 transition-all duration-300',
    active: 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
  },
  
  metrics: {
    card: 'bg-white border border-slate-200 rounded-xl p-6 shadow-md',
    title: 'text-sm font-medium text-slate-600 mb-2',
    value: 'text-4xl font-bold text-slate-800 mb-1',
    change: 'text-xs font-medium'
  },
  
  table: {
    container: 'bg-white border border-slate-200 rounded-xl shadow-md overflow-hidden',
    header: 'bg-slate-50 text-slate-600 text-xs font-semibold uppercase tracking-wider px-4 py-3',
    row: 'px-4 py-4 border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200'
  },
  
  status: {
    badge: {
      success: 'px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800',
      warning: 'px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800',
      error: 'px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800',
      info: 'px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800'
    }
  }
};

export default {
  getDesignValue,
  getColor,
  getGradient,
  getSpacing,
  getFontSize,
  getFontWeight,
  getFontFamily,
  getBorderRadius,
  getShadow,
  getComponentStyle,
  getBreakpoint,
  getAnimation,
  cssVariables,
  generateTailwindClasses,
  componentStyles
};
