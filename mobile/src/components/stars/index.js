import React from 'react';
import { View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import colors from '../../global.json';
import { StyleSheet } from 'react-native';

export default function Stars(props){
    const n = props.average;
    const styles = StyleSheet.create({
        container:{
            flexDirection:'row'
        }
    });
    //<FontAwesome name="star" size={props.size} color={colors.amarelo}/>
    //<FontAwesome name="star-o" size={props.size} color={colors.amarelo}/> fill
    //<FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> half
    if(n === null || n === undefined){
        return(
            <View style={styles.container}>
                <FontAwesome name="star-o" size={props.size} color={colors.cinzaClaro}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.cinzaClaro}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.cinzaClaro}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.cinzaClaro}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.cinzaClaro}/> 
            </View>
            )
    }
    if(n===5){
        return(
        <View style={styles.container}>
            <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
        </View>
        )
    }
    if(n >=4){
        if(n<4.5){
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }else{
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> 
                </View>
            )
        }
    }
    if(n >=3){
        if(n<3.5){
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }else{
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }
    }
    if(n >=2){
        if(n<2.5){
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }else{
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }
    }
    if(n >=1){
        if(n<1.5){
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }else{
            return(
            <View style={styles.container}>
                <FontAwesome name="star" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> 
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
                <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            </View>
            )
        }
    }
    if(n>=0.5){
        return(
        <View style={styles.container}>
            <FontAwesome name="star-half-o" size={props.size} color={colors.amarelo}/> 
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
        </View>
        )
    }else{
        return(
        <View style={styles.container}>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/> 
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
            <FontAwesome name="star-o" size={props.size} color={colors.amarelo}/>
        </View>
        )
    }
}
