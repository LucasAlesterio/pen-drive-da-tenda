import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    button:{
        width:200,
        height:200,
        borderRadius:100,
        borderColor:colors.amarelo,
        borderWidth:2,
        alignItems:'center',
        justifyContent:'center',
    },
    icon:{
        alignItems:'center',
        justifyContent:'center',
        width:200,
        height:200,
    }
})
export default styles;