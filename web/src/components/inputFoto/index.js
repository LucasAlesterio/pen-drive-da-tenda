import React from 'react';
import {FiCamera} from 'react-icons/fi';
import './style.css';

export default function Inputfoto(props){
    async function savePic(e){
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            var e = reader.result;
            props.onChange(e);
        }
        reader.readAsDataURL(file);
    }
    return(
        <div id="inputFoto">
            <label htmlFor="image">
                <div>
                    {!props.value ? <FiCamera size="25" color="FFEB0A"/> : 
                        <div className="fotoPerfil" >
                            <img src={props.value} alt="foto perfil"/>
                        </div>
                    }
                </div>
            </label>
            <input 
            id="image" 
            type="file" 
            alt="foto perfil" 
            accept="image/x-png,image/jpeg,image/jpg"
            onChange={e=>savePic(e)}
            />
        </div>
    );
}
