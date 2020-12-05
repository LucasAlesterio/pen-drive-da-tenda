import React,{useState, useEffect} from 'react';
import {View, Image, TouchableHighlight} from 'react-native';
import styles from './styles';
import * as ImagePicker from 'expo-image-picker';
import colors from '../../global.json';
import { Feather} from '@expo/vector-icons';

export default function InputImageLink(props){
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
                style={styles.image}
                />
                :
                (props.value && !image ? 
                <Image
                source={{uri: props.value}}
                style={styles.image}
                />
                :<View style={styles.icon}>
                    <Feather name="camera" size={50} color={colors.amarelo}/>
                </View>
                )
            }
            </TouchableHighlight>
        </View>
    );
}