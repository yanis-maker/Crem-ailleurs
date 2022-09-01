import React,{useState} from 'react';
import {FaArrowAltCircleRight,FaArrowAltCircleLeft} from 'react-icons/fa';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel'; 


function Slider(props) {
    let image=[];
    for(let i=1;i<props.images.length;i++){
        image.push(
            <div key={i}>
                <img src={props.images[i]} />
            </div>  

        );
    }

    

    return (
        <div className='w-11/12'>
            <Carousel>
                {image}
            </Carousel>   
        </div>
    )
}

export default Slider;
