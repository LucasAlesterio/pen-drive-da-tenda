import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

export default function FieldText(props){
    return(
        <TextInput
            style={styles.input}
            value={props.value}
            placeholder={props.placeholder}
            onChangeText={(t)=>props.setText(t)}
            secureTextEntry={props.password}
        />
    );
}