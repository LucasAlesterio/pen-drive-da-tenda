import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    container:{
        width:'90%',
        height:70,
        minHeight:80
    },  
    input:{
        backgroundColor:colors.cinzaClaro,
        borderRadius:5,
        fontSize:20,
        paddingLeft:5,
        height:40
    },
    error:{
        backgroundColor:colors.cinzaClaro,
        borderRadius:5,
        fontSize:20,
        paddingLeft:5,
        borderWidth:1,
        borderColor:'red', 
        height:40
    },
    textError:{
        color:'red',
        alignSelf:'flex-start',
        
    }
});
export default styles;