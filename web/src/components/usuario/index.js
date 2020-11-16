import React,{useEffect} from 'react';
import {Link} from 'react-router-dom';
import api from '../../service/api';
import './style.css';

export default function Usuario(props){
    async function updateFriend(){
        try{
            let response = await api.post('/updateFriend',{
                friend:props.id
            },{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.me){
                alert('Você não pode se seguir ;)');
            }
            props.refresh();
        }catch{
            alert('Erro no servidor!');
        }
    }
    return(
        <div className="usuario">
            <Link className="foto" to={`/profile/${props.user}`}>
                {props.photo?
                <img alt="foto usuario" src={props.photo}/>:<div className="fotoNull"/>}
            </Link>
            <div className="containerUsuario">
                <Link className="linkTag"to={`/profile/${props.user}`}>
                    <h2>@{props.user}</h2>
                </Link>
                {props.button && props.isFriend ? <button onClick={()=>updateFriend()}>Deixar de seguir</button>:null}
                {props.button && !props.isFriend ? <button onClick={()=>updateFriend()}>Seguir</button>:null}
            </div>
        </div>
    );
}