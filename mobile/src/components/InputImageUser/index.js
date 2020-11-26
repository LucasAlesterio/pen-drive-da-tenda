import React,{useState, useEffect} from 'react';
import {View, Alert, Text, Image,Button,TouchableHighlight} from 'react-native';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import FieldText from '../../components/fieldText';
//import Button from '../../components/button';
import api from '../../service/api';
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import colors from '../../global.json';
import { Feather} from '@expo/vector-icons';

export default function InputImageUser(props){
    const [image,setImage] = useState('');
    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
            }
        })();
    }, []);
    

    async function imagePickerCall(){
        const data = await ImagePicker.launchImageLibraryAsync({
        base64:true,
        quality:0.85,
        mediaTypes: ImagePicker.MediaTypeOptions.Images 
        });
        if (data.cancelled) {
            return;
        }
        if (!data.uri) {
            return;
        }
        //console.log(data);
        setImage(data);
        props.setImg(`data:image/jpeg;base64,${data.base64}`);
    }

    return(
        <View style={styles.container}>
            <TouchableHighlight style={styles.button} onPress={imagePickerCall}>
                {image ? 
                <Image
                source={{uri: image.uri}}
                style={{width:200,height:200,borderRadius:100,borderWidth:2,borderColor:colors.amarelo}}
                />
                :
                <View style={styles.icon}>
                    <Feather name="camera" size={50} color={colors.amarelo}/>
                </View>
            }
            </TouchableHighlight>
        </View>
    );
}