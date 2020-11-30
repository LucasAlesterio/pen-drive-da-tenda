import React,{useState,useEffect,useCallback} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Botao from '../../components/botao/index';
import Estrelas from '../../components/estrelas/index';
import Loading from '../../components/loading/index';
import {useParams,Link,useHistory} from "react-router-dom";
import api from '../../service/api';
import './style.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FiCopy, FiTrash,FiEdit} from "react-icons/fi";
import { HiOutlineExternalLink } from "react-icons/hi";
import PopAvaliacao from '../../components/popAvaliar/index';
import PopUp from '../../components/popUp/index';


export default function LinkProfile(){
    const [link,setLink] = useState('');
    const [user,setUser] = useState('');
    const [tags,setTags] = useState([]);
    const [openEstrelas,setOpenEstrelas] = useState('');
    const [openExcluir,setOpenExcluir] = useState('');
    const [loading,setLoading] = useState(false);
    let history = useHistory();
    let {id} = useParams();

    const buscarDados = useCallback(async ()=>{
        setLoading(true);
        if(localStorage.getItem('token')){
            try{
                const response = await api.post('/dataLink',{id},{headers:{Authorization:localStorage.getItem('token')}});
                if(response.data.error){
                    if(response.data.token){
                        alert('Necessário logar novamente!')
                        history.push('/landing');
                        return null;
                    }
                    if(response.data.empty){
                        alert('Não encontramos esse link :( ');
                        history.push('/');
                        return null;
                    }
                }
                const tag =  response.data.link.tag;
                setTags(tag.map((a)=>{
                    return(a.name);
                }));
                setLink(response.data.link);
                setUser(response.data.user);
                setLoading(false);
            }catch(e){
                setLoading(false);
                alert(e);
            }
            setLoading(false);
            }else{
                history.push('/landing');
                return null;
            }
    },[history,id]);

    useEffect(()=>{
        buscarDados();
    },[buscarDados]);

    async function favoritar(){
        setLoading(true);
        try{
            await api.post('/updateFavorite',{link:id},{headers:{Authorization:localStorage.getItem('token')}});
            buscarDados();
            setLoading(false);
        }catch{
            setLoading(false);
            alert('Erro no servidor');
        }
    }

    async function excluir(){
        setLoading(true);
        try{
            await api.post('/deleteLink',{link:id},{headers:{Authorization:localStorage.getItem('token')}});
            setLoading(false);
            history.push(`/profile/${user.user}`);
        }catch{
            setLoading(false);
            alert('Erro no servidor');
        }
    }

    function copyToClipboard(){
        const el = document.createElement('textarea');
        el.value = link.link;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    function setNewAverage(n){
        setLoading(true);
        let list = link;
        list.average = n;
        setLink(list);
        setOpenEstrelas(false);
        setLoading(false);
    }

    return(
    <>
        <Cabecalho/>
        <PopAvaliacao open={openEstrelas} onClose={()=>{setOpenEstrelas(false)}} idLink={link._id} newAverage={(n)=>{setNewAverage(n)}}/>
        {loading ? <Loading /> : null}
        <div id="linkProfile">
            {link ? <> 
            <PopUp title="Excluir" open={openExcluir} onClose={()=>setOpenExcluir(false)}>
                <h4>Você deseja mesmo excluir este link?</h4>
                <div className="botoesConf">
                <Botao className="confirmacao" title="Sim, excluir link" onClick={()=>excluir()}>
                    Sim
                </Botao>
                <Botao className="confirmacao" title="Não, manter link" onClick={()=>setOpenExcluir(false)}>
                    Não
                </Botao>
                </div>
            </PopUp>
            {!link.isMy ? 
                <>
                {!link.isFavorite ?
                    <div className="favoritar">
                        <button title="Favoritar link" onClick={()=>favoritar()}>
                            <AiOutlineHeart size='45' color='C2C2C2'/>
                        </button>
                    </div>
                :<div className="favoritar">                        
                    <button title="Favoritar link" onClick={()=>favoritar()}>
                        <AiFillHeart size='45' color='C2C2C2'/>
                        </button>
                </div>}
                </>
                :<div className="favoritar" style={{justifyContent:'space-between'}} title="Editar link">
                    <Link to={`/editLink/${link._id}`}>
                        <FiEdit size="45" color='C2C2C2'/>
                    </Link>
                    <button title="Excluir link" onClick={()=>setOpenExcluir(true)}>
                        <FiTrash size='45' color='C2C2C2'/>
                    </button>
                </div>}
            <div className="container">
                <div className="foto">
                    <div className="fotoLink" style={!link.photograph ? {backgroundColor:'var(--rosa)'} : null}>
                        {link.photograph ? <img src={link.photograph} alt="capa"/> : null}
                    </div>
                    <div className="estrelas">
                        <button title="Avaliar" onClick={()=>setOpenEstrelas(true)}><Estrelas average={link.average} size={30}/></button>
                    </div>
                </div>
                <div className="infos">
                    <h1>{link.name}</h1>
                    <div className="botoes">

                        <Botao className="botao1" title="Copiar link" onClick={()=>copyToClipboard()}>
                            Copiar
                            <FiCopy size='35' color='151515'/>
                        </Botao>

                        <a rel='oopener noreferrer' target='_blank' href= {link.link} className="botao1" title="Abrir link em nova aba">
                                Abrir
                                <HiOutlineExternalLink size='37' color='151515'/>
                        </a>
                    </div>
                    
                    <Link to={`/profile/${user.user}`} className="usuario">
                            {user.photograph ? <img className="fotoUser" src={user.photograph} alt="foto usuario"/>:<div className="fotoNull"/>}
                            <h3>{user.user}</h3>
                    </Link>
                </div>
            </div>
            {link.description && <div className="descricao">{link.description}</div>}
                <div className="tagsContainer">
                    <div style={{backgroundColor:'var(--cinza-escuro)',color:'var(--amarelo)'}}>
                        <p>{link.type.name}</p>
                    </div>
            {tags.length > 0? 
                    (tags.map((t)=>(
                        <div key={t}>
                            <p>{t}</p>
                        </div>
                        )) )
                        :null}
                </div>
            </>:null}
        </div>
        <Rodape/>
    </>
    );
}