import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.cinzaMedio,
        alignItems:'center',
        paddingTop:'10%',
        height:1000
    },
    form:{
        marginTop:30,
        alignItems:'center',
        justifyContent:'space-between',
    },
    input:{
        paddingVertical:10
    },
    button:{
        marginTop:20,
        width:180
    },
    text:{
        color:colors.cinzaClaro,
        fontFamily:'Righteous_400Regular',
        fontSize:20,
        paddingRight:10
    }
})
export default styles;