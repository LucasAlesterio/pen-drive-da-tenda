import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({

    container:{
        backgroundColor:colors.cinzaMedio,
        flex:1,
        paddingTop:10
    },
    containerSearch:{
        width:'100%',
        alignItems:'center'
    },  
    containerLinks:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-around',
        flexWrap:'wrap'
    },
    text:{
        color:colors.cinzaClaro
    }
})
export default styles;