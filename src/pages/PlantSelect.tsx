import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator
} from 'react-native';

import { Header } from '../components/Header';
import { EnvironmentButton } from '../components/EnvironmentButton';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Load } from '../components/Load';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import api from '../services/api';

interface EnvironmentProps {
  key: string,
  title: string
}

interface PlantsProps {
  id: string,
  name: string,
  about: string,
  water_tips: string,
  photo: string,
  environments: [string],
  frequency: {
    times: number,
    repeat_every: string
  }
}

export function PlantSelect() {
  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantsProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantsProps[]>([]);
  const [selectedEnvironment, setSelectedEnvironment] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false);

  async function fetchPlants(){
    const { data } = await api.get(`/plants?_sort=name&_order=asc&_page=${page}&_limit=8`);

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setPlants(oldValue => [...oldValue, ...data]);
      setFilteredPlants(oldValue => [...oldValue, ...data]);
    } else { 
      setPlants(data);
      setFilteredPlants(data);
      setPage(oldValue => oldValue + 1 );
    }
    setLoading(false);
    setLoadingPage(false);
  }

  function handleSelectEnvironment(environment: string) {
    setSelectedEnvironment(environment);

    if(environment === 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter(plant => {
      return plant.environments.includes(environment);
    });

    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if(distance < 1) {
      return;
    }

    setLoadingPage(true);
    setPage(oldValue => oldValue + 1 );

    fetchPlants();
  }

  useEffect(() => {
    async function fetchEnvironment(){
      const { data } = await api.get('/plants_environments?_sort=title&_order=asc');
    
      setEnvironments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...data
      ]);
    }

    fetchEnvironment();
  },[]);

  useEffect(() => {
    fetchPlants();
  },[]);

  if(loading) {
    return <Load />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header/>

        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          data={environments}
          renderItem={({ item }) => (
            <EnvironmentButton 
              title={item.title} 
              active={item.key === selectedEnvironment}
              onPress={() => handleSelectEnvironment(item.key)}
            />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          ListHeaderComponent={<View />}
          ListHeaderComponentStyle={{ marginRight: 32 }}
        />
      </View>

      <View style={styles.plantsList}>
        <FlatList
          data={filteredPlants}
          renderItem={({ item }) => (
            <PlantCardPrimary data={item} />
          )}  
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.2}
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)}
          ListFooterComponent={
            loadingPage ? 
            <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>

    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontSize: 17,
    fontFamily: fonts.text,
    lineHeight: 20,
    color: colors.heading
  },
  environmentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginVertical: 32
  },
  plantsList: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
});