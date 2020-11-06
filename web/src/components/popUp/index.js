import React from 'react';
import {FiX} from 'react-icons/fi';
import './style.css';

export default function PopUp(props){
    const styleClose = {
        display:'none'
    };
    const styleOpen = {
        display:'flex'
    };

    function close(){
        props.onClose();
    }
    return(
    <div id="popUp" style={props.open ? styleOpen : styleClose}>
        <button onClick={close}></button>
            <div className="corpo">
                <div className="cabecalho">
                    <h3>{props.title}</h3>
                </div>
                <div className="containerFechar">
                    <button onClick={close}> <FiX size="" color="C2C2C2" /> </button>
                </div>
                <div className="conteudo">
                    {props.children}
                </div>

            </div>
    </div>
    );
}