import React from 'react';
import {FiInstagram,FiFacebook,FiTwitter} from 'react-icons/fi'
import './style.css';

export default function Rodape(){
    return(
        <div id="rodape">
            <div>
                <FiTwitter size="25" color="C2C2C2"/>
                <FiFacebook size="25" color="C2C2C2"/>
                <FiInstagram size="25" color="C2C2C2"/>
            </div>
        </div>
    );
}
