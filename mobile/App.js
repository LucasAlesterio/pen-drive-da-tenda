import React,{useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import {AppLoading} from 'expo';
import AppStack from './src/routes/AppStack';
import api from './src/service/api';
import { Roboto_400Regular, useFonts } from '@expo-google-fonts/roboto';
import { Righteous_400Regular } from '@expo-google-fonts/righteous';
import AsyncStorage from '@react-native-community/async-storage';
import { Alert} from 'react-native';
export default function App() {
  const [initial,setInitial]  = useState('');

  let [fontsLoaded] = useFonts({
      Roboto_400Regular,
      Righteous_400Regular
    });

async function testeToken(){
      const token = await AsyncStorage.getItem('token');
      var response = '';
        try{
            response = await api.get('/refreshToken',{ headers:{Authorization:token}});
            if(response.data){
              if(response.data.error){
                setInitial('Landing');
                return null;
              }
              if(response.data.token){
                await AsyncStorage.setItem('token',response.data.token);
                setInitial('Tabs');
                return null;
              }
            }
        }catch(error){
            console.log(error);
            Alert.alert('Erro ao obter Token');
        }
  }
  testeToken();
  
  if (!fontsLoaded || initial === '') {
    return <AppLoading />;
  } else {
    return (
      <>
        <AppStack initial={
          
        }/>
        <StatusBar style="light"/>
      </>
    );
  }
}
