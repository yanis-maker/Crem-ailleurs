import './App.css';
import React from 'react';
import Home from './component/Home';
import DisplayPost from './component/DisplayPost';
import {Routes,Route} from 'react-router-dom';



class Application extends React.Component{
  render(){
    return(
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<DisplayPost />} />
        </Routes>
      </div>
    );
  }
}

export default Application;
