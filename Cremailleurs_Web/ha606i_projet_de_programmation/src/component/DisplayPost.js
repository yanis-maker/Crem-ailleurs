import React,{useState,useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Slider from './Slider';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import FolderList from './icon'

function DisplayPost() {

    const props = useParams();
    const [img,setImg]=useState({});
    const [cont,setCont]=useState({});
    const [data,setData]=useState({});
    let api="http://toms34.fr:49152/id?";
    api = api  + `id=${props.id}&origin=paru_vendu_index`;
    useEffect(()=>{
        axios.get(api).then(response=>{
            setData(response.data);
            setImg(response.data.images);
            setCont(response.data.contact);
        });
    }, [api]);
    const images=img;
    const contact=cont;
    delete images[0];
    const type= data.type ? 'Appartement' : 'Maison';
    const leasing=data.leasing ? '/mois' : '';
    console.log(data);
    
    return(
        <div className="flex flex-row gap-32 border p-16 bg-white rounded-xl w-9/12 mx-auto my-16 h-11/12">
            <div>
                <Slider images={images}/>
                <div className='font-bold text-2xl' > {type} de {data.rooms} pièces, {data.surface} m²</div>
                <p>{data.city}, {data.postal}</p>
                <div className='font-bold text-xl'>{data.price} €{leasing}</div>
                <div className='w-96 border my-8'></div>
                <h1 className='font-thin text-md text-justify w-3/4'>{data.description}</h1>
            </div>
            

            <Grid>
                <div className='py-8 px-16 max-w-sm	shadow-md shadow-black bg-white border border-slate-200 rounded-xl shadow-slate-300'>
                    <h1 className='font-bold text-2xl text-center uppercase text-slate-800'>Contact</h1>
                    <h2 className='font-medium text-lg'>{contact.agency}</h2>
                </div>
            </Grid>
        </div>
            
    );
}
//export default (props) => <DisplayPost {...useParams()} {...props} />
export default DisplayPost;