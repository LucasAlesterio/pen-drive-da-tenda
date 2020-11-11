import React from 'react';
import { Link } from 'react-router-dom';
import Estrelas from '../../components/estrelas/index';
import './style.css';

export default function LinkList(props){
    return(
        <div className="link">
            <Link key={props.id} to={`/linkProfile/${props.id}`} >
                <img className="fotoLink"alt="Foto link" src={props.photo}/>
            <div className="infos">
            <h4>{props.name}</h4>
            <div><Estrelas average={props.average}/></div>
            </div>
            </Link>
        </div>
    );
}