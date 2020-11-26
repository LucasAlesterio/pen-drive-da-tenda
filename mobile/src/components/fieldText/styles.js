import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    container:{
        width:'90%'
    },
    containerField:{
        flexDirection:'row',
        width:'100%',
        alignItems:'center'
    },
    input:{
        backgroundColor:colors.cinzaClaro,
        borderRadius:5,
        fontSize:20,
        height:45,
        width:'100%',
        fontFamily:'Roboto_400Regular'
    },
    error:{
        borderWidth:1,
        borderColor:'red', 
    },
    textError:{
        color:'red',
        alignSelf:'flex-start',
        
    },
    icon:{
        position:'relative',
        marginLeft:-20,
        left:25,
        zIndex:1,
    }
});
export default styles;