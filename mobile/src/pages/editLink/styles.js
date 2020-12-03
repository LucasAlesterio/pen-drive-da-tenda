import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../global.json';

const vw = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container:{
        backgroundColor:colors.cinzaMedio,
        flex:1,
    },
    text:{
        fontFamily: 'Righteous_400Regular',
        color: colors.amarelo,
        fontSize: 27,
        paddingTop: 30,
    },
    photo:{
        height:280,
        width:210,
        borderWidth: 1,
        borderColor: colors.amarelo,
        backgroundColor: colors.cinzaClaro+'10',
        justifyContent: 'center',
        alignItems:'center',
        margin:30,
    },
    infos:{
        alignItems:'center',
        justifyContent:'space-between',
        height:0.5*vw,
        width: '100%',
        marginBottom:12,
    },
    box:{
        backgroundColor: colors.cinzaClaro+10,
        height:250,
        width:'90%',
        borderRadius:5,
        marginVertical:10,
    },
    description:{
        height:'100%',
        width:'100%',
        borderRadius:5,
        fontFamily: 'Roboto_400Regular',
        fontSize:17,
        color: colors.cinzaClaro,
        padding:10,
        textAlignVertical: 'top'
    },
    tag:{
        flexDirection:'row',
        width:'100%',
        justifyContent:'space-between',
        padding:10,
        alignItems: 'center',

    },
    tagText:{
        height: 35,
        width:'86%',
        backgroundColor:colors.cinzaClaro+20,
        borderColor: colors.amarelo,
        borderWidth:1,
        borderRadius:5,
        fontFamily: 'Roboto_400Regular',
        fontSize:17,
        color:colors.cinzaClaro,
        paddingHorizontal:5,

    },
})
export default styles;