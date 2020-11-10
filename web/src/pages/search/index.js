import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
//import { useHistory } from "react-router-dom";
import CampoTexto from '../../components/campoTexto/index';
import {FiSearch,FiFilter} from 'react-icons/fi'
import api from '../../service/api';
import './style.css';
export default function Search(){
//    let history = useHistory();
    const [busca,setBusca] = useState('');
    const [tipos,setTipos]  = useState([]);

    async function buscarTipos(){
        try{
        const response = await api.get('/types',{headers:{Authorization:localStorage.getItem('token')}});
        setTipos(response.data.types);
        //console.log(response.data.link)
        if(response.data.error){
            alert('Erro no servidor');
        }
    }catch{
        alert('Erro no servidor');
    }
    }
    useEffect(()=>{
        buscarTipos();
    },[]);

    function listTipos(){
        const retorno = tipos.map((tipo)=>(
        <option value={`${tipo}`}>{`${tipo}`}</option>
        ));
        return retorno;
    }

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
                            {tipos ? listTipos() : null}
                        </select>
                        <FiFilter size='30'/>
                </div>
        </div>
        <Rodape/>
        </>
    );
}