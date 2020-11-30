import React,{useState,useEffect} from 'react';
import { View, Text,Image, StyleSheet, Dimensions} from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Stars from '../../components/stars';
import colors from '../../global.json';
import api from '../../service/api';

export default function Link(props){
    const [imageSize,setImageSize] = useState({})
    const [image,setImage] = useState('');
    const vw = Dimensions.get('window').width;
    const { navigate } = useNavigation();

    async function getRandomImage(){
        const response = await api.get('https://picsum.photos/200/300');
        if(response.request.responseURL){
            //console.log(response.request.responseURL);
            setImage(response.request.responseURL);
            return response.request.responseURL;   
        }
    }

    var heightImage = 0;
    useEffect(()=>{
        if(props.image){
            Image.getSize(props.image,(width, height) => {
                setImageSize([width,height]);
            });
            getRandomImage();
            //console.log(img);
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
            height:(heightImage|| vw*0.7),
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
        <RectButton style={styles.button} onPress={()=>navigate('LinkProfile',{id:props.id})}>
            <View style={{minHeight:(vw*0.3),width:'100%',justifyContent:'center',alignItems:'center'}}>
                {props.image ? <Image source={{uri:image||null}} style={styles.image} /> : 
                <View style={styles.imageNone}/>}
            </View>
            <View style={styles.containerInfos}>
                <Text style={styles.text}>{props.title}</Text>
                <Stars size={20} average={props.average}/>
            </View>
        </RectButton>
    );
}