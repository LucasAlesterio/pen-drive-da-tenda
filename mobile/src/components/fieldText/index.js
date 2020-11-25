import React from 'react';
import {TextInput,Text,View} from 'react-native';
import styles from './styles';

export default function FieldText(props){
    return(
        <View style={styles.container}>
            <TextInput
                style={props.error ? styles.error : styles.input}
                value={props.value}
                placeholder={props.placeholder}
                onChangeText={(t)=>props.setText(t)}
                secureTextEntry={props.password}
            />
            {props.error ? <Text style={styles.textError}>{props.textError}</Text> : null}
        </View>
    );
}