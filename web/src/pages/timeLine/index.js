import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Estrelas from '../../components/estrelas/index';
import PopAvaliacao from '../../components/popAvaliar/index';
import Loading from '../../components/loading/index';
import Botao from '../../components/botao/index';
import { Link, useHistory} from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function TimeLine(){
    const [links,setLinks] = useState('loading');
    const [openEstrelas,setOpenEstrelas] = useState('');
    const [linkSelecionado,setLinkSelecionado] = useState('');
    const [page,setPage] = useState(0);
    const [pageSize,setPageSize] = useState(10);
    const [max,setMax] = useState(0);
    const [loading,setLoading] = useState(false);
    let history = useHistory();

    function calcMax(i){
        let a = parseInt(i/pageSize)
        if(a < (i/pageSize)){
            a += 1;
        }
        return a;
    }
    async function buscarLinks(){
        try{
            const response = await api.post('/timeLine',{pageSize:pageSize,page:page},{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.error){
                if(response.data.token){
                    alert('Necessário logar novamente!')
                    history.push('/landing');
                    return null;
                }
            }
            setMax(calcMax(response.data.count));
            setLinks(response.data.link);
        }catch(e){
            alert(e)
            //history.push('/landing');
        }
    }
    async function verMais(){
        try{
            const response = await api.post('/timeLine',{pageSize:pageSize,page:page},{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.error){
                if(response.data.token){
                    alert('Necessário logar novamente!')
                    history.push('/landing');
                    return null;
                }
            }
            setMax(calcMax(response.data.count));
            setLinks(links.concat(response.data.link));
            setLoading(false);
        }catch(e){
            alert(e)
        }
    }
    useEffect(()=>{
        if(links !== 'loading'){
            verMais();
        }
    },[page]);

    useEffect(()=>{
        buscarLinks();
    },[]);
    function verificaProximo(){
        setLoading(true);
        if((page + 1) <= (max - 1)){
            setPage(page+1)
            return null;
        }
        setLoading(false);
    }
    function openPopAvaliacao(id){
        setOpenEstrelas(true);
        setLinkSelecionado(id);
    }
    function listagem(){
        const list = links.map((link)=>(
            <div className="link" key={link._id}>
                <Link className="containerImagem" to={`linkProfile/${link._id}`} style={!link.photograph ?{backgroundColor:'var(--rosa)'}:null}>
                    {link.photograph ? <img alt="imagem link" src={link.photograph}/> : null}
                </Link>
                <div className="infoLink">
                    <div className="containerInfo">
                        <Link className="tagLink" to={`linkProfile/${link._id}`}>
                            <h2>{link.name}</h2>
                        </Link>
                        <button className="estrelas" onClick={()=>openPopAvaliacao(link._id)}>
                            <Estrelas average={link.average} size={20}/>
                            <h2>{link.average ? parseFloat(link.average.toFixed(2)):null}</h2>
                        </button>
                    </div>
                    <div className="containerUsuario">
                        <Link className="tagLink" to={`/profile/${link.user.user}`}>
                            <img className="fotoUser" src={link.user.photograph} alt="foto usuario"/>
                        </Link>
                    </div>
                </div>
            </div>
        ))
        return(list);
    }
    return(
        <>
        <Cabecalho />
        <div id="timeLine">
            {loading ? <Loading/>:null}
        <PopAvaliacao open={openEstrelas} onClose={()=>setOpenEstrelas(false)} idLink={linkSelecionado} onSend={buscarLinks}/>
            <div className="container">
                {links === 'loading' ? <Loading/> : null}
                {links !== 'loading' ? listagem() : null }
                {links === [] ? <h1>Não encontramos links :( </h1> : null}
            </div>
            <div className="verMais">
                {((page) === (max - 1))?<h1>Por hoje é só :)</h1>:
                <Botao onClick={()=>verificaProximo()}>Ver mais</Botao>}
            </div>
        </div>
        <Rodape/>
        </>
    );
}