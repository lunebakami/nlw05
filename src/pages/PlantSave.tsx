import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { format, isBefore } from 'date-fns';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { SvgFromUri } from 'react-native-svg';

import { Button } from '../components/Button';

import waterDrop from '../assets/waterdrop.png'
import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantProps, savePlant } from '../libs/storage';

interface Params {
  plant: PlantProps
}

export function PlantSave() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');

  const navigation = useNavigation();
  const route = useRoute();
  const { plant } = route.params as Params; 
  
  
  function handleTimeChange(event: Event, dateTime: Date | undefined) {
    if (Platform.OS === 'android') {
      setShowDatePicker(oldState => !oldState);
    }

    if (dateTime && isBefore(dateTime, new Date())) {
      setSelectedDate(new Date());

      return Alert.alert('Escolha uma data futura! ⏰');
    }

    if (dateTime) {
      setSelectedDate(dateTime);
    }
  }

  function openAndroidDatePicker() {
    setShowDatePicker(oldState => !oldState);
  }

  async function handleSavePlant() {
    try {
      await savePlant({
        ...plant,
        dateTimeNotification: selectedDate
      });

      const params = {
        title: 'Tudo certo!',
        subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com muito cuidado!',
        buttonTitle: 'Muito Obrigado!',
        icon: 'hug',
        nextScreen: 'MyPlants'
      }

      navigation.navigate('Confirmation', params);
    } catch (error) {
      Alert.alert('Ocorreu um erro ao salvar a planta! 😢');
    }
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <View style={styles.container}>
        <View style={styles.plantInfo}>
          <SvgFromUri
            uri={plant.photo}
            width={150}
            height={150}
          />

          <Text style={styles.plantName}>
            {plant.name}
          </Text>
          <Text style={styles.plantAbout}>
            {plant.about}
          </Text>
        </View>
        
        <View style={styles.controller}>
          <View style={styles.tip}>
            <Image 
              source={waterDrop} 
              style={styles.tipImg}
            />

            <Text style={styles.tipText}>
              {plant.water_tips}
            </Text>
          </View>

          <Text style={styles.choose}>
            Escolha o melhor horário para ser lembrado!
          </Text>

          {
            showDatePicker && (
            <DateTimePicker 
            value={selectedDate}
            mode="time"
            display="spinner"
            onChange={handleTimeChange} 
            />)
          }

          {
            Platform.OS === 'android' && (
              <TouchableOpacity
                style={styles.datePickerButton} 
                onPress={() => {openAndroidDatePicker()}}
              >
                <Text style={styles.datePickerText}>
                  {`Mudar horário ${format(selectedDate, 'HH:mm')}`}
                </Text>
              </TouchableOpacity>
            ) 
          }

          <Button
            title="Cadastrar Planta"
            onPress={handleSavePlant}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.shape
  },
  plantInfo: {
    flex: 1,
    paddingHorizontal: 30,
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.shape 
  },
  plantName: {
    fontFamily: fonts.heading,
    fontSize: 24,
    color: colors.heading,
    marginTop: 15
  },
  plantAbout: {
    textAlign: 'center',
    fontFamily: fonts.text,
    fontSize: 17,
    color: colors.heading,
    marginTop: 10
  },
  controller: {
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: getBottomSpace() || 20
  },
  tip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.blue_light,
    padding: 20,
    borderRadius: 20,
    position: 'relative',
    bottom: 60
  },
  tipImg: {
    width: 56,
    height: 56
  },
  tipText: {
    flex: 1,
    marginLeft: 20,
    fontFamily: fonts.text,
    color: colors.blue,
    fontSize: 17,
    textAlign: 'justify'
  },
  choose: {
    textAlign: 'center',
    fontFamily: fonts.complement,
    color: colors.heading,
    fontSize: 12,
    marginBottom: 5
  },
  datePickerButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 40
  },
  datePickerText: {
    color: colors.heading,
    fontSize: 24,
    fontFamily: fonts.text
  }
});