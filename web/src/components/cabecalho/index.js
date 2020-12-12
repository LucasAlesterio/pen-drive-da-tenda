import React,{useState,useEffect}  from 'react';
import { Link} from "react-router-dom";
import {FiUsers, FiFilePlus, FiSearch, FiHome} from 'react-icons/fi';
import { useHistory } from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function Cabecalho(props){
    let history = useHistory();
    const [dataUser,setDatauser] = useState({});


    useEffect(()=>{
        if(localStorage.getItem('token')){
            //testeToken();
            async function testeToken(){
                const token = localStorage.getItem('token');
                var response = '';
                try{
                    response = await api.get('/refreshToken',{ headers:{Authorization:token}});
                    setDatauser(response.data);
                    localStorage.setItem('token',response.data.token);
                    if(response.data){
                    if(response.data.error){
                        history.push("/landing");
                    }
                }
                }catch{
                    alert('Error servidor');
                }
                
            }
            testeToken()
        }else{
            history.push("/landing");
        }
    },[history,props.refresh]);
    return(
        <div className="cabecalho">
            <div>
                <Link to='/friends' title="Amigos">
                    <FiUsers size='20' color='C2C2C2'/>
                </Link>
                <Link to='/addLink' title="Adicionar link">
                    <FiFilePlus size='20' color='C2C2C2'/>
                </Link>
                <Link to='/search' title="Buscar">
                    <FiSearch size='20' color='C2C2C2'/>
                </Link>
                <Link to='/' title="Timeline">
                    <FiHome size='20' color='C2C2C2'/>
                </Link>
            </div>
            <Link to={`/profile/${dataUser.user ? dataUser.user : null}`} title="Ver perfil">
                <h4>{dataUser.user ? dataUser.user : null}</h4>
                {dataUser.mini ?
                <div><img src={dataUser.mini} alt="foto perfil"/></div>: <div className="fotoN"/>}
            </Link>

        </div>
    );
}