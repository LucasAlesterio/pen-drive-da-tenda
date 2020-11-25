import React from 'react';
import { Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import styles from './styles';

export default function Landing(props){
    return(
        <RectButton
        style={styles.button}
        onPress={()=>props.onPress()}>
            <Text 
            style={styles.text}
            >{props.title}</Text>
        </RectButton>
    );
}