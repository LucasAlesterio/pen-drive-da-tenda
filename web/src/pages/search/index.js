import React,{useState,useEffect,useCallback} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import { useHistory,useLocation } from "react-router-dom";
import CampoTexto from '../../components/campoTexto/index';
import LinkList from '../../components/link/index';
import Loading from '../../components/loading/index';
import Paginacao from '../../components/paginacao/index';
import {FiSearch} from 'react-icons/fi'
import api from '../../service/api';
import './style.css';

export default function Search(){
    let history = useHistory();
    const [tipos,setTipos]  = useState([]);
    const [links,setLinks] = useState([]);
    const [loading,setLoading] = useState(false);
    const [count,setCount] = useState(0);
    
    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }
    let query = useQuery();
    let parSearch = query.get("search");
    let parPage = query.get("page");
    let parType = query.get("type");
    let parOrder = query.get("order");
    let parSize = query.get("size");
    
    const [pageSize,setPageSize] = useState(parSize ? parSize : 18);
    const [tipoSelecionado,setTipoSelecionado] = useState(parType ? parType : '');
    const [busca,setBusca] = useState(parSearch !== 'busca' && parSearch ? parSearch : '');
    const [order,setOrder] = useState(parOrder ? parOrder : 3);
    const [page,setPage] = useState(parPage ? parseInt(parPage) : 0);

    const pesquisar = useCallback( async ()=>{
        setLoading(true);
        try{
            let textBusca = '';
            if(parSearch !== 'busca'){
                textBusca = parSearch
            }
            const response = await api.post('/searchLink',
            {
                text:textBusca,
                pageSize:parseInt(pageSize),
                page:parPage,
                type:parType,
                order:parOrder
            },
            {headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.erro){
                if(response.data.token){
                    history.push('/landing');
                }
            }else{
                setLinks(response.data.links);
                //console.log(response.data.links);
                setCount(response.data.count);
            }
            setLoading(false);
        }catch{
            setLoading(false);
            alert('Erro no servidor');
        }
    },[history, pageSize, parOrder, parPage, parSearch, parType]);

    const buscarTipos = useCallback(async ()=>{
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
    },[history]);
    useEffect(()=>{
        buscarTipos();
    },[buscarTipos]);

    function listTipos(){
        const retorno = tipos.map((tipo)=>(
            <option key={tipo} className="opcao" value={`${tipo}`}>{`${tipo}`}</option>
        ));
        return retorno;
    }
    function listLinks(){
        const retorno  = links.map((link)=>(
            <LinkList key={link._id} id={link._id} average={link.average} photo={link.mini} name={link.name}/>
        ))
        return retorno;
    }

    useEffect(()=>{
        pesquisar();
    },[parSearch,parPage,parType,parOrder,pageSize,pesquisar]);

    function formBuscar(e){
        setPage(0);
        if(e){
            e.preventDefault();
        }
        history.push(`/search?search=${busca ? busca : 'busca'}&page=${0}&order=${order}&type=${tipoSelecionado}&size=${pageSize}`);
    }

    function selecionatTipo(e){
        setPage(0);
        setTipoSelecionado(e.target.value)
        history.push(`/search?search=${busca ? busca : 'busca'}&page=${0}&order=${order}&type=${e.target.value}&size=${pageSize}`);
    }
    function setOrdenar(e){
        setOrder(e);
        history.push(`/search?search=${busca ? busca : 'busca'}&page=${page}&order=${e}&type=${tipoSelecionado}&size=${pageSize}`);
    }
    function setChangePagina(e){
        setPage(e);
        history.push(`/search?search=${busca ? busca : 'busca'}&page=${e}&order=${order}&type=${tipoSelecionado}&size=${pageSize}`);
    }
    function setChangePageSize(e){
        setPageSize(e);
        history.push(`/search?search=${busca ? busca : 'busca'}&page=${page}&order=${order}&type=${tipoSelecionado}&size=${e}`);
    }
    return(
        <>
        <Cabecalho/>
        {loading ? <Loading/> : null}
        <div id="search">
                <div className="busca">
                    <form onSubmit={formBuscar}>
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
                </div>
                <div className="containerFiltros">
                    <select placeholder="Tipo" onChange={(e)=>selecionatTipo(e)} value={tipoSelecionado}>
                        <option className="opcao" value="">Tipo</option>
                        {tipos ? listTipos() : null}
                    </select>
                    <div>
                        <select onChange={(e)=>setChangePageSize(e.target.value)} value={pageSize}>
                            <option className="opcao" value={12}>12</option>
                            <option className="opcao" value={18}>18</option>
                            <option className="opcao" value={24}>24</option>
                            <option className="opcao" value={30}>30</option>
                        </select>
                        <select placeholder="Ordenar" onChange={(e)=>setOrdenar(e.target.value)} value={order}>
                            <option className="opcao" value={3} >Ordenar</option>
                            <option className="opcao" value={1}>Aa-Zz</option>
                            <option className="opcao" value={2}>Zz-Aa</option>
                            <option className="opcao" value={3}>Mais recente</option>
                            <option className="opcao" value={4}>Menos recente</option>
                            <option className="opcao" value={5}>Maior avaliação</option>
                            <option className="opcao" value={6}>Menor avaliação</option>
                        </select>
                    </div>
                </div>
                <div className="container">
                    {links ? listLinks() : null}
                </div>
                <Paginacao count={count} page={page} pageSize={pageSize} onChange={(a)=>setChangePagina(a)} max={7}/>
        </div>
        <Rodape/>
        </>
    );
}