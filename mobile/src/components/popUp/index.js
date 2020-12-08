import React from 'react';
import { StyleSheet, Modal, TouchableOpacity, View, Dimensions} from 'react-native';


export default function PopUp(props){
    const vh = Dimensions.get('window').height;
    const styles = StyleSheet.create({
        buttonClose:{
            position:'absolute',
            backgroundColor:'#000000CC',
            alignItems:'center',
            justifyContent:'center',
            height:'100%',
            width:'100%'
        }
    })
    return(<>
        <Modal
        animationType="fade"
        transparent={true}
        visible={props.open}
        onRequestClose={() => {
        props.onClose(false);
        }}
        >
            <View  style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center' }}>
            <TouchableOpacity
            style={styles.buttonClose}
            onPress={()=>props.onClose(false)}
            />
                {props.children}
            </View>
        </Modal>
        </>
    );
}