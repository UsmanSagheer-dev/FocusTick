import React from 'react';
import {
  Text,
  TextProps,
  StyleSheet,
} from 'react-native';

export type AppTextVariant = 
  | 'heading1' 
  | 'heading2' 
  | 'heading3' 
  | 'body' 
  | 'caption' 
  | 'label'
  | 'subheading';

interface AppTextProps extends TextProps {
  variant?: AppTextVariant;
  color?: string;
  style?: any;
}

const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color,
  style,
  children,
  ...props
}) => {
  const getVariantStyle = () => {
    switch (variant) {
      case 'heading1':
        return styles.heading1;
      case 'heading2':
        return styles.heading2;
      case 'heading3':
        return styles.heading3;
      case 'subheading':
        return styles.subheading;
      case 'caption':
        return styles.caption;
      case 'label':
        return styles.label;
      case 'body':
      default:
        return styles.body;
    }
  };

  return (
    <Text
      style={[
        getVariantStyle(),
        color && { color },
        style,
      ]}
      {...props}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  heading1: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heading3: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subheading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  body: {
    fontSize: 15,
    color: '#FFFFFF',
  },
  caption: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 2,
  },
});

export default AppText;