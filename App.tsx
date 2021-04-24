import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';

import Routes from './src/routes';

import { 
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';
import * as Notifications from 'expo-notifications';

export default function App() {
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });

  useEffect(() => {
    // const subscription = Notifications.addNotificationReceivedListener(
    //   async notification => {
    //     const data = notification.request.content.data.plant as PlantProps;
    //     console.log(data);
    //   }  
    // )

    // return () => subscription.remove();

    async function notifications() {
      // await Notifications.cancelAllScheduledNotificationsAsync(); // DELETA TODAS AS NOTIFICAÇÕES
      const data = await Notifications.getAllScheduledNotificationsAsync(); // PEGA TODAS AS NOTIFICAÇÕES
      console.log(data);
    }

    notifications();
  },[]);

  if (!fontsLoaded) {
    return <AppLoading />
  }

  return (
    <Routes />
  )
}
