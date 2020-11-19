import React,{useEffect,useState,useCallback} from 'react';
import './style.css';
import {FiChevronLeft,FiChevronRight} from 'react-icons/fi'


export default function Paginacao(props){
    const [list,setList] = useState([]);

    let maxPag = parseInt(props.count/props.pageSize);
    if((props.count/props.pageSize)>maxPag){
        maxPag += 1;
    }

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
    let page = props.page;
    let max = props.max;
    let onChange = props.onChange;

    const onPress = useCallback((i)=>{
        onChange(i);
    },[onChange]);

    const listagem = useCallback(()=>{
        let buttons = [];
        if(page < (max/2)){
            let a  = 0;
            if(max<maxPag){
                a = max;
            }else{
                a = maxPag;
            }
            for(let i = 0; i < a ; i++){
                buttons.push(<button className={page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>onPress(i)}>{i+1}</button>);
            }
            return buttons;
        }
        if((page + parseInt(max/2))>=maxPag){
            let b = 0
            if(max<maxPag){
                b = (maxPag)-max;
            }
            for(let i =b; i < maxPag ; i++){
                buttons.push(<button className={page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>onPress(i)}>{i+1}</button>);
            }
            return buttons;
        }
        for(let i = ((page)- parseInt(max/2)); i <= (parseInt(max/2)+page) ; i++){
            buttons.push(<button className={page === i ? "pageSelecionada" :"pages"} key={i} onClick={()=>onPress(i)}>{i+1}</button>);
        }
        return buttons;
    },[onPress,page,max,maxPag]);

    useEffect(()=>{
        setList(listagem());
    },[props.page,listagem,list.length,maxPag])

    return(<>
    {props.count && maxPag > 1?
        <div className="paginacao">
            <button className="pages" style={((props.page < (props.max/2)) || (props.max >= maxPag)) ? {visibility:'hidden'}:null} key={0} onClick={()=>props.onChange(0)}>{1}</button>
            <button className="setas" onClick={()=>anterior()}>
                <FiChevronLeft color="FFEB0A" size="30"/>
            </button>
            {list}
            <button className="setas" onClick={()=>proximo()}>
                <FiChevronRight color="FFEB0A" size="30"/>
            </button>
            <button className="pages" style={(((props.page + parseInt(props.max/2)) > (maxPag - 1)) || (props.max >= maxPag) ) ? {visibility:'hidden'}:null} key={maxPag} onClick={()=>props.onChange(maxPag-1)}>{maxPag}</button>
        </div>
    :null}
    </>);
}