import React,{useEffect} from 'react';
import {Link} from 'react-router-dom';
import api from '../../service/api';
import './style.css';

export default function Usuario(props){
    async function updateFriend(){
        try{
            await api.post('/updateFriend',{
                friend:props.id
            },{headers:{Authorization:localStorage.getItem('token')}});
            props.refresh();
        }catch{
            alert('Erro no servidor!');
        }
    }
    return(
        <div className="usuario">
            <Link className="foto" to={`/profile/${props.user}`}>
                <img alt="foto usuario" src={props.photo}/>
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