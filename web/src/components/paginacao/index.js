import React from 'react';
import './style.css';
import {FiChevronLeft,FiChevronRight} from 'react-icons/fi'

export default function Paginacao(props){
    let maxPag = parseInt(props.count/props.pageSize);
    if((props.count/props.pageSize)>maxPag){
        maxPag += 1;
    }
    console.log(maxPag);
    function anterior(){
        if((props.page - 1)>= 0){
            props.onChange(props.page - 1);
        }
    }

    function proximo(){
        if((props.page + 1)< maxPag){
            props.onChange(props.page + 1);
        }
    }

    function listagem(){
        let buttons = [];
        if(props.page < (props.max/2)){
            let a  = 0;
            if(props.max<maxPag){
                a = props.max;
            }else{
                a = maxPag;
                //console.log(maxPag);
            }
            for(let i = 0; i < a ; i++){
                buttons.push(<button className={props.page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>props.onChange(i)}>{i+1}</button>);
            }
            return buttons;
        }
        if((props.page + parseInt(props.max/2))>=maxPag){
            for(let i = ((maxPag)-props.max); i < maxPag ; i++){
                buttons.push(<button className={props.page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>props.onChange(i)}>{i+1}</button>);
            }
            return buttons;
        }
        for(let i = ((props.page)- parseInt(props.max/2)); i <= (parseInt(props.max/2)+props.page) ; i++){
            buttons.push(<button className={props.page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>props.onChange(i)}>{i+1}</button>);
        }
        return buttons;
    }
    return(<>
    {props.count && maxPag > 1?
        <div className="paginacao">
            <button className="pages" style={((props.page < (props.max/2)) || (props.max >= maxPag)) ? {visibility:'hidden'}:null} key={0} onClick={()=>props.onChange(0)}>{1}</button>
            <button className="setas" onClick={()=>anterior()}>
                <FiChevronLeft color="FFEB0A" size="30"/>
            </button>
            {listagem()}
            <button className="setas" onClick={()=>proximo()}>
                <FiChevronRight color="FFEB0A" size="30"/>
            </button>
            <button className="pages" style={(((props.page + parseInt(props.max/2)) > (maxPag - 1)) || (props.max >= maxPag) ) ? {visibility:'hidden'}:null} key={maxPag} onClick={()=>props.onChange(maxPag-1)}>{maxPag}</button>
        </div>
    :null}
    </>);
}