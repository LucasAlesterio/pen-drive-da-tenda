import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.cinzaMedio,
        alignItems:'center',
        paddingTop:'10%',
    },
    form:{
        marginTop:30,
        alignItems:'center',
        justifyContent:'space-between',
        height:380,
    },
    button:{
        marginVertical:20,
        width:180
    }
})
export default styles;