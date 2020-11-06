import React from 'react';
import './style.css';

export default function Botao(props){
    return(
        <button className={props.className} id="botao" onClick={props.onClick} type={props.type}>
            {props.children}
        </button>
    );
}