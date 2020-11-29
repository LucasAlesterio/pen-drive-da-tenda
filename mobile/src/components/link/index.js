import React,{useState,useEffect} from 'react';
import { View, Text,Image, StyleSheet, Dimensions} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Stars from '../../components/stars';
import colors from '../../global.json';

export default function Link(props){
    const [imageSize,setImageSize] = useState({})
    const vw = Dimensions.get('window').width;
    const { navigate } = useNavigation();
    var heightImage = 0;
    
    useEffect(()=>{
        if(props.image){
            Image.getSize(props.image,(width, height) => {
                setImageSize([width,height]);
            });
        }
    },[])
    if(props.image){
        heightImage = (imageSize[1]/imageSize[0])*((0.95)*(0.4)*vw);
    }
    const styles = StyleSheet.create({
        button:{
            width:'40%',
            paddingVertical:5,
            backgroundColor:`${colors.cinzaClaro}20`,
            alignItems:'center',
            marginHorizontal:5,
            marginVertical:10,
        },
        containerInfos:{
            alignItems:'center',
            flex: 1,
            justifyContent: 'flex-end',
        },   
        image:{
            width:'95%',
            height:(heightImage || '50%'),
        },
        imageNone:{
            backgroundColor:colors.rosa,
            width:'95%',
            flex:1
        },  
        text:{
            color:'#C2C2C2',
            textAlign:'center'
        }
    })
    return(
        <RectButton style={styles.button} onPress={()=>navigate('LinkProfile')}>
            <View style={{minHeight:(vw*0.3),width:'100%',justifyContent:'center',alignItems:'center'}}>
                {props.image ? <Image source={{uri:props.image,scale:0.2,width:20,height:20}}/> : 
                <View style={styles.imageNone}/>}
            </View>
            <View style={styles.containerInfos}>
                <Text style={styles.text}>{props.title}</Text>
                <Stars size={20} average={props.average}/>
            </View>
        </RectButton>
    );
}