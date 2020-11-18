import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import { useHistory,useParams } from "react-router-dom";
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
    const [pageSize,setPageSize] = useState(18);
    const [count,setCount] = useState(0);
    let {parSearch,parPage,parType,parOrder} = useParams();
    const [tipoSelecionado,setTipoSelecionado] = useState(parType ? parType : '');
    const [busca,setBusca] = useState(parSearch !== 'null' ? parSearch : '');
    const [order,setOrder] = useState(parOrder ? parOrder : 3);
    const [page,setPage] = useState(parPage ? parPage : 0);

    console.log(parSearch,parPage,parType,parOrder)

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
        <option className="opcao" value={`${tipo}`}>{`${tipo}`}</option>
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
        history.push(`/search/${busca ? busca : 'null'}/${page}/${order}/${tipoSelecionado}`);
    },[page,order,tipoSelecionado])

    useEffect(()=>{

        pesquisar();
    //},[page,order])
    },[parSearch,parPage,parType,parOrder]);

    useEffect(()=>{
        pesquisar();
    },[tipoSelecionado])
    
    function formBuscar(e){
        if(e){
            e.preventDefault();
        }
        history.push(`/search/${busca ? busca : 'null'}/${page}/${order}/${tipoSelecionado}`);
    }

    async function pesquisar(){
        setLoading(true);
        try{
            let textBusca = '';
            if(parSearch !== 'null'){
                textBusca = parSearch
            }
            const response = await api.post('/searchLink',
            {
                text:textBusca,
                pageSize:pageSize,
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
                setCount(response.data.count);
            }
            setLoading(false);

        }catch{
            setLoading(false);
            alert('Erro no servidor');
        }
    }
    function selecionatTipo(e){
        setPage(0);
        setTipoSelecionado(e.target.value)
    }
    return(
        <>
        {tipos ?<>
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
                    <select placeholder="Tipo" onChange={(e)=>selecionatTipo(e)}>
                        <option className="opcao" selected value="">Tipo</option>
                        {tipos ? listTipos() : null}
                    </select>

                    <select placeholder="Ordenar" onChange={(e)=>setOrder(e.target.value)}>
                        <option className="opcao" selected value={3} >Ordenar</option>
                        <option className="opcao" value={1}>Aa-Zz</option>
                        <option className="opcao" value={2}>Zz-Aa</option>
                        <option className="opcao" value={3}>Mais recente</option>
                        <option className="opcao" value={4}>Menos recente</option>
                        <option className="opcao" value={5}>Maior avaliação</option>
                        <option className="opcao" value={6}>Menor avaliação</option>
                    </select>
                </div>
                <div className="container">
                    {links ? listLinks() : null}
                </div>
                <Paginacao count={count} page={page} pageSize={pageSize} onChange={(a)=>setPage(a)} max={7}/>
        </div>
        <Rodape/>
        </>:<Loading/>}
        </>
    );
}