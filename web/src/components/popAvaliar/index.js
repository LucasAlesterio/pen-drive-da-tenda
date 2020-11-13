import React,{useState,useEffect} from 'react';
import PopUp from '../../components/popUp/index';
import Botao from '../../components/botao/index';
import { BsStar,BsStarFill } from "react-icons/bs";
import api from '../../service/api';
import './style.css';

export default function PopAvaliar(props){
    const [estrelas,setEstrelas] = useState({e1:false,e2:false,e3:false,e4:false,e5:false});
    const [estrelasSelecionadas,setEstrelasSelecionas] = useState({e1:false,e2:false,e3:false,e4:false,e5:false});
    const [estrelaSelecionada,setEstrelaSelecionada] = useState('');
    
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
        props.onClose();
        const stars = countStars();
        console.log(stars);
        await api.post('/rating',{stars,link:estrelaSelecionada},{headers:{Authorization:localStorage.getItem('token')}});
        setEstrelasSelecionas({e1:false,e2:false,e3:false,e4:false,e5:false});
        setEstrelas({e1:false,e2:false,e3:false,e4:false,e5:false});
        props.onSend();
    }

    useEffect(() => {
        if(props.open){
            setEstrelaSelecionada(props.idLink);
        }
    }, [props.open])

    return(
        <div id="popAvaliar">
        <PopUp title="Avaliar" open={props.open} onClose={()=>props.onClose()}>
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
        </div>
    );
}