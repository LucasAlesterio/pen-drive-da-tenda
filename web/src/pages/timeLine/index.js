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
    const [pageSize,setPageSize] = useState(12);
    const [max,setMax] = useState(0);
    const [loading,setLoading] = useState(false);
    const [listagemLinks,setListagemLinks] = useState([]);
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
            if(links === 'loading'){
                setLinks(response.data.link);
            }
            //console.log(response.data.link);
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
    useEffect(()=>{
        listagem();
    },[links]);
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
    function listagem(l){
        let a = [];
        if(l){
            a=l;
        }
        if(!l && links !== 'loading'){
            a=links;
        }
        const list = a.map((link)=>(
            <div className="link_time" key={link._id}>
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
                            {link.user.photograph ? <img className="fotoUser" src={link.user.photograph} alt="foto usuario"/>:<div className="fotoNull"/>}
                        </Link>
                    </div>
                </div>
            </div>
        ))
        setListagemLinks(list);
        return null;
    }
    function setNewAverage(a){
        let newList =  links.map((link)=>{
            if(linkSelecionado === link._id){
                link.average = a;
            }
            return link;
        });
        listagem(newList);
    }
    return(
        <>
        <Cabecalho />
        <PopAvaliacao open={openEstrelas} onClose={()=>setOpenEstrelas(false)} idLink={linkSelecionado} onSend={buscarLinks} newAverage={(a)=>setNewAverage(a)}/>
        <div id="timeLine">
            {loading ? <Loading/>:null}
            <div className="container">
                {links === 'loading' ? <Loading/> : null}
                {links !== 'loading' ? listagemLinks : null }
                {links.length === 0 ? <h1>Não encontramos links :( </h1> : null}
            </div>
            <div className="verMais">
                {(((page) === (max - 1)))?<h1>Por hoje é só :)</h1>:
                (links.length > 0 && <Botao onClick={()=>verificaProximo()}>Ver mais</Botao>)}
            </div>
        </div>
        <Rodape/>
        </>
    );
}