import React from 'react';
import './style.css';
import {CgUsb} from 'react-icons/cg';

export default function Loading(){
    return(
        <div className="loading">
            <div>
                <CgUsb color="FFEB0A" size="80"/>
            </div>
        </div>
    );
}