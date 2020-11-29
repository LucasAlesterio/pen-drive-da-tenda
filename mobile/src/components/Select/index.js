import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Alert, StyleSheet, Button,Modal, Dimensions, TouchableOpacity} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../../global.json';
import PopUp from '../../components/popUp';
import {AntDesign} from '@expo/vector-icons';

export default function Select(props){
    const [open,setOpen] = useState(false);
    const [selected,setSelected] = useState('');
    const styles = StyleSheet.create({
        buttonText:{
            color: colors.amarelo,
            fontSize: 20,
            paddingRight:10
        },
        button:{
            width:'auto',
            height:'auto',
            padding:10
        },
        containerButton:{
            borderBottomWidth:1,
            borderBottomColor:colors.amarelo, 
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'center'
        },
        containerItens:{
            flex:1,
            alignItems:'center',
            justifyContent:'center',
        },
        scroll:{
            padding:10
        },
        item:{
            borderBottomWidth:1,
            borderBottomColor:colors.amarelo,
        },  
        itemText:{
            color:colors.amarelo,
            fontSize:25,
        },
        itemButton:{
            width:'100%',
            alignItems:'center',
            minHeight:40,
            paddingVertical:8
        },
        buttonText2:{
            color: colors.cinzaMedio,
            fontSize: 20,
            paddingRight:10
        },
        containerButton2:{
        },
        button2:{
            width:'auto',
            height:'auto',
            padding:10,
            flexDirection:'row',
            alignItems:'center',
            justifyContent:'space-between',
            backgroundColor:colors.cinzaClaro,
            borderRadius:5,
            width:'100%'
        },
    })
    function onSelect(value){

        if(props.label){
            setSelected(value[0]);
            props.setValue(value[1]);
        }else{
            props.setValue(value);
            setSelected(value);
        }
        setOpen(false);
    }
    return(
        <>
            {props.type ?
            <RectButton  style={styles.button2} onPress={()=>setOpen(true)}> 
                <Text style={styles.buttonText2}>{selected || props.placeholder}</Text>
                <AntDesign name="down" size={15} color={colors.cinzaMedio}/>
            </RectButton>
            :<View style={styles.containerButton}>
                <RectButton  style={styles.button} onPress={()=>setOpen(true)}> 
                    <Text style={styles.buttonText}>{selected || props.placeholder}</Text>
                </RectButton>
                <AntDesign name="down" size={15} color={colors.amarelo}/>
            </View>}
            <PopUp open={open} onClose={(a)=>setOpen(a)}>
                <View style={{height:'auto', maxHeight:'70%', width:300, maxWidth:'100%'}}>
                <ScrollView 
                snapToAlignment='center'
                style={styles.scroll}
                >
                    {props.items ? (props.label ? 
                    props.items.map((item)=>{
                        return (
                        <View key={item[1]} style={styles.item}>
                            <TouchableOpacity style={styles.itemButton} onPress={()=>onSelect(item)}>
                                <Text style={styles.itemText}> {item[0]} </Text>
                            </TouchableOpacity>
                        </View>)
                    }):
                    props.items.map((item)=>{
                        return (
                        <View key={item} style={styles.item}>
                            <TouchableOpacity style={styles.itemButton} onPress={()=>onSelect(item)}>
                                <Text style={styles.itemText}> {item} </Text>
                            </TouchableOpacity>
                        </View>)
                    })):null}
                </ScrollView>
                </View>
            </PopUp>
        </>
    );
}