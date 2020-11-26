import React,{useState,useEffect, useCallback} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import LinkList from '../../components/link/index';
import PopUp from '../../components/popUp/index';
import CampoTexto from '../../components/campoTexto/index';
import Botao from '../../components/botao/index';
import InputFoto from '../../components/inputFoto/index';
import Loading from '../../components/loading/index';
import Paginacao from '../../components/paginacao/index';
import { useParams,useHistory } from "react-router-dom";
import { FiUserPlus, FiUserCheck, FiEdit, FiLogOut, FiUser, FiAtSign, FiKey, FiSearch} from 'react-icons/fi';
import api from '../../service/api';
import './style.css';
let oldCount = [];

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
    const [loading,setLoading] = useState(false);
    let history = useHistory();
    const [senhaAntiga,setSenhaAntiga] = useState({valor:'',erro:false,textoErro:''});
    const [senha,setSenha] = useState({valor:'',erro:false,textoErro:''});
    const [fotoUser,setFoto] = useState('');
    const [nome,setNome] = useState({valor:'',erro:false,textoErro:''});
    const [usuario,setUsuario] = useState({valor:'',erro:false,textoErro:''});
    const [confirmarSenha,setConfirmarSenha] = useState({valor:'',erro:false,textoErro:''});
    const [countL,setCountL] = useState(0);
    const [countF,setCountF] = useState(0);
    const [busca,setBusca] = useState('');
    const [page,setPage] = useState(0);
    const pageSize = 10;
    

    const styleOpen ={
        transition:'transform 0.25s',
        transform:'scale(1,1)'
    };

    const styleClose ={
        transition:'transform 0.25s',
        transform:'scale(0,1)'
    };

    async function buscar(e,thisPage){
        if(e){
            e.preventDefault();
        }
        if(aba){
            //favorites
            if(!busca){ 
                await api.post('/listMyFavorites',
                {idUser:user,pageSize:pageSize,page:thisPage},{headers:{Authorization:localStorage.getItem('token')}})
                .then(function(response){
                    setListagem(response.data.links.map((link)=>(
                        <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                    )));
                    setCountF(oldCount[1]);
                }).catch(function(error){
                    console.log(error);
                });
                return null;
            }
            await api.post('/searchInMyLinks',{user:user,pageSize:pageSize,page:thisPage,text:busca,myLinks:false},
            {headers:{Authorization:localStorage.getItem('token')}}).then( function(response){
                setListagem(response.data.links.map((link)=>(
                    <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
                setCountF(response.data.count);
            }).catch(function(error){
                console.log(error);
                alert('Erro no servidor')
            });
            setLoading(false);
        }else{
            //links
            if(!busca){
                const listLinks = await api.post('/listMyLinks',{idUser:user,pageSize:pageSize,page:thisPage},{headers:{Authorization:localStorage.getItem('token')}});
                setListagem(listLinks.data.links.map((link)=>(
                    <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
                setCountL(oldCount[0]);
                return null
            }
            await api.post('/searchInMyLinks',{user:user,pageSize:pageSize,page:thisPage,text:busca,myLinks:true},
            {headers:{Authorization:localStorage.getItem('token')}}).then( function(response){
                setListagem(response.data.links.map((link)=>(
                    <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
                setCountL(response.data.count);
            }).catch(function(error){
                console.log(error);
                alert('Erro no servidor')
            });
        }
    };
    const buscarDados = useCallback(async ()=>{
        try{
            const response = await api.post('/dataUser',{idUser:user},{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.error){
                if(response.data.token){
                    history.push('/landing');
                    return null;
                }
                if(response.data.empty){
                    alert('Não encontramos esse usuário :( ');
                    history.push('/');
                    return null;
                }
            }
            setDataUser(response.data);
            setNome({valor:response.data.name,erro:false,textoErro:''})
            setUsuario({valor:response.data.user,erro:false,textoErro:''})
            setFoto(response.data.photograph);
            const listLinks = await api.post('/listMyLinks',{idUser:user,pageSize:pageSize,page:0},{headers:{Authorization:localStorage.getItem('token')}});
            setLinks(listLinks.data.links);
            setCountL(listLinks.data.count);
            setListagem(listLinks.data.links.map((link)=>(
                <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
            oldCount.push(listLinks.data.count);
            if(response.data.me){
                const listMyFavorites = await api.post('/listMyFavorites',{pageSize:pageSize,page:0},{headers:{Authorization:localStorage.getItem('token')}});
                setFavorites(listMyFavorites.data.links);
                setCountF(listMyFavorites.data.count);
                oldCount.push(listMyFavorites.data.count);
            }
            }catch(error){
            alert(error);
        }
    },[history,user]);

    useEffect(() => {
        buscarDados();
    }, [user,buscarDados])

    function desconectar(){
        localStorage.setItem('token','');
        history.push('/landing');
    }
    async function atualizarDados(){
        setLoading(true);
        var response = '';
        if(!nome.valor){
            setNome({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            setLoading(false);
            return null;
        }
        if(!usuario.valor){
            setUsuario({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            setLoading(false);
            return null;
        }
        try{
            response = await api.post('/updateProfile',{
                user:usuario.valor,
                name:nome.valor,
                photograph:fotoUser
            },{headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.error){
                if(response.data.user){
                    setUsuario({valor:usuario.valor,erro:true,textoErro:'Usuário já existe!'});
                    setLoading(false);
                    return null;
                }
            }
            if(openPass){
                if(!senhaAntiga.valor){
                    setSenhaAntiga({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(!senha.valor){
                    setSenha({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(senha.valor.length < 8){
                    setSenha({valor:senha.valor,erro:true,textoErro:'Senha curta!'});
                    setLoading(false);
                    return null;
                }
                if(!confirmarSenha.valor){
                    setConfirmarSenha({valor:'',erro:true,textoErro:'Campo obrigatório!'});
                    setLoading(false);
                    return null;
                }
                if(senha.valor !== confirmarSenha.valor){
                    setConfirmarSenha({valor:confirmarSenha.valor,erro:true,textoErro:'Senhas não coincidem!'});
                    setLoading(false);
                    return null;
                }
                try{
                    response = await api.post('/updatePassword',{
                        oldPassword:senhaAntiga.valor,
                        newPassword:senha.valor
                    },{headers:{Authorization:localStorage.getItem('token')}});
                    if(response.data.error && response.data.password){
                        setSenhaAntiga({valor:'',erro:true,textoErro:'Senha incorreta!'});
                        setLoading(false);
                        return null;
                    }
                }catch{
                    setLoading(false);
                    alert('Erro no seridor!');
                }
            }
            setOpenEdit(false);
            buscarDados();
            history.push(`/profile/${usuario.valor}`);
            setLoading(false);

        }catch{
            setLoading(false);
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
    async function changeAba(a){
        setAba(a);
        setBusca('');
        setEstilo(false);
        setTimeout(()=>{
            
            if(!a && links){
                setCountL(oldCount[0]);
                setListagem(links.map((link)=>(
                    <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
            }
            if(a && favorites){
                setCountF(oldCount[1]);
                setListagem(favorites.map((link)=>(
                    <LinkList  key={link._id} id={link._id} average={link.average} photo={link.photograph} name={link.name}/>
                )));
            }
            setEstilo(true);
            },250);
        
    }
    function callBusca(e){
        setPage(0);
        buscar(e,0);
    }
    function setNextPage(page){
        setPage(page);
        buscar(null,page);
    }
    return(
        <>
        <Cabecalho refresh={dataUser}/>
        {loading ? <Loading/> : null}
        <div id="profile">
        {usuario.valor ?<>
            <div className="sair">
                {dataUser.me ? <button title="Deslogar" onClick={()=>desconectar()}><FiLogOut color="FF2626" size="45"/></button>:null}
            </div>
            <PopUp open={openEdit} onClose={()=>setOpenEdit(false)} title="Editar">
                <InputFoto onChange={e=>setFoto(e)} value={fotoUser}/>
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
                {dataUser.photograph ? <div className="containerFoto"> <img alt="Foto perfil" src={dataUser.photograph}/></div>:<div className="fotoNull"/>}
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
                <button onClick={()=>changeAba(false)}>Meus links</button>
                <button onClick={()=>changeAba(true)}>Favoritos</button>
                </>: <button disabled>Links</button> }
            </div>

            <div className="containerLinks" style={estilo ? styleOpen : styleClose}>
                <form onSubmit={(e)=>callBusca(e)}>
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
                </form>
                <div className="containerListagem">
                    {listagem}
                    {listagem.length <= 0 ?<div style={{width:'80vw'}}><h3>Ainda não há links :(</h3></div>:null}
                </div>
            </div>
                {aba ?
                <Paginacao count={countF} page={page} pageSize={pageSize} onChange={(a)=>setNextPage(a)} max={5}/>
                :<Paginacao count={countL} page={page} pageSize={pageSize} onChange={(a)=>setNextPage(a)} max={5}/>
            }
            </>:<Loading/>}
        </div>
        <Rodape/>
        </>
    );
}