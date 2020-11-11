import React from 'react';
import './style.css';

export default function Botao(props){
    return(
        <div className="botao">
            <button className={props.className} onClick={props.onClick} type={props.type} title={props.title}>
                {props.children}
            </button>
        </div>
    );
}