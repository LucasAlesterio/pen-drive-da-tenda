import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
//import { useHistory } from "react-router-dom";
import CampoTexto from '../../components/campoTexto/index';
import {FiSearch,FiFilter} from 'react-icons/fi'
//import api from '../../service/api';
import './style.css';
export default function Search(){
//    let history = useHistory();
    const [busca,setBusca] = useState('');

    async function pesquisar(e){
        e.preventDefault();

    }
    return(
        <>
        <Cabecalho/>
        <div id="search">
                <div className="busca">
                    <form onSubmit={pesquisar}>
                        <div className="buscar">
                            <CampoTexto
                            className="campoBuscar"
                            type="text" 
                            placeholder="Buscar" 
                            value={busca}
                            onChange={e=>setBusca(e.target.value)}
                            />
                            <button type='submit'>
                                <FiSearch size='20'/>
                            </button>
                        </div>
                    </form>
                        <select name="Tipo" placeholder="Tipo">
                            <option selected value="">Tipo</option>
                            <option value="volvo">Volvo</option>
                            <option value="saab">Saab</option>
                            <option value="mercedes">Mercedes</option>
                            <option value="audi">Audi</option>
                        </select>
                        <FiFilter size='30'/>
                </div>
        </div>
        <Rodape/>
        </>
    );
}