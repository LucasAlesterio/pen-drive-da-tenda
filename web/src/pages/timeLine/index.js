import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Estrelas from '../../components/estrelas/index';
import { Link} from "react-router-dom";
import { BsStar, BsStarHalf,BsStarFill } from "react-icons/bs";
//import { useHistory } from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function TimeLine(){
    const [links,setLinks] = useState('');
    const [lista,setLista] = useState('');

    async function buscarLinks(){
        const response = await api.get('/timeLine',{headers:{Authorization:localStorage.getItem('token')}});
        setLinks(response.data.link);
        console.log(response.data.link)
        if(response.data.error){
            alert('Erro no servidor');
        }
    }
    useEffect(()=>{
        buscarLinks();
    },[]);

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
                        <div className="estrelas">
                            <Estrelas average={link.average}/>
                            <h2>{link.average}</h2>
                        </div>
                        
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
            <div className="container">
                {links ? listagem() : <h1>Não encontramos links :( </h1>}
            </div>
        </div>
        <Rodape/>
        </>
    );
}