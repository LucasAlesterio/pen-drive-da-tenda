import React from 'react';
import { View} from 'react-native';
import FieldText from '../../components/fieldText';
import { RectButton } from 'react-native-gesture-handler';
import { Feather} from '@expo/vector-icons';
import colors from '../../global.json';

export default function FieldSearch(props){
    return(
        <View style={{width:'100%',alignItems:'center',flexDirection:'row',marginLeft:20}}>
            <FieldText placeholder={props.placeholder}
            value={props.value}
            setText={(t)=>props.setText(t)}
            onSubmit={(e)=>props.onSubmit(e)}
            />
            <RectButton style={{marginLeft:-30,width:30,height:30,alignItems:'center',justifyContent:'center'}}
            onPress={()=>props.onSubmit()}>
                <Feather name="search" size={20} color={colors.cinzaEscuro}/>
            </RectButton>
        </View>
    );
}
