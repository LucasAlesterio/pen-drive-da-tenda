import React,{useState} from 'react';
import Rodape from '../../components/rodape/index';
import Botao from '../../components/botao/index';
import PopUp from '../../components/popUp/index';
import CampoTexto from '../../components/campoTexto/index';
import InputFoto from '../../components/inputFoto/index';
import {FiUser,FiKey,FiMail,FiAtSign} from 'react-icons/fi'
import './style.css';

export default function Landing(){
    const [openLogin,setOpenLogin] = useState(false);
    const [openCadastro,setOpenCadastro] = useState(false);
    const [infoLogin,setInfoLogin] = useState({valor:'',erro:false,textoErro:''});
    const [senha,setSenha] = useState({valor:'',erro:false,textoErro:''});
    const [foto,setFoto] = useState('');
    const [nome,setNome] = useState({valor:'',erro:false,textoErro:''});
    const [usuario,setUsuario] = useState({valor:'',erro:false,textoErro:''});
    const [email,setEmail] = useState({valor:'',erro:false,textoErro:''});
    const [confirmarSenha,setConfirmarSenha] = useState({valor:'',erro:false,textoErro:''});

    async function logar(e){
        e.preventDefault();
        console.log('logar');
        setOpenLogin(false);
    }
    async function cadastrar(e){
        e.preventDefault();
        console.log('Cadastrar');
        setOpenCadastro(false);
    }
    return(
    <>
        <PopUp title="Login" open={openLogin} onClose={()=>setOpenLogin(false)}>
            <form onSubmit={e=>logar(e)}>
                <CampoTexto 
                type="email" 
                placeholder="Email ou usuário" 
                value={infoLogin.valor}
                onChange={e=>setInfoLogin({valor:e.target.value,erro:infoLogin.erro,textoErro:infoLogin.textoErro})}
                error={infoLogin.erro}
                textError={infoLogin.textoErro}
                >
                    <FiUser size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Senha" 
                value={senha.valor} 
                onChange={e=>setSenha({valor:e.target.value,erro:senha.erro,textoErro:senha.textoErro})} 
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
                onChange={e=>setNome({valor:e.target.value,erro:nome.erro,textoErro:nome.textoErro})}
                error={nome.erro}
                textError={nome.textoErro}
                >
                    <FiUser size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="email" 
                placeholder="Email" 
                value={email.valor}
                onChange={e=>setEmail({valor:e.target.value,erro:email.erro,textoErro:email.textoErro})}
                error={email.erro}
                textError={email.textoErro}
                >
                    <FiMail size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="text" 
                placeholder="Usuário" 
                value={usuario.valor}
                onChange={e=>setUsuario({valor:e.target.value,erro:usuario.erro,textoErro:usuario.textoErro})}
                error={usuario.erro}
                textError={usuario.textoErro}
                >
                    <FiAtSign size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Senha" 
                value={senha.valor}
                onChange={e=>setSenha({valor:e.target.value,erro:senha.erro,textoErro:senha.textoErro})}
                error={senha.erro}
                textError={senha.textoErro}
                >
                    <FiKey size="18" color="151515"/>
                </CampoTexto>
                <CampoTexto 
                type="password" 
                placeholder="Confirmar senha" 
                value={confirmarSenha.valor}
                onChange={e=>setConfirmarSenha({valor:e.target.value,erro:confirmarSenha.erro,textoErro:confirmarSenha.textoErro})}
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