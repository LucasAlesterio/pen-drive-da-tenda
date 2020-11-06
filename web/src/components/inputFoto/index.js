import React,{useState} from 'react';
import {FiCamera} from 'react-icons/fi';
import './style.css';

export default function Inputfoto(props){
    //event.target.files[0]
    const [foto,setFoto] = useState('');
    if(props.value && !foto){
        setFoto(props.value);
    }
    async function savePic(e){
        //e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            setFoto(reader.result);
            //console.log(reader.result);
            var e = reader.result;
            props.onChange(e);
        }
        reader.readAsDataURL(file);
    }
    return(
        <div id="inputFoto">
            <label htmlFor="image">
                <div>
                    {!foto ? <FiCamera size="25" color="FFEB0A"/> : 
                        <div className="fotoPerfil" >
                            <img src={foto} alt="foto perfil"/>
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
