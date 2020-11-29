import React, { useState, useEffect } from 'react';
import { View, Image, Text, ScrollView } from 'react-native';
import { AntDesign, FontAwesome, Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import Button from '../../components/button';
//import { useNavigation } from '@react-navigation/native';
//import api from '../../services/api';
import styles from './styles';
import GoBack from '../../components/goBack';

export default function LinkProfile(){

    return(
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.top}>
                <GoBack/>
                <RectButton style={{marginTop:50}}><AntDesign name='hearto' size={40} color='#C2C2C2'/></RectButton>
            </View>
            <Text style={styles.title}>Pedidos pra Cachorro: Au Au pras Esfinges</Text>
            <View style={styles.photo}>
                <Image style={styles.image} source={{uri: 'https://i.pinimg.com/564x/62/ca/d4/62cad433b44e8c82b00d37edc313aadc.jpg'}}/>
                <RectButton style={styles.stars}>
                    <FontAwesome name='star' size={30} color='#FFEB0A'/>
                    <FontAwesome name='star' size={30} color='#FFEB0A'/>
                    <FontAwesome name='star' size={30} color='#FFEB0A'/>
                    <FontAwesome name='star-half-o' size={30} color='#FFEB0A'/>
                    <FontAwesome name='star-o' size={30} color='#FFEB0A'/>
                </RectButton>
            </View>
            <View style={styles.buttons}>
                <RectButton style={styles.button}>
                    <Text style={styles.bTitle}>Copiar</Text>
                    <Feather name="copy" size={30} color="#151515" />
                </RectButton>
                <RectButton style={styles.button}>
                    <Text style={styles.bTitle}>Abrir</Text>
                    <AntDesign name='link' size={30} color='#151515'/>
                </RectButton>
            </View>
            <View style={styles.box}>
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </Text>
            </View>
            <View style={styles.box}>
                <View style={styles.type}>
                    <Text style={styles.typeName}>
                        Filme
                    </Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagName}>
                        dois cachorros no egito
                    </Text>
                </View>
                <View style={styles.tag}>
                    <Text style={styles.tagName}>
                        au au pras esfinges
                    </Text>
                </View>
                    
            </View>
            </ScrollView>
        </View>
    );
}