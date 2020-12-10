import { StyleSheet } from 'react-native';
import colors from '../../global.json';

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.cinzaMedio,
        alignItems:'center',
    },
    top:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingRight: 12,
    },
    title:{
        fontFamily: 'Righteous_400Regular',
        color: colors.amarelo,
        fontSize: 27,
        textAlign: 'center',
        padding: 25,
    },
    photo:{
        alignItems: 'center',
        marginBottom: 15,
    },
    image:{
        height: 320,
        width: 300,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    imageNone:{
        height: 320,
        width: 240,
        backgroundColor:colors.rosa,
        marginBottom: 10,
    },
    buttons:{
        margin: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button:{
        backgroundColor:colors.amarelo,
        borderRadius:5,
        padding:5,
        width:'43%',
        height:70,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around',
    },
    bTitle:{
        color:colors.cinzaEscuro,
        fontSize:26,
        fontFamily:'Righteous_400Regular'
    },
    userInfo:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    userPhoto:{
        height: 45,
        width: 45,
        borderRadius: 50,
    },
    user:{
        fontFamily: 'Righteous_400Regular',
        color: colors.amarelo,
        fontSize: 20,
        paddingLeft: 10,
        maxWidth: '85%',
    },
    box:{
        minWidth:'95%',
        alignSelf:'center',
        flexDirection: 'row',
        backgroundColor: colors.cinzaClaro+'10',
        margin: 10,
        marginTop: 0,
        borderRadius: 10,
        paddingTop: 12,
    },
    description:{
        fontFamily: 'Roboto_400Regular',
        fontSize: 15,
        color: colors.cinzaClaro,
        padding: 12,
        paddingTop: 0,
    },
    share:{
        backgroundColor:colors.amarelo,
        borderRadius:5,
        padding:5,
        width:'68%',
        height:70,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around',
        marginBottom:30,
    },
    popText:{
        color:colors.cinzaClaro,
        fontFamily:'Roboto_400Regular',
        fontSize:15,
        padding: 11,
        textAlign:'center',
    },
    pop:{
        flexDirection:'row',
        marginTop:15,
        width:'85%',
        justifyContent:'space-around',
    },
    popButton:{
        justifyContent:'center',
        fontFamily:'Roboto_400Regular',
        fontSize:20,
        backgroundColor:colors.amarelo,
        borderRadius:5,
        width:'27%',
    }
})
export default styles;