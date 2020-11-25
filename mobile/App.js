import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {AppLoading} from 'expo';
import AppStack from './src/routes/AppStack';

import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import { Righteous_400Regular } from '@expo-google-fonts/righteous';

export default function App() {
  let [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Righteous_400Regular
  });
  
  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <>
        <AppStack/>
        <StatusBar style="light"/>
      </>
    );
  }
}
