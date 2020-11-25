import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({

    voltar:{
        backgroundColor:'#151515',
        marginTop: 50,
        paddingLeft: 7,
        flexDirection: 'row',
        width: 83,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    textVoltar:{
        color: colors.cinzaClaro,
        fontSize: 17
    },

    container:{
        backgroundColor:'#151515',
        flex:1,
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