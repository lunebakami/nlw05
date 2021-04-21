import React from 'react';
import { 
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import { color } from 'react-native-reanimated';
import userImg from '../assets/nagatoro.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>Lune</Text>
      </View>

      <Image source={userImg} style={styles.profileImg}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 32,
    color: colors.heading,
    fontFamily: fonts.text
  },
  username: {
    fontSize: 32,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40
  },
  profileImg: {
    width: 70,
    height: 70,
    borderRadius: 35 // Pra deixar a imagem redonda basta usar metade dos pixels de altura e largura
  }
});