import React,{useState,useEffect} from 'react';
import { BsStar, BsStarHalf,BsStarFill } from "react-icons/bs";
import './style.css';

export default function Estrelas(props){
    const n = props.average;
    if(n === null){
        return(
            <>
                <BsStarFill color="0A0A0A" size="20"/> 
                <BsStarFill color="0A0A0A" size="20"/> 
                <BsStarFill color="0A0A0A" size="20"/> 
                <BsStarFill color="0A0A0A" size="20"/> 
                <BsStarFill color="0A0A0A" size="20"/> 
            </>
            )
    }
    if(n===5){
        return(
        <>
            <BsStarFill color="FFEB0A" size="20"/> 
            <BsStarFill color="FFEB0A" size="20"/> 
            <BsStarFill color="FFEB0A" size="20"/> 
            <BsStarFill color="FFEB0A" size="20"/> 
            <BsStarFill color="FFEB0A" size="20"/> 
        </>
        )
    }
    if(n >=4){
        if(n<4.5){
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarHalf color="FFEB0A" size="20"/> 
                </>
            )
        }
    }
    if(n >=3){
        if(n<3.5){
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarHalf color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }
    }
    if(n >=2){
        if(n<2.5){
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarHalf color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/>
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }
    }
    if(n >=1){
        if(n<1.5){
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }else{
            return(<>
                <BsStarFill color="FFEB0A" size="20"/> 
                <BsStarHalf color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/> 
                <BsStar color="FFEB0A" size="20"/>
                <BsStar color="FFEB0A" size="20"/> 
                </>
            )
        }
    }
    if(n>0.5){
        return(<>
            <BsStarHalf color="FFEB0A" size="20"/> 
            <BsStar color="FFEB0A" size="20"/> 
            <BsStar color="FFEB0A" size="20"/> 
            <BsStar color="FFEB0A" size="20"/>
            <BsStar color="FFEB0A" size="20"/> 
            </>
        )
    }else{
        return(<>
            <BsStar color="FFEB0A" size="20"/>  
            <BsStar color="FFEB0A" size="20"/> 
            <BsStar color="FFEB0A" size="20"/> 
            <BsStar color="FFEB0A" size="20"/>
            <BsStar color="FFEB0A" size="20"/> 
            </>
        )
    }
    return null;
}
