import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export interface PlantProps {
  id: string,
  name: string,
  about: string,
  water_tips: string,
  photo: string,
  environments: [string],
  frequency: {
    times: number,
    repeat_every: string
  },
  dateTimeNotification: Date
}

export interface SavedPlantProps {
  [id: string]: {
    data: PlantProps
  }
}

export async function savePlant(plant: PlantProps) : Promise<void>{
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const oldPlants = data ? (JSON.parse(data) as SavedPlantProps) : {};

    const newPlant = {
      [plant.id]: {
        data: plant
      }
    }

    await AsyncStorage.setItem('@plantmanager:plants', 
      JSON.stringify({
        ...newPlant,
        ...oldPlants
      })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function getPlants() : Promise<PlantProps[]>{
  try {
    const data = await AsyncStorage.getItem('@plantmanager:plants');
    const plants = data ? (JSON.parse(data) as SavedPlantProps) : {};

    const formattedPlants = Object.keys(plants).map((plant) => {
      return {
        ...plants[plant].data,
        hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
      }
    }).sort((plantA, plantB) => 
      Math.floor(
        new Date(plantA.dateTimeNotification).getTime() / 1000 -
        Math.floor(new Date(plantB.dateTimeNotification).getTime() / 1000)
      )
    );

    return formattedPlants;
  } catch (error) {
    throw new Error(error);
  }
}