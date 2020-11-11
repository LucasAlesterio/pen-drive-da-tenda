import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Estrelas from '../../components/estrelas/index';
import PopUp from '../../components/popUp/index';
import Botao from '../../components/botao/index';
import { Link} from "react-router-dom";
import { BsStar,BsStarFill } from "react-icons/bs";
//import { useHistory } from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function TimeLine(){
    const [links,setLinks] = useState('');
    const [openEstrelas,setOpenEstrelas] = useState('');
    const [estrelas,setEstrelas] = useState({e1:false,e2:false,e3:false,e4:false,e5:false});
    const [estrelasSelecionadas,setEstrelasSelecionas] = useState({e1:false,e2:false,e3:false,e4:false,e5:false});
    const [estrelaSelecionada,setEstrelaSelecionada] = useState('');

    async function buscarLinks(){
        try{
        const response = await api.get('/timeLine',{headers:{Authorization:localStorage.getItem('token')}});
        setLinks(response.data.link);
        console.log(response.data.link)
        if(response.data.error){
            alert('Erro no servidor');
        }
    }catch{
        alert('Erro no servidor');
    }
    }
    useEffect(()=>{
        buscarLinks();
    },[]);

    function countStars(){
        if(estrelasSelecionadas.e5){
            return(5);
        }
        if(estrelasSelecionadas.e4){
            return(4);
        }
        if(estrelasSelecionadas.e3){
            return(3);
        }
        if(estrelasSelecionadas.e2){
            return(2);
        }
        if(estrelasSelecionadas.e1){
            return(1);
        }
        return(0);
    }
    async function enviarAvaliacao(){
        setOpenEstrelas(false);
        const stars = countStars();
        const response = await api.post('/rating',{stars,link:estrelaSelecionada},{headers:{Authorization:localStorage.getItem('token')}});
        buscarLinks();
        setEstrelasSelecionas({e1:false,e2:false,e3:false,e4:false,e5:false});
        setEstrelas({e1:false,e2:false,e3:false,e4:false,e5:false});

    }
    function onOpenEstrelas(id){
        setOpenEstrelas(true);
        setEstrelaSelecionada(id);
    }

    function listagem(){
        const list = links.map((link)=>(
            <div className="link" key={link._id}>
                <Link to={``}>
                    <img alt="imagem link" src={link.photograph}/>
                </Link>

                <div className="infoLink">
                    <div className="containerInfo">
                        <Link to={``}>
                            <h2>{link.name}</h2>
                        </Link>
                        <button className="estrelas" onClick={()=>onOpenEstrelas(link._id)}>
                            <Estrelas average={link.average} size={20}/>
                            <h2>{link.average}</h2>
                        </button>
                    </div>
                <div className="containerUsuario">
                    <Link to={`/profile/${link.user.user}`}>
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
        <PopUp title="Avaliar" open={openEstrelas} onClose={()=>setOpenEstrelas(false)}>
            <div className="popEstrelas">
                <button 
                onMouseEnter={()=>setEstrelas({e1:true,e2:false,e3:false,e4:false,e5:false})}
                onMouseLeave={()=>setEstrelas({e1:estrelasSelecionadas.e1,e2:estrelasSelecionadas.e2,e3:estrelasSelecionadas.e3,e4:estrelasSelecionadas.e4,e5:estrelasSelecionadas.e5})}
                onClick={()=>setEstrelasSelecionas({e1:true,e2:false,e3:false,e4:false,e5:false})}>
                    {estrelas.e1 ? <BsStarFill size="30" color="FFEB0A"/> : <BsStar size="30" color="FFEB0A"/>}
                    
                </button>
                <button
                onMouseEnter={()=>setEstrelas({e1:true,e2:true,e3:false,e4:false,e5:false})}
                onMouseLeave={()=>setEstrelas({e1:estrelasSelecionadas.e1,e2:estrelasSelecionadas.e2,e3:estrelasSelecionadas.e3,e4:estrelasSelecionadas.e4,e5:estrelasSelecionadas.e5})}
                onClick={()=>setEstrelasSelecionas({e1:true,e2:true,e3:false,e4:false,e5:false})}>
                    {estrelas.e2 ? <BsStarFill size="30" color="FFEB0A"/> : <BsStar size="30" color="FFEB0A"/>}
                </button>
                <button
                onMouseEnter={()=>setEstrelas({e1:true,e2:true,e3:true,e4:false,e5:false})}
                onMouseLeave={()=>setEstrelas({e1:estrelasSelecionadas.e1,e2:estrelasSelecionadas.e2,e3:estrelasSelecionadas.e3,e4:estrelasSelecionadas.e4,e5:estrelasSelecionadas.e5})}
                onClick={()=>setEstrelasSelecionas({e1:true,e2:true,e3:true,e4:false,e5:false})}>
                    {estrelas.e3 ? <BsStarFill size="30" color="FFEB0A"/> : <BsStar size="30" color="FFEB0A"/>}
                </button>
                <button
                onMouseEnter={()=>setEstrelas({e1:true,e2:true,e3:true,e4:true,e5:false})}
                onMouseLeave={()=>setEstrelas({e1:estrelasSelecionadas.e1,e2:estrelasSelecionadas.e2,e3:estrelasSelecionadas.e3,e4:estrelasSelecionadas.e4,e5:estrelasSelecionadas.e5})}
                onClick={()=>setEstrelasSelecionas({e1:true,e2:true,e3:true,e4:true,e5:false})}>
                    {estrelas.e4 ? <BsStarFill size="30" color="FFEB0A"/> : <BsStar size="30" color="FFEB0A"/>}
                </button>
                <button
                onMouseEnter={()=>setEstrelas({e1:true,e2:true,e3:true,e4:true,e5:true})}
                onMouseLeave={()=>setEstrelas({e1:estrelasSelecionadas.e1,e2:estrelasSelecionadas.e2,e3:estrelasSelecionadas.e3,e4:estrelasSelecionadas.e4,e5:estrelasSelecionadas.e5})}
                onClick={()=>setEstrelasSelecionas({e1:true,e2:true,e3:true,e4:true,e5:true})}>
                    {estrelas.e5 ? <BsStarFill size="30" color="FFEB0A"/> : <BsStar size="30" color="FFEB0A"/>}
                </button>
            </div>
            <br/>
                <Botao className="botaoEntrar" onClick={enviarAvaliacao}>Enviar</Botao>

        </PopUp>
            <div className="container">
                {links ? listagem() : <h1>Não encontramos links :( </h1>}
            </div>
        </div>
        <Rodape/>
        </>
    );
}