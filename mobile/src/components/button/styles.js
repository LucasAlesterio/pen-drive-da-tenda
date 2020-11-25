import { StyleSheet } from 'react-native';
import colors from '../../global';
const styles = StyleSheet.create({

    button:{
        backgroundColor:colors.amarelo,
        borderRadius:5,
        width:'55%',
        height:60,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        color:colors.cinzaEscuro,
        fontSize:27,
        fontFamily:'Righteous_400Regular'
    }
})
export default styles;