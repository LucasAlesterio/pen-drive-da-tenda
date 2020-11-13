import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import LinkList from '../../components/link/index';
import PopUp from '../../components/popUp/index';
import CampoTexto from '../../components/campoTexto/index';
import Botao from '../../components/botao/index';
import InputFoto from '../../components/inputFoto/index';
import { useParams,useHistory } from "react-router-dom";
import { FiUserPlus, FiUserCheck, FiEdit, FiLogOut, FiUser, FiAtSign, FiKey} from 'react-icons/fi';
import api from '../../service/api';
import './style.css';

export default function Profile(){

    let {user} = useParams();
    const [links,setLinks] = useState('');
    const [dataUser,setDataUser] = useState('');
    const [favorites,setFavorites] = useState('');
    const [aba,setAba] = useState(false);
    const [listagem,setListagem] = useState('');
    const [estilo,setEstilo] = useState(true);
    const [openEdit,setOpenEdit] = useState(false);
    const [openPass,setOpenPass] = useState(false);
    let history = useHistory();


    const [senhaAntiga,setSenhaAntiga] = useState({valor:'',erro:false,textoErro:''});
    const [senha,setSenha] = useState({valor:'',erro:false,textoErro:''});
    const [foto,setFoto] = useState(null);
    const [nome,setNome] = useState({valor:'',erro:false,textoErro:''});
    const [usuario,setUsuario] = useState({valor:'',erro:false,textoErro:''});
    const [confirmarSenha,setConfirmarSenha] = useState({valor:'',erro:false,textoErro:''});


    const styleOpen ={
        transition:'transform 0.25s',
        transform:'scale(1,1)'
    };

    const styleClose ={
        transition:'transform 0.25s',
        transform:'scale(0,1)'
    };

    function afterTime(){ 
        setEstilo(true)
        if(!aba && links){
            setListagem(listLinks());
        }
        if(aba && favorites){
            setListagem(listFavorites());
        }
    }

    useEffect(()=>{
        setEstilo(false)
        setTimeout(()=>afterTime(),250);
    },[aba])

    async function buscarDados(){
        try{

            const response = await api.post('/dataUser',{idUser:user},{headers:{Authorization:localStorage.getItem('token')}});
            //console.log(response);
            if(response.data.error){
                if(response.data.token){
                    history.push('/landing');
                    return null;
                }
            }
            setLinks(response.data.links);
            setDataUser(response.data.user);
            //console.log(response.data.user);
            setNome({valor:response.data.user.name,erro:false,textoErro:''})
            setUsuario({valor:response.data.user.user,erro:false,textoErro:''})
            setFoto(response.data.user.photograph);

            setFavorites(response.data.favorites);
            setListagem(response.data.links.map((link)=>(
                <LinkList id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
        }catch{
            alert('Erro no servidor');
        }
    }

    function listLinks(){
        const retorno  = links.map((link)=>(
            <LinkList id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
        ))
        return retorno;
    }

    function listFavorites(){
        const retorno  = favorites.map((link)=>(
            <LinkList id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
        ))
        return retorno;
    }

    useEffect(() => {
        buscarDados();
    }, [user])

    function desconectar(){
        localStorage.setItem('token','');
        history.push('/landing');
    }
    async function atualizarDados(){
        var response = '';
        if(!nome.valor){
            setNome({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            return null;
        }
        if(!usuario.valor){
            setUsuario({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            return null;
        }
        try{
            response = await api.post('/updateProfile',{
                user:usuario.valor,
                name:nome.valor,
                photograph:foto
            },{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.err){
                if(response.data.user){
                    setUsuario({valor:usuario.valor,erro:true,textoErro:'Usuário já existe!'});
                    return null;
                }
            }
            if(openPass){
                if(!senhaAntiga.valor){
                    setSenhaAntiga({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    return null;
                }
                if(!senha.valor){
                    setSenha({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    return null;
                }
                if(senha.valor.length < 8){
                    setSenha({valor:senha.valor,erro:true,textoErro:'Senha curta!'});
                    return null;
                }
                if(!confirmarSenha.valor){
                    setConfirmarSenha({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    return null;
                }
                if(senha.valor !== confirmarSenha.valor){
                    setConfirmarSenha({valor:confirmarSenha.valor,erro:true,textoErro:'Senhas não coincidem!'});
                    return null;
                }
                try{
                    response = await api.post('/updatePassword',{
                        oldPassword:senhaAntiga.valor,
                        newPassword:senha.valor
                    },{headers:{Authorization:localStorage.getItem('token')}});
                    if(response.data.error && response.data.password){
                        setSenhaAntiga({valor:'',erro:true,textoErro:'Senha incorreta!'});
                        return null;
                    }
                }catch{
                    alert('Erro no seridor!');
                }
            }
            setOpenEdit(false);
            buscarDados();
            history.push(`/profile/${usuario.valor}`);

        }catch{
            alert('Erro no servidor!');
        }
        
    }
    async function updateFriend(){
        try{
            await api.post('/updateFriend',{
                friend:dataUser.id
            },{headers:{Authorization:localStorage.getItem('token')}});
            buscarDados();
        }catch{
            alert('Erro no seridor!');
        }
    }

    return(
        <>
        <Cabecalho refresh={dataUser}/>
        <div id="profile">
            <div className="sair">
                {dataUser.me ? <button title="Deslogar" onClick={()=>desconectar()}><FiLogOut color="FF2626" size="45"/></button>:null}
            </div>
            <PopUp open={openEdit} onClose={()=>setOpenEdit(false)} title="Editar">
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
                type="text" 
                placeholder="Usuário" 
                value={usuario.valor}
                onChange={e=>setUsuario({valor:e.target.value,erro:false,textoErro:usuario.textoErro})}
                error={usuario.erro}
                textError={usuario.textoErro}
                >
                    <FiAtSign size="18" color="151515"/>
                </CampoTexto>
                <button className="buttonSenha" onClick={()=>setOpenPass(!openPass)}>Alterar minha senha</button>
                <div style={openPass ? {display:'block'}:{display:'none'}} className="containerSenha">
                    <CampoTexto 
                    type="password" 
                    placeholder="Senha antiga" 
                    value={senhaAntiga.valor}
                    onChange={e=>setSenhaAntiga({valor:e.target.value,erro:false,textoErro:senhaAntiga.textoErro})}
                    error={senhaAntiga.erro}
                    textError={senhaAntiga.textoErro}
                    >
                        <FiKey size="18" color="151515"/>
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
                </div>
                <br/>
                <Botao className="botaoEntrar" onClick={()=>atualizarDados()}>Concluir</Botao>

            </PopUp>
            <div className="infoProfile">
                <img alt="Foto perfil" src={dataUser.photograph}/>
                <div>
                    <h1>@{dataUser.user}</h1>
                    {dataUser.me ? 
                    <button title="Editar perfil" onClick={()=>setOpenEdit(true)}>
                        <FiEdit color="C2C2C2" size="30"/> 
                    </button>
                    : null}
                    {!dataUser.me && dataUser.isFriend ?<button onClick={()=>updateFriend()} title="Deixar de seguir">
                        <FiUserCheck color="C2C2C2" size="30"/>
                    </button>:null}
                    {!dataUser.me && !dataUser.isFriend ?<button onClick={()=>updateFriend()} title="Seguir">
                        <FiUserPlus color="C2C2C2" size="30"/> 
                    </button>:null}
                </div>
                <h2>{dataUser.name}</h2>
            </div>
            <div className="containerBotoes">
                {dataUser.me ?<> 
                <button onClick={()=>setAba(false)}>Meus links</button>
                <button onClick={()=>setAba(true)}>Favoritos</button>
                </>: <button disabled>Links</button> }
            </div>

            <div className="containerLinks" style={estilo ? styleOpen : styleClose}>
                {listagem}
            </div>

        </div>
        <Rodape/>
        </>
    );
}