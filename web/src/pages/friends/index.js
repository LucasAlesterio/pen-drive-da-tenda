import React,{useState,useEffect} from 'react';
import Cabecalho from '../../components/cabecalho/index';
import Rodape from '../../components/rodape/index';
import CampoTexto from '../../components/campoTexto';
import Usuario from '../../components/usuario/index';
import Loading from '../../components/loading/index';
import api from '../../service/api';
import {FiSearch} from 'react-icons/fi';
import './style.css';

export default function Friends(){
    const [campoBusca,setCampoBusca] = useState('');
    const [amigos,setAmigos] = useState([]);
    const [listagemAmigos,setListagemAmigos] = useState('loading');
    const [flagAmigos,setFlagAmigos] = useState(false);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{
        buscarDados();
    },[])
    useEffect(()=>{
        setListagemAmigos(listAmigos());
    },[amigos])
    async function buscarDados(){
        setLoading(true);
        try{
            const response = await api.get('/listFriends',{headers:{Authorization:localStorage.getItem('token')}});
            setAmigos(response.data);
            setLoading(false);
        }catch{
            setLoading(false);
            alert('Erro no servidor!');
        }
    }
    async function buscarAmigos(e){
        e.preventDefault();
        setLoading(false);
        try{
            const response = await api.post('/findUser',{search:campoBusca},{headers:{Authorization:localStorage.getItem('token')}});
            setAmigos(response.data);
            setFlagAmigos(true);
        }catch{
            alert('Erro no servidor!');
            setLoading(false);
        }
    }

    function listAmigos(){
        
        const retorno  = amigos.map((amigo)=>(
            <Usuario user={amigo.user} photo={amigo.photograph} button={flagAmigos} isFriend={amigo.isFriend} id={amigo._id}/>
        ))
        return retorno;
    }
    return(
    <>
        <Cabecalho/>
        <div id="friends">
            <form className="busca" onSubmit={(e)=>buscarAmigos(e)}>
                <CampoTexto 
                type="text" 
                placeholder="Buscar amigo" 
                value={campoBusca.valor}
                onChange={e=>setCampoBusca(e.target.value)}
                />
                <button type="submit">
                    <FiSearch size="18" color="151515"/>
                </button>
            </form>

            <div className="container">
                {listagemAmigos}
                {loading?<Loading/>:null}
                {!listagemAmigos && listagemAmigos !== 'loading' ?<h1>Você ainda não tem amigos :(</h1> : null}
            </div>
        </div>
        <Rodape/>
        </>
    );
}
