import React from 'react';
import {Text, StyleSheet, TextProps} from 'react-native';

interface AppTextProps extends TextProps {
  size?: number; // Tamanho da fonte (padrão: 16)
  color?: string; // Cor do texto (padrão: branco no modo escuro)
  weight?:
    | 'normal'
    | 'bold'
    | '100'
    | '200'
    | '300'
    | '400'
    | '500'
    | '600'
    | '700'
    | '800'
    | '900';
}

const AppText: React.FC<AppTextProps> = ({
  size = 16,
  color = '#FFFFFF',
  weight = '400',
  style,
  ...props
}) => {
  return (
    <Text
      style={[styles.text, {fontSize: size, color, fontWeight: weight}, style]}
      {...props}>
      {props.children}
    </Text>
  );
};

export default AppText;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '400',
  },
});
