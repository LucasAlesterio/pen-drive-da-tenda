import React,{useState,useEffect}  from 'react';
import { Link} from "react-router-dom";
import {FiUsers, FiFilePlus, FiSearch, FiHome, FiHeart} from 'react-icons/fi';
import { useHistory } from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function Cabecalho(){
    let history = useHistory();
    const [dataUser,setDatauser] = useState({});

    async function testeToken(){
        const token = localStorage.getItem('token');
        var response = '';
        try{
            response = await api.get('/refreshToken',{ headers:{Authorization:token}});
            setDatauser(response.data);
            localStorage.setItem('token',response.data.token);
        }catch{
            alert('Error servidor');
        }
        if(response.data.error){
            history.push("/landing");
        }
    }
    useEffect(()=>{
        if(localStorage.getItem('token')){
            testeToken();
        }else{
            history.push("/landing");
        }
    },[history]);
    return(
        <div className="cabecalho">
            <div>
                <Link to='/' >
                    <FiHeart size='20' color='C2C2C2'/>
                </Link>
                <Link to='/' >
                    <FiUsers size='20' color='C2C2C2'/>
                </Link>
                <Link to='/' >
                    <FiFilePlus size='20' color='C2C2C2'/>
                </Link>
                <Link to='/search' >
                    <FiSearch size='20' color='C2C2C2'/>
                </Link>
                <Link to='/' >
                    <FiHome size='20' color='C2C2C2'/>
                </Link>
            </div>
            <Link to={`/profile/${dataUser.user ? dataUser.user : null}`}>
                <h4>{dataUser.user ? dataUser.user : null}</h4>
                <img src={dataUser.user ? dataUser.photograph : 'https://p7.hiclipart.com/preview/340/956/944/computer-icons-user-profile-head-ico-download.jpg'} alt="foto perfil"/>
            </Link>

        </div>
    );
}