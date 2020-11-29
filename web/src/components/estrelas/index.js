import React from 'react';
import { BsStar, BsStarHalf,BsStarFill } from "react-icons/bs";
import './style.css';

export default function Estrelas(props){
    const n = props.average;
    if(n === null){
        return(
            <>
                <BsStarFill color="0A0A0A" size={props.size}/> 
                <BsStarFill color="0A0A0A" size={props.size}/> 
                <BsStarFill color="0A0A0A" size={props.size}/> 
                <BsStarFill color="0A0A0A" size={props.size}/> 
                <BsStarFill color="0A0A0A" size={props.size}/> 
            </>
            )
    }
    if(n===5){
        return(
        <>
            <BsStarFill color="FFEB0A" size={props.size}/> 
            <BsStarFill color="FFEB0A" size={props.size}/> 
            <BsStarFill color="FFEB0A" size={props.size}/> 
            <BsStarFill color="FFEB0A" size={props.size}/> 
            <BsStarFill color="FFEB0A" size={props.size}/> 
        </>
        )
    }
    if(n >=4){
        if(n<4.5){
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarHalf color="FFEB0A" size={props.size}/> 
                </>
            )
        }
    }
    if(n >=3){
        if(n<3.5){
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarHalf color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }
    }
    if(n >=2){
        if(n<2.5){
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarHalf color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/>
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }
    }
    if(n >=1){
        if(n<1.5){
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size={props.size}/> 
                <BsStarHalf color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/> 
                <BsStar color="FFEB0A" size={props.size}/>
                <BsStar color="FFEB0A" size={props.size}/> 
                </>
            )
        }
    }
    if(n>=0.5){
        return(<>
            <BsStarHalf color="FFEB0A" size={props.size}/> 
            <BsStar color="FFEB0A" size={props.size}/> 
            <BsStar color="FFEB0A" size={props.size}/> 
            <BsStar color="FFEB0A" size={props.size}/>
            <BsStar color="FFEB0A" size={props.size}/> 
            </>
        )
    }else{
        return(<>
            <BsStar color="FFEB0A" size={props.size}/>  
            <BsStar color="FFEB0A" size={props.size}/> 
            <BsStar color="FFEB0A" size={props.size}/> 
            <BsStar color="FFEB0A" size={props.size}/>
            <BsStar color="FFEB0A" size={props.size}/> 
            </>
        )
    }
}
