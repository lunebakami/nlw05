import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native'
import colors from '../styles/colors';

interface ButtonProps extends TouchableOpacityProps {
  title: number
}

export default function Button({ title, ...rest } : ButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.button} 
      activeOpacity={0.7}
      {...rest}
      >
        <Text style={styles.btnText}>
          { title }
        </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({

  button: {
    backgroundColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    marginBottom: 40,
    height: 56,
    width: 56
  },
  btnText: {
    color: colors.white,
    fontSize: 24
  }
})