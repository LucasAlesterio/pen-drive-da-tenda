import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import colors from '../../global.json';
import { Feather } from '@expo/vector-icons';

export default function Tags({tags,edit,onDelete,type}){
    const styles = StyleSheet.create({
        container:{
            flex:1,
            flexWrap:'wrap',
            flexDirection:'row',
            paddingHorizontal:6,
        },
        tag:{
            backgroundColor: colors.amarelo,
            height: 45,
            paddingHorizontal: 15,
            justifyContent: 'space-between',
            borderRadius: 50,
            marginBottom: 12,
            marginHorizontal: 6,
            alignItems:'center',
            flexDirection:'row',
        },
        tagName:{
            fontFamily: 'Righteous_400Regular',
            color: colors.cinzaMedio,
            fontSize: 15,
        },
        x:{
            position:'absolute',
            right:0,
            padding:5
        },
        type:{
            backgroundColor: colors.cinzaMedio,
            height: 45,
            paddingHorizontal: 15,
            justifyContent: 'center',
            borderRadius: 50,
            borderColor: colors.amarelo,
            borderWidth: 1.5,
            marginBottom: 12,
            marginHorizontal: 6,
        },
        typeName:{
            fontFamily: 'Righteous_400Regular',
            color: colors.amarelo,
            fontSize: 15,
        },
    });
    return(
        <View style={styles.container}>
            {type ? 
            <View style={styles.type}>
                <Text style={styles.typeName}>{type}</Text> 
            </View> :null}
            {tags ?
                tags.map((tag)=>(
                    <View key={edit ? tag : tag._id} style={[styles.tag,(edit ? {paddingRight:30}:null )]}>
                        <Text style={styles.tagName}>
                            {edit ? tag : tag.name}
                        </Text>
                        {edit ? 
                            <RectButton style={styles.x} onPress={()=>onDelete(tag)}>
                                <Feather name="x" size={20} color={colors.cinzaMedio}/>
                            </RectButton>
                        :null}
                    </View>
                ))
            : null}
        </View>
    );
}