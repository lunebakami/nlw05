import React from 'react';
import { 
  Text,
  StyleSheet
} from 'react-native';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface EnvironmentButtonProps extends RectButtonProps {
  title: string,
  active?: boolean // ? significa que é opcional
}

export function EnvironmentButton({
  title, active = false, ...rest
} : EnvironmentButtonProps) {
  return (
    <RectButton 
      style={[
        styles.button,
        active && styles.buttonActive
      ]}
      {...rest}
    >
      <Text style={[
        styles.btnText,
        active && styles.btnTextActive
        ]}>
        { title }
      </Text>
    </RectButton>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.shape,
    height: 40,
    width: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 10
  },
  buttonActive: {
    backgroundColor: colors.green_light
  },
  btnText: {
    color: colors.heading,
    fontFamily: fonts.text
  },
  btnTextActive: {
    color: colors.green_dark,
    fontFamily: fonts.heading
  } 
});