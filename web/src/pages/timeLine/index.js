import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Estrelas from '../../components/estrelas/index';
import PopAvaliacao from '../../components/popAvaliar/index';
import Loading from '../../components/loading/index';
import { Link, useHistory} from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function TimeLine(){
    const [links,setLinks] = useState('loading');
    const [openEstrelas,setOpenEstrelas] = useState('');
    const [linkSelecionado,setLinkSelecionado] = useState('');
    let history = useHistory();

    async function buscarLinks(){
        try{
            const response = await api.get('/timeLine',{headers:{Authorization:localStorage.getItem('token')}});
            setLinks((response.data.link).reverse());
            if(response.data.error){
                if(response.data.error.token){
                    alert('Necessário logar novamente!')
                    history.push('/landing');
                }
            }
        }catch{
            alert('Erro no servidor');
        }
    }
    useEffect(()=>{
        buscarLinks();
    },[]);
    
    function openPopAvaliacao(id){
        setOpenEstrelas(true);
        setLinkSelecionado(id);
    }


    function listagem(){
        const list = links.map((link)=>(
            <div className="link" key={link._id}>
                <Link className="containerImagem" to={`linkProfile/${link._id}`}>
                    <img alt="imagem link" src={link.photograph}/>
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
        <PopAvaliacao open={openEstrelas} onClose={()=>setOpenEstrelas(false)} idLink={linkSelecionado} onSend={buscarLinks}/>
            <div className="container">
                {links === 'loading' ? <Loading/> : null}
                {links !== 'loading' ? listagem() : null }
                {links === [] ? <h1>Não encontramos links :( </h1> : null}
            </div>
        </div>
        <Rodape/>
        </>
    );
}