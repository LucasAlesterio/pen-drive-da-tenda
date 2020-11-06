import React from 'react';
import './style.css';

export default function CampoTexto(props){
    const styleError = {
        border:'red solid 2px'
    }
    return(
        <div className={props.className} id="campoTexto">
            <div className="campo">
                <div className="icone">{props.children}</div>
                <input 
                style={props.error ? styleError : null}
                type={props.type} 
                placeholder={props.placeholder} 
                value={props.value} 
                onChange={e=>props.onChange(e)}
                />
            </div>
            {props.error ? <h4>{props.textError}</h4> : null}
        </div>
    );
}