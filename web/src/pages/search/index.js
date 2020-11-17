import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import { useHistory } from "react-router-dom";
import CampoTexto from '../../components/campoTexto/index';
import LinkList from '../../components/link/index';
import Loading from '../../components/loading/index';
import Paginacao from '../../components/paginacao/index';
import {FiSearch,FiFilter} from 'react-icons/fi'
import api from '../../service/api';
import './style.css';
export default function Search(){
    let history = useHistory();
    const [busca,setBusca] = useState('');
    const [tipos,setTipos]  = useState([]);
    const [tipoSelecionado,setTipoSelecionado] = useState('');
    const [links,setLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [page,setPage] = useState(0);
    const [pageSize,setPageSize] = useState(2);
    const [count,setCount] = useState(0);

    async function buscarTipos(){
        try{
        const response = await api.get('/types',{headers:{Authorization:localStorage.getItem('token')}});
        setTipos(response.data.types);
        if(response.data.error){
            if(response.data.token){
                history.push('/landing');
                return null;
            }
        }
    }catch{
        alert('Erro no servidor');
    }
    }
    useEffect(()=>{
        buscarTipos();
    },[]);

    function listTipos(){
        const retorno = tipos.map((tipo)=>(
        <option value={`${tipo}`}>{`${tipo}`}</option>
        ));
        return retorno;
    }
    function listLinks(){
        const retorno  = links.map((link)=>(
            <LinkList id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
        ))
        return retorno;
    }

    useEffect(()=>{
        pesquisar();
    },[tipoSelecionado,page])

    async function pesquisar(e){
        setLoading(true);
        if(e){
            e.preventDefault();
        }
        try{
            const response = await api.post('/searchLink',
            {text:busca,pageSize:pageSize,page:page},
            {headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.erro){
                if(response.data.token){
                    history.push('/landing');
                }
            }else{
                setLinks(response.data.links);
                setCount(response.data.count);
            }
            setLoading(false);

        }catch{
            setLoading(false);
            alert('Erro no servidor');
        }
    }
    return(
        <>
        {tipos ?<>
        <Cabecalho/>
        {loading ? <Loading/> : null}
        <div id="search">
                <div className="busca">
                    <form onSubmit={pesquisar}>
                        <div className="buscar">
                            <CampoTexto
                            className="campoBuscar"
                            type="text" 
                            placeholder="Buscar" 
                            value={busca}
                            onChange={e=>setBusca(e.target.value)}
                            />
                            <button type='submit'>
                                <FiSearch size='20'/>
                            </button>
                        </div>
                    </form>
                        <select name="Tipo" placeholder="Tipo" onChange={(e)=>setTipoSelecionado(e.target.value)}>
                            <option selected value="">Tipo</option>
                            {tipos ? listTipos() : null}
                        </select>
                        <FiFilter size='30'/>
                </div>
                <div className="container">
                {links ? listLinks() : null}
                </div>
                <Paginacao count={count} page={page} pageSize={pageSize} onChange={(a)=>setPage(a)} max={5}/>
        </div>
        <Rodape/>
        </>:<Loading/>}
        </>
    );
}