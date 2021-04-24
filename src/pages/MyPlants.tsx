import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  Text,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { getPlants, PlantProps, removePlant } from '../libs/storage';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '../components/Header';

import waterDrop from '../assets/waterdrop.png'

import colors from '../styles/colors';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';

export function MyPlants(){
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  useEffect(() => {
    async function loadPlants() {
      const plants = await getPlants();
    
      const nextTime = formatDistance(
        new Date(plants[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWaterd(`Não esqueça de regar a ${plants[0].name} à ${nextTime}.`);
      setMyPlants(plants);
      setLoading(false);
    }

    loadPlants();
  },[]);

  function handleRemove(plant: PlantProps) {
    Alert.alert('Remover', `Deseja remover a ${plant.name}?`,[
      {
        text: 'Não 🙏',
        style: 'cancel'
      },
      {
        text: 'Sim 👍',
        onPress: async () => {
          try {
            await removePlant(plant.id);
          
            setMyPlants((oldData) => (
              oldData.filter((item) => item.id !== plant.id)
            ));
          } catch (error) {
            Alert.alert('Não foi possível remover a planta 😢');
          }
        }
      }
    ]);
  }

  if (loading) {
    return <Load />
  }

  return (
    <View style={styles.container}>
      <Header/>

      <View style={styles.spotlight}>
        <Image 
          source={waterDrop}
          style={styles.spotlightImage}
        />

        <Text style={styles.spotlightText}>
          {nextWaterd}
        </Text>
      </View>
      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList 
          data={myPlants}
          keyExtractor={plant => String(plant.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary 
              data={item} 
              handleRemove={() => handleRemove(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
        >

        </FlatList>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20
  }
});