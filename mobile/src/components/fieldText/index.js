import React from 'react';
import {TextInput,Text,View} from 'react-native';
import styles from './styles';

export default function FieldText(props){
    return(
        <View style={[styles.container,(props.style || null )]}>
            <View style={styles.containerField}>
                {props.children && <View style={styles.icon}>{props.children}</View>}
                <TextInput
                    style={[styles.input,(props.error && styles.error,props.children ? {paddingLeft:30}: {paddingLeft:5})]}
                    value={props.value}
                    placeholder={props.placeholder}
                    onChangeText={(t)=>props.setText(t)}
                    secureTextEntry={props.password}
                    onSubmitEditing={(e)=>props.onSubmit(e)}
                />
            </View>
            {props.error ? <Text style={styles.textError}>{props.textError}</Text> : null}
        </View>
    );
}