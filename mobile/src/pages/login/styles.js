import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({

    container:{
        backgroundColor:'#151515',
        flex:1,
        paddingTop: 40,
        justifyContent:'center',
        alignItems:'center'
    },
    form:{
        height:'30%',
        width:'100%',
        justifyContent:'space-around',
        alignItems:'center'
    },  
    containerButton:{
        height:150,
        justifyContent:'space-around',
        width:'100%',
        alignItems:'center'
    },  
    text:{
        color:'#C2C2C2'
    }
})
export default styles;