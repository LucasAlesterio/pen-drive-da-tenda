import React,{useState} from 'react';
import Rodape from '../../components/rodape/index';
import Botao from '../../components/botao/index';
import PopUp from '../../components/popUp/index';
import CampoTexto from '../../components/campoTexto/index';
import InputFoto from '../../components/inputFoto/index';
import Loading from '../../components/loading/index';
import {FiUser,FiKey,FiMail,FiAtSign} from 'react-icons/fi'
import { useHistory } from "react-router-dom";
import api from '../../service/api';
import './style.css';

export default function Landing(){
    const [openLogin,setOpenLogin] = useState(false);
    const [openCadastro,setOpenCadastro] = useState(false);
    const [infoLogin,setInfoLogin] = useState({valor:'',erro:false,textoErro:''});
    const [senha,setSenha] = useState({valor:'',erro:false,textoErro:''});
    const [foto,setFoto] = useState(null);
    const [nome,setNome] = useState({valor:'',erro:false,textoErro:''});
    const [usuario,setUsuario] = useState({valor:'',erro:false,textoErro:''});
    const [email,setEmail] = useState({valor:'',erro:false,textoErro:''});
    const [confirmarSenha,setConfirmarSenha] = useState({valor:'',erro:false,textoErro:''});
    const [loading,setLoading] = useState(false);
    let history = useHistory();

    async function logar(e){
        e.preventDefault();
        setLoading(true);
        var response = '';
        var isEmail = false;
        if(!infoLogin.valor){
            setInfoLogin({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!senha.valor){
            setSenha({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        var letras = infoLogin.valor.split('');
        var text = '';
        letras.forEach((letra)=>{
            if(letra === '@'){
                isEmail = true;
            }
            text += letra;
        })
        //console.log(a);
        if(isEmail){
            try{
                response = await api.post('login',{
                    email:text,
                    password:senha.valor
                });
            }catch{
                setLoading(false);
                alert('Erro no servidor!');
            }
        }else{
            try{
                response = await api.post('login',{
                    user:text,
                    password:senha.valor
                });
            }catch{
                alert('Erro no servidor!');
            }
        }
            if(response.data.error){
                if(response.data.email){
                    setInfoLogin({valor:infoLogin.valor,erro:true,textoErro:"Email inválido"});
                    
                }
                if(response.data.user){
                    setInfoLogin({valor:infoLogin.valor,erro:true,textoErro:"Usuário inválido"});
                    
                }
                if(response.data.password){
                    setSenha({valor:usuario.valor,erro:true,textoErro:"Senha incorreta"});
                }
                setLoading(false);
                return null;
            }
        localStorage.setItem('token', response.data.token);
        setOpenLogin(false);
        history.push("/search");
    }
    async function cadastrar(e){
        e.preventDefault();
        setLoading(true);
        console.log(foto);
        var response = '';
        if(!nome.valor){
            setNome({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!email.valor){
            setEmail({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!usuario.valor){
            setUsuario({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(!senha.valor){
            setSenha({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(senha.valor.length < 8){
            setSenha({valor:senha.valor,erro:true,textoErro:"Necessário no minimo 8 caracteres"});
            setLoading(false);
            return null;
        }
        if(!confirmarSenha.valor){
            setConfirmarSenha({valor:"",erro:true,textoErro:"Campo obrigatório"});
            setLoading(false);
            return null;
        }
        if(senha.valor !== confirmarSenha.valor){
            setConfirmarSenha({valor:confirmarSenha.valor,erro:true,textoErro:"Senhas não coincidem"});
            setLoading(false);
            return null;
        }
        try{
            response = await api.post('addUser',{
                name:nome.valor,
                email:email.valor,
                password:senha.valor,
                user:usuario.valor,
                photograph:foto
            });
        }catch{
            alert('Erro no servidor!');
        }
        if(response.data.error){
            if(response.data.email){
                setEmail({valor:email.valor,erro:true,textoErro:"Email ja cadastrado"});
                
            }
            if(response.data.user){
                setUsuario({valor:usuario.valor,erro:true,textoErro:"Usuário ja cadastrado"});
            }
            if(response.data.photo){
                alert('Erro ao carregar a foto, tente novamente!');
            }
            setLoading(false);
            return null;
        }
        localStorage.setItem('token', response.data.token);
        setOpenCadastro(false);
        history.push("/search");
    }
    return(
    <>
        {loading ? <Loading/>:null}
        <PopUp title="Login" open={openLogin} onClose={()=>setOpenLogin(false)}>
            <form onSubmit={e=>logar(e)}>
                <CampoTexto 
                type="text" 
                placeholder="Email ou usuário" 
                value={infoLogin.valor}
                onChange={e=>setInfoLogin({valor:e.target.value,erro:false,textoErro:infoLogin.textoErro})}
                error={infoLogin.erro}
                textError={infoLogin.textoErro}
                >
                    <FiUser size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Senha" 
                value={senha.valor} 
                onChange={e=>setSenha({valor:e.target.value,erro:false,textoErro:senha.textoErro})} 
                error={senha.erro}
                textError={senha.textoErro}
                >
                    <FiKey size="15" color="151515"/>
                </CampoTexto>
                <br/>
                <Botao type="submit" className="botaoEntrar" >Entrar</Botao>
            </form>
        </PopUp>


        <PopUp title="Cadastro" open={openCadastro} onClose={()=>setOpenCadastro(false)}>
            <form onSubmit={e=>cadastrar(e)}>
                <InputFoto onChange={e=>setFoto(e)} value={foto}/>
                <CampoTexto 
                type="text" 
                placeholder="Nome" 
                value={nome.valor}
                onChange={e=>setNome({valor:e.target.value,erro:false,textoErro:nome.textoErro})}
                error={nome.erro}
                textError={nome.textoErro}
                >
                    <FiUser size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="email" 
                placeholder="Email" 
                value={email.valor}
                onChange={e=>setEmail({valor:e.target.value,erro:false,textoErro:email.textoErro})}
                error={email.erro}
                textError={email.textoErro}
                >
                    <FiMail size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="text" 
                placeholder="Usuário" 
                value={usuario.valor}
                onChange={e=>setUsuario({valor:e.target.value,erro:false,textoErro:usuario.textoErro})}
                error={usuario.erro}
                textError={usuario.textoErro}
                >
                    <FiAtSign size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Senha" 
                value={senha.valor}
                onChange={e=>setSenha({valor:e.target.value,erro:false,textoErro:senha.textoErro})}
                error={senha.erro}
                textError={senha.textoErro}
                >
                    <FiKey size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Confirmar senha" 
                value={confirmarSenha.valor}
                onChange={e=>setConfirmarSenha({valor:e.target.value,erro:false,textoErro:confirmarSenha.textoErro})}
                error={confirmarSenha.erro}
                textError={confirmarSenha.textoErro}
                >
                    <FiKey size="18" color="151515"/>
                </CampoTexto>
                <br/>
                <Botao className="botaoEntrar" type="submit" >Cadastrar</Botao>
            </form>
        </PopUp>


        <div id="landing">
            <div className="cabecalhoLanding"/>
            <div className="container">
                <div className="logo" ></div>
                <div className="containerBotao">
                    <Botao onClick={()=>setOpenLogin(true)} className="botao" >Login</Botao>
                    <Botao onClick={()=>setOpenCadastro(true)} className="botao" >Cadastrar</Botao>
                </div>
            </div>
        </div>
        <Rodape/>
    </>
    );
}