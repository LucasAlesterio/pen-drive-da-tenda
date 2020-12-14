import React,{useState,useCallback,useEffect} from 'react';
import Cabecalho from '../../components/cabecalho/index';
import Rodape from '../../components/rodape/index';
import CampoTexto from '../../components/campoTexto';
import Usuario from '../../components/usuario/index';
import Loading from '../../components/loading/index';
import Paginacao from '../../components/paginacao/index';
import api from '../../service/api';
import {FiSearch} from 'react-icons/fi';
import './style.css';

let text = '';
export default function Friends(){
    const [campoBusca,setCampoBusca] = useState('');
    const [loading,setLoading] = useState(false);
    const [count,setCount] = useState(0);
    const [page,setPage] = useState(0);
    const [listagem,setListagem] = useState([]);
    const pageSize = 12;
    text = campoBusca;
    const buscarAmigos = useCallback(async (e)=>{
        setLoading(true);
        if(e){
            e.preventDefault();
        }
        try{
            const response = await api.post('/findUser',
            {search:text,pageSize:pageSize,page:page},
            {headers:{Authorization:localStorage.getItem('token')}});
            setCount(response.data.count);
            setListagem(response.data.friends.map((amigo)=>(
                <Usuario key={amigo.user} user={amigo.user} 
                photo={amigo.mini} button={true} isFriend={amigo.isFriend} 
                id={amigo._id} refresh={()=>buscarAmigos()}/>
            )));
            setLoading(false);
        }catch{
            alert('Erro no servidor!');
            setLoading(false);
        }
    },[page]);

    useEffect(()=>{
        buscarAmigos()
    },[buscarAmigos])

    function setText(e){
        setCampoBusca(e);
        text = e;
    }
    function setSubmit(e){
        setPage(0);
        buscarAmigos(e);
    }
    function setPagina(a){
        setPage(a);
    }
    return(
    <>
        <Cabecalho/>
        <div id="friends">
            <form className="busca" onSubmit={(e)=>setSubmit(e)}>
                <CampoTexto 
                type="text" 
                placeholder="Buscar amigo" 
                onChange={(e)=>(setText(e.target.value))}
                value={campoBusca}
                />
                <button type="submit">
                    <FiSearch size="18" color="151515"/>
                </button>
            </form>

            <div className="container">
                {loading?<Loading/>:listagem}
            </div>
            <Paginacao count={count} page={page} pageSize={pageSize} onChange={(a)=>setPagina(a)} max={5}/>
        </div>
        <Rodape/>
    </>
    );
}
