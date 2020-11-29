import React from 'react';
import { StyleSheet, Modal, TouchableOpacity} from 'react-native';

export default function PopUp(props){
    const styles = StyleSheet.create({
        buttonClose:{
            backgroundColor:'#000000CC',
            alignItems:'center',
            justifyContent:'center',
            flex:1,
            zIndex:1
        }
    })
    return(
        <Modal
        animationType="fade"
        transparent={true}
        visible={props.open}
        onRequestClose={() => {
        props.onClose(!props.open);
        }}
        >
            <TouchableOpacity 
            style={styles.buttonClose} 
            onPress={()=>props.onClose(!props.open)}>
                {props.children}
            </TouchableOpacity>
        </Modal>
    );
}