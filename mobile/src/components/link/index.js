import React,{useEffect,useState} from 'react';
import { View, Text,Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Stars from '../../components/stars';
import colors from '../../global.json';

export default function Link(props){
    const { navigate } = useNavigation();
    const [heightImage,setHeightImage] = useState(0);

    function getHeight(){
        if(props.image){
            Image.getSize(props.image,(width, height) => {
                setHeightImage((height/width)*((0.95)*(0.4)*props.vw));
            });
        }else{
            setHeightImage(props.vw*0.7);
        }
    }
    useEffect(()=>{
        getHeight()
    },[])
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
            height:(heightImage),
        },
        imageNone:{
            backgroundColor:colors.rosa,
            width:'95%',
            flex:1
        },  
        text:{
            color:'#C2C2C2',
            textAlign:'center',
            padding:7
        }
    })
    return(
        <RectButton style={styles.button} onPress={()=>navigate('LinkProfile',{id:props.id})}>
            <View style={{minHeight:(props.vw*0.3),width:'100%',justifyContent:'center',alignItems:'center'}}>
                {props.image ? <Image source={{uri:props.image||null}} style={styles.image}/>:
                <View style={styles.imageNone}/>}
            </View>
            <View style={styles.containerInfos}>
                <Text style={styles.text}>{props.title}</Text>
                <Stars size={20} average={props.average}/>
            </View>
        </RectButton>
    );
}