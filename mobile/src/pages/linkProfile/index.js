import React, { useState, useCallback } from 'react';
import { View, Image, Text, ScrollView, Alert, TouchableOpacity, Clipboard, Linking, Share, Dimensions} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect} from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../service/api';
import styles from './styles';
import GoBack from '../../components/goBack';
import Loading from '../../components/loading';
import MiniLoading from '../../components/miniLoading';
import Stars from '../../components/stars';
import PopUpBox from '../../components/popUpBox';
import colors from '../../global.json';
import Tags from '../../components/tags';
import PopRating from '../../components/popRating';

export default function LinkProfile({route}){
    const vw = Dimensions.get('window').width;
    const [link,setLink] = useState('');
    const [user,setUser] = useState('');
    const [tags,setTags] = useState([]);
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);
    const [openStars,setOpenStars] = useState(false);
    const { navigate } = useNavigation();
    const { id, idUser } = route.params;
    const url = 'https://pendrivedatenda.vercel.app/linkProfile/'
    async function getLink(){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        if(token){
            try{
                const response = await api.post('/dataLink',{id:id},{headers:{Authorization:token}});
                if(response.data.error){
                    if(response.data.token){
                        Alert.alert('Necessário logar novamente!');
                        navigate('Landing');
                    }
                    if(response.data.empty){
                        Alert.alert('Não encontramos este link!');
                    }
                }
                const tag =  response.data.link.tag;
                setTags(tag.map((a)=>{
                return(a.name)}));
                setLink(response.data.link);
                setUser(response.data.user);
                setLoading(false);
            }catch(e){
                setLoading(false);
                Alert.alert('Erro no servidor');
            }
            setLoading(false);
        }else{
            navigate('Landing');
        }
    };
    
    useFocusEffect( useCallback(()=>{
        getLink();
    },[route]));

    async function favoriteLink(){
        const token = await AsyncStorage.getItem('token');
        setLoading(true);
        try{
            await api.post('/updateFavorite',{link:id},{headers:{Authorization:token}});
            getLink();
            setLoading(false);
        }catch{
            setLoading(false);
            Alert.alert('Erro no servidor');
        }
    };

    
    async function deleteLink(){
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        await api.post('/deleteLink',{link:id},{headers:{Authorization:token}}).then(()=>{
            navigate('Profile');
        }).catch((error)=>{
            console.log(error);
            Alert.alert('Erro no servidor');
        });
        setLoading(false);
    };
    
    function openLink(){
        Linking.canOpenURL(link.link).then(supported => {
            if (supported) {
                Linking.openURL(link.link);
            } else {
                Alert.alert("Não há suporte para esse link :( , tente copia-lo ");
            }
        });
    }

    async function onShare(){
        try {
            const result = await Share.share({
                message:'Se liga nesse link brabo! '+
                url+link._id,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                // shared with activity type of result.activityType
                } else {
                // shared
                }
            } else if (result.action === Share.dismissedAction) {
              // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
        };

        function newAverage(n){
            let _link= link;
            _link.average = n;
            setLink(_link);
        }

    return(<>
        <SafeAreaView style={styles.container} edges={['right', 'top', 'left']}>
        {link._id ?<>
            <PopUpBox open={open} onClose={(state)=>setOpen(state)} title="Excluir Link">
                {!loading ? <>
                <Text style={styles.popText}>Você deseja mesmo excluir este link?</Text>
                <View style={styles.pop}>
                    <TouchableOpacity style={styles.popButton} onPress={()=>deleteLink()}>
                        <Text style={[styles.popText,{color:colors.cinzaEscuro,fontSize:17}]}>Sim</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.popButton} onPress={()=>setOpen(false)}>
                        <Text style={[styles.popText,{color:colors.cinzaEscuro,fontSize:17}]}>Não</Text>
                    </TouchableOpacity>
                </View>
                </>:<MiniLoading/>}
            </PopUpBox>

            <PopRating 
            open={openStars} 
            onClose={()=>setOpenStars(false)} 
            title="Avaliar" 
            id={link._id}
            newAverage={(n)=>newAverage(n)}
            />
            
            <ScrollView 
            contentContainerStyle={{width:vw}}
            showsVerticalScrollIndicator={false} 
            scrollEventThrottle={16}>
                {!link.isMy ? <> 
                    {(link.isFavorite && !link.isMy) ? 
                    <View style={styles.top}><GoBack/><RectButton onPress={()=>favoriteLink()} ><AntDesign name='heart' size={40} color='#C2C2C2'/></RectButton></View>
                    :<View style={styles.top}><GoBack/><RectButton onPress={()=>favoriteLink()} ><AntDesign name='hearto' size={40} color='#C2C2C2'/></RectButton></View>}
                </> : <>
                    <GoBack/>
                    <View style={[styles.top,{marginTop:15, paddingLeft:12}]}>
                        <RectButton onPress={()=>
                            navigate('EditLink',{
                                name: link.name,
                                type: link.type.name,
                                link: link.link,
                                photo: link.photograph,
                                tags: tags,
                                description: link.description,
                                id:link._id
                            })}><Feather name='edit' size={40} color='#C2C2C2'/></RectButton>
                        <RectButton onPress={()=>setOpen(true)}><Feather name='trash' size={40} color='#C2C2C2'/></RectButton>
                    </View></>}

                <Text style={styles.title}>{link.name}</Text>
                <View style={styles.photo}>
                    {link.photograph ? 
                        <Image style={styles.image} source={{uri:link.photograph}}/>
                    :<View style={styles.imageNone}/>}
                    <RectButton onPress={()=>setOpenStars(true)}>
                        <Stars size={30} average={link.average}/>
                    </RectButton>
                </View>
                <View style={styles.buttons}>
                    <RectButton style={styles.button} onPress={()=>Clipboard.setString(link.link)}>
                        <Text style={styles.bTitle}>Copiar</Text>
                        <Feather name="copy" size={30} color="#151515" />
                    </RectButton>
                    <RectButton style={styles.button} onPress={()=>openLink()}>
                        <Text style={styles.bTitle}>Abrir</Text>
                        <Feather name='external-link' size={30} color='#151515'/>
                    </RectButton>
                </View>
                

                <View style={{alignItems:'center', marginBottom:20}}>
                    <RectButton style={styles.userInfo} onPress={()=>
                        ( user.user == idUser ? 
                        navigate('Profile',{idUser:user.user}): 
                        navigate('AnotherProfile',{idUser:user.user}))}>
                        <Image style={styles.userPhoto} source={{uri:user.mini}}/>
                        <Text style={styles.user}>{user.user}</Text>
                    </RectButton>
                </View>

                <View style={styles.box}>
                    <Text style={styles.description}>{link.description}</Text>
                </View>
                <View style={styles.box}>
                    <Tags type={link.type.name} tags={link.tag}/>
                </View>

                <View style={styles.buttons}>
                    <RectButton style={styles.share} onPress={()=>onShare()}>
                        <Text style={styles.bTitle}>Compartilhar</Text>
                        <Feather name='share-2' size={30} color='#151515' />
                    </RectButton>
                </View>
            </ScrollView>
            </>
        :<Loading/>}
        </SafeAreaView>
    </>);
}