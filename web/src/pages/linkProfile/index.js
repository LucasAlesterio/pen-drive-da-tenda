import React,{useState,useEffect} from 'react';
import Rodape from '../../components/rodape/index';
import Cabecalho from '../../components/cabecalho/index';
import Botao from '../../components/botao/index';
import Estrelas from '../../components/estrelas/index';
//import api from '../../service/api';
import './style.css';
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { BsStar,BsStarFill } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { HiOutlineExternalLink } from "react-icons/hi";

var tags = ['Cachorro','Gato'];
export default function LinkProfile(){


    return(
    <>
        <Cabecalho/>
        <div id="linkProfile">
                <div className="favoritar"><AiOutlineHeart size='45' color='C2C2C2'/></div>
            <div className="container">
                <div className="foto">
                    <img alt="capa" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ16QrO1VETZaZNbV0kvoI84OEsBiCi8S6xarzalsogygLRojVO"/>
                    <div className="estrelas">
                        <Estrelas average={5} size={30}/>
                    </div>
                </div>
                <div className="infos">
                    <h1>Piratas do Caribe: a Vingança de Salazar</h1>
                    <div className="botoes">
                        <Botao className="botao1" title="Copiar link">
                            Copiar
                            <FiCopy size='35' color='151515'/>
                        </Botao>
                        <Botao className="botao1" title="Abrir link em nova aba">
                            Abrir
                            <HiOutlineExternalLink size='37' color='151515'/>
                        </Botao>
                    </div>
                    
                    <div className="usuario">
                        <img className="fotoUser" src="https://i.pinimg.com/564x/f3/d4/78/f3d478ab1d150a0806169eb2c9c9c7d9.jpg" alt="foto usuario"/>
                        <h3>@torrent_and_chill</h3>
                    </div>
                </div>
            </div>
            <div className="descricao">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.
            </div>
            <div className="tags">
                {tags.map((t)=>(
                    <div key={t}>
                        <p >{t}</p>
                    </div>
                ))}
            </div>
        </div>
        <Rodape/>
    </>
    );
}