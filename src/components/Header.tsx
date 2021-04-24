import React, { useState, useEffect } from 'react';
import { 
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import userImg from '../assets/nagatoro.png';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

export function Header() {
  const [username, setUsername] = useState<string>();
  
  useEffect(() => {
    async function loadUsername() {
      const user = await AsyncStorage.getItem('@plantmanager:user');

      setUsername(user || '');
    }

    loadUsername();
  },[]);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{username}</Text>
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