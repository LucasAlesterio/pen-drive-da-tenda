import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    button:{
        height:280,
        width:210,
        borderWidth: 2,
        borderColor: colors.amarelo,
        backgroundColor: colors.cinzaClaro+'10',
        justifyContent: 'center',
        alignItems:'center',
        margin:30,
    },
    image:{
        width:210,
        height:280,
        borderWidth:2,
        borderColor:colors.amarelo
    },
    icon:{
        alignItems:'center',
        justifyContent:'center',
    }
})
export default styles;