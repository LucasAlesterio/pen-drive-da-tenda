import React,{useState,useEffect} from 'react';
import Cabecalho from '../../components/cabecalho/index';
import Rodape from '../../components/rodape/index';
import CampoTexto from '../../components/campoTexto';
import Usuario from '../../components/usuario/index';
import Loading from '../../components/loading/index';
import Paginacao from '../../components/paginacao/index';
import api from '../../service/api';
import {FiSearch} from 'react-icons/fi';
import './style.css';

let flag = false;
export default function Friends(){
    const [campoBusca,setCampoBusca] = useState('');
    const [amigos,setAmigos] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(0);
    const [pageSize,setPageSize] = useState(12);
    const [count,setCount] = useState(0);

    useEffect(()=>{
        buscarDados();
    },[]);

    useEffect(()=>{
        if(flag){
            buscarAmigos();
        }else{
            buscarDados();
        }
        //setListagemAmigos(listAmigos());
    },[page]);

    async function buscarDados(){
        setLoading(true);
        try{
            const response = await api.post('/listFriends',{pageSize:pageSize,page:page},{headers:{Authorization:localStorage.getItem('token')}});
            setAmigos(response.data.friends);
            listAmigos(response.data.friends);
            setCount(response.data.count);
            setLoading(false);
        }catch{
            setLoading(false);
            alert('Erro no servidor!');
        }
    }
    async function buscarAmigos(e){
        flag = true;
        setLoading(true);
        if(e){
            e.preventDefault();
        }
        if(!campoBusca){
            buscarDados();
            return null;
        }
        //flagAmigos = true;
        try{
            const response = await api.post('/findUser',{search:campoBusca,pageSize:pageSize,page:page},{headers:{Authorization:localStorage.getItem('token')}});
            //listAmigos(response.data);
            setAmigos(response.data.friends);
            setCount(response.data.count);
            setLoading(false);
            //setFlagAmigos(true);
        }catch{
            alert('Erro no servidor!');
            setLoading(false);
        }
    }

    function listAmigos(){
        const retorno  = amigos.map((amigo)=>(
            <Usuario user={amigo.user} photo={amigo.photograph} button={true} isFriend={amigo.isFriend} id={amigo._id} refresh={()=>buscarAmigos()}/>
        ))
        //setListagemAmigos(retorno);
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

                {loading?<Loading/>:listAmigos()}
            </div>
            <Paginacao count={count} page={page} pageSize={pageSize} onChange={(a)=>setPage(a)} max={5}/>
        </div>
        <Rodape/>
        </>
    );
}
