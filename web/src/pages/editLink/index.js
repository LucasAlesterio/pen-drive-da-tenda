import React,{useState,useEffect} from 'react';
import './style.css';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import CampoTexto from '../../components/campoTexto/index';
import {FiCamera,FiPlusCircle,FiX} from 'react-icons/fi';
import Botao from '../../components/botao/index';
import { useHistory,useParams } from "react-router-dom";
import api from '../../service/api';
//import {RiImageAddLine} from 'react-icons/ri'

var tags = [];
export default function EditLink(){
    const [tipoSelecionado,setTipoSelecionado] = useState({valor:'',erro:false,textoErro:''});
    const [nome,setNome] = useState({valor:'',erro:false,textoErro:''});
    const [link,setLink] = useState({valor:'',erro:false,textoErro:''});
    const [descricao,setDescricao] = useState('');
    const [tag,setTag] = useState('');
    const [listTags,setListTags] = useState('');
    const [foto,setFoto] = useState('');
    let history = useHistory();
    let {id} = useParams();
    const styleErro = {
        border:'red solid 2px'
    }
    const tipos = ['Filme','Série','Anime','Livro','Arquivo','Mangá',];
    async function savePic(e){
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setFoto(reader.result);
        }
        reader.readAsDataURL(file);
    }
    function listTipos(){
        const retorno = tipos.map((tipo)=>(
        <option key={tipo} value={tipo}>{tipo}</option>
        ));
        return retorno;
    }
    function listagemTag(){
        const response = tags.map((t)=>(
            <div key={t}>
                <p>{t}</p>
                <button  onClick={()=>deleteTag(t)}>
                    <FiX  color="151515" size="20"/>
                </button>
            </div>
        ));
        setListTags(response);
    }

    function addTag(e){
        e.preventDefault();
        if(tags.indexOf(tag) === -1){
            tags.push(tag);
            listagemTag();
        }
        setTag('');
    }
    function deleteTag(t){
        var i = 0;
        while (i < tags.length) {
            if (tags[i] === t) {
                tags.splice(i, 1);
            } else {
                ++i;
            }
        }
        listagemTag();
    }
    function jsonTags(){
        return(
            tags.map((a)=>{
                return({name:a})
            })
        );
    }
    useEffect(()=>{
        buscarDados();
    },[])
    async function buscarDados(){
        if(localStorage.getItem('token')){
        try{
                const response = await api.post('/dataLink',{id},{headers:{Authorization:localStorage.getItem('token')}});
                const tag =  response.data.link.tag;
                if(response.data.error){
                    if(response.data.error.token){
                        alert('Necessário logar novamente!')
                        history.push('/landing');
                        return null;
                    }
                }
                var _link = response.data.link;
                tags = (tag.map((a)=>{
                    return(a.name);
                }));
                setNome({valor:_link.name,erro:false,textoErro:''});
                setFoto(_link.photograph);
                setLink({valor:_link.link,erro:false,textoErro:''});
                setTipoSelecionado({valor:_link.type.name,erro:false,textoErro:''});
                setDescricao(_link.description);
                listagemTag();
                //setUser(response.data.user);
            }catch{
                alert('Erro no servidor');
            }
            }else{
                history.push('/landing');
                return null;
            }
    }
    async function cadastrar(){ 
        //var json = jsonTags();
        if(!nome.valor){
            setNome({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            return null;
        }
        if(!link.valor){
            setLink({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            return null;
        }
        if(tipoSelecionado.valor === ""){
            setTipoSelecionado({valor:'',erro:true,textoErro:'Campo obrigatório!'})
            return null;
        }
        try{
            const response = await api.post('/updateLink',
            {
                id:id,
                name:nome.valor,
                type:{
                    name:tipoSelecionado.valor
                },
                description:descricao,
                link:link.valor,
                tag:jsonTags(),
                photograph:foto
            },
            {headers:{Authorization:localStorage.getItem('token')}});
            if(response.data.erro){
                if(response.data.token){
                    history.push('/landing');
                }
            }else{
                history.push(`/linkProfile/${id}`);
            }

        }catch{
            alert('Erro no servidor');
        }
    }
    return(
        <>
        <Cabecalho/>
        <div id="addLink">
            <h1>Edição de link</h1>
            <section>
                <div className="foto">
                    <label htmlFor="imageLink">
                        <div>
                            {!foto ? <FiCamera size="40" color="FFEB0A"/> : 
                                <div className="fotoPerfil" >
                                    <img src={foto} alt="foto perfil"/>
                                </div>
                            }
                        </div>
                    </label>
                    <input 
                    id="imageLink" 
                    type="file" 
                    alt="foto perfil" 
                    accept="image/x-png,image/jpeg,image/jpg"
                    onChange={e=>savePic(e)}
                    />
                </div>
                <div className="inputs">
                    <CampoTexto 
                    type="text" 
                    placeholder="Nome"
                    value={nome.valor}
                    onChange={e=>setNome({valor:e.target.value,erro:false,textoErro:nome.textoErro})}
                    error={nome.erro}
                    textError={nome.textoErro}
                    />
                    <CampoTexto 
                    type="text" 
                    placeholder="Link"
                    value={link.valor}
                    onChange={e=>setLink({valor:e.target.value,erro:false,textoErro:link.textoErro})}
                    error={link.erro}
                    textError={link.textoErro}
                    />
                    <div  style={{width:'100%'}}>
                    <select name="Tipo" style={tipoSelecionado.erro ? styleErro : null}
                    placeholder="Tipo" value={tipoSelecionado.valor} 
                    onChange={(e)=>setTipoSelecionado({valor:e.target.value,erro:false,textoErro:nome.textoErro})}>
                            <option value="" >Tipo</option>
                            {tipos ? listTipos() : null}
                    </select>
                    {tipoSelecionado.erro ?
                    <p style={{color:'red',fontSize:'1.2rem'}}>{tipoSelecionado.textoErro}</p> 
                    :null}
                    </div>
                    
                </div>
            </section>
            <div className="container">
                <div className="descricao">
                    <textarea placeholder="Descrição" value={descricao} onChange={(e)=>setDescricao(e.target.value)} />
                </div>
                <div className="linha"/>
                <div className="tag">
                    <form onSubmit={addTag}>
                        <input type="text" onChange={(e)=>setTag(e.target.value)} placeholder="Adicionar tags" value={tag}/>
                        <button type="submit"><FiPlusCircle color="C2C2C2" size="25"/></button>
                    </form>
                    <div className="containerTag">
                            {listTags}
                    </div>
                </div>
            </div>
            <Botao onClick={cadastrar} className="botao">Atualizar</Botao>
        </div>
        <Rodape/>
        </>
    );
}