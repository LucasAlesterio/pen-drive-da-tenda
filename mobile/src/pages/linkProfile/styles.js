import { StyleSheet } from 'react-native';
import colors from '../../global.json';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.cinzaMedio,
        alignItems:'center',
        height:1000,
        width: '100%',
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
        justifyContent: 'space-around'
    },
    image:{
        height: 320,
        //maxHeight: 320,
        //minHeight: 150,
        width: 300,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttons:{
        margin: 10,
        flexDirection: 'row',
        padding: 15,
        justifyContent: 'space-around',
    },
    button:{
        backgroundColor:colors.amarelo,
        borderRadius:5,
        width:'45%',
        height:70,
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'space-around'
    },
    bTitle:{
        color:colors.cinzaEscuro,
        fontSize:27,
        fontFamily:'Righteous_400Regular'
    },
    box:{
        flexDirection: 'row',
        backgroundColor: colors.cinzaClaro+'10',
        margin: 10,
        marginTop: 0,
        borderRadius: 10,
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        paddingTop: 12,
    },
    description:{
        fontFamily: 'Roboto_400Regular',
        fontSize: 15,
        color: colors.cinzaClaro,
        padding: 12,
        paddingTop: 0,
    },
    type:{
        backgroundColor: colors.cinzaMedio,
        height: 45,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 50,
        borderColor: colors.amarelo,
        borderWidth: 1.5,
        marginBottom: 12,
        marginLeft: 12,
    },
    typeName:{
        fontFamily: 'Roboto_400Regular',
        color: colors.amarelo,
        fontSize: 15,
    },
    tag:{
        backgroundColor: colors.amarelo,
        height: 45,
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 50,
        marginBottom: 12,
        marginLeft: 12,
    },
    tagName:{
        fontFamily: 'Roboto_400Regular',
        color: colors.cinzaMedio,
        fontSize: 15,
    },
})
export default styles;