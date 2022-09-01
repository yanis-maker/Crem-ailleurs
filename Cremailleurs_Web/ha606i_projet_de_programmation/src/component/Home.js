//import logo from './logo.svg';
import '../App.css';
import React,{useEffect} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import Grid from '@mui/material/Grid';
import FeaturedPost from './FeaturedPost';
import tw from 'twrnc';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import background from "../asset/illustration.png";



class Home extends React.Component{
  constructor(props) {
    super(props);
    this.state = {value: ''};
    this.state.showPrice = false;
    this.state.showSurface= false;
    this.state.showType= false;
    this.state.showLeasing= false;
    this.state.Maison=false;
    this.state.Appart=false;
    this.state.Lease=false;
    this.state.Buy=false;
    this.state.index=0;
    
    this.state.ville="";
    this.state.minthune="";
    this.state.maxthune="";
    this.state.minsurface="";
    this.state.maxsurface="";
    this.state.cities=[];
    this.state.suggestions=[];
    

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.showAll = this.showAll.bind(this);

  }

  componentDidMount(){
    const loadCities = async () => {const response = await axios.get('http://toms34.fr:49152/cities');
    this.setState({cities:response.data})}
    loadCities();
  }

  

  handleChange(event){
    event.preventDefault();
    if(event.target.name==="city_search"){
      this.setState({ville: event.target.value});
      if (!this.state.showLeasing){this.setState({showLeasing : true});}
      if(event.target.value.length>0){
        const regex=new RegExp(event.target.value,"i");
        const suggestions=this.state.cities.sort().filter(city => regex.test(city));
        this.setState({suggestions:suggestions});
      }
      //this.setState({width : event.target.value.length/10 + 20+ "vW"});
    }

    else if(event.target.name==="minthune"){
      this.setState({minthune: event.target.value});
      if (!this.state.showSurface && this.state.maxthune!==undefined){this.setState({showSurface :true});}
    }
    else if(event.target.name==="maxthune"){
      this.setState({maxthune: event.target.value});
      if (!this.state.showSurface && this.state.minthune!==undefined){this.setState({showSurface :true});}
    }

    else if(event.target.name==="minsurface"){
      this.setState({minsurface: event.target.value});
    }
    else if(event.target.name==="maxsurface"){
      this.setState({maxsurface: event.target.value});
    }
  }


  handleSubmit(event) { // embeche le submit de faire un post et reload la page
    event.preventDefault();
    let api="http://toms34.fr:49152/search?";

    
    if(this.state.ville.length>0){api+=`&city=${this.state.ville}`}//on met la ville au format

    if(this.state.minthune.length>0){api += `&minprice=${this.state.minthune}`}
    else{api+="&minprice=0";}

    if(this.state.maxthune.length>0){api+=`&maxprice=${this.state.maxthune}`}

    if(this.state.minsurface.length>0){api+=`&minsurface=${this.state.minsurface}`}

    if(this.state.maxsurface.length>0){api+=`&maxsurface=${this.state.maxsurface}`}

    if(this.state.Maison!==false || this.state.Appart!==false){api+=`&type=${this.state.Maison ? 0 : 1}`;}
    if(this.state.Lease!==false || this.state.Buy!==false){api+=`&leasing=${this.state.Lease ? 1 : 0}`;}
    console.log(api);
    fetch(api)
        .then(response => response.json()).then(data => this.Listing(data));
  }
  
  handleClick(event){
    event.preventDefault();
    if(event.target.name==="Location"){
      this.setState({Lease: !this.state.Lease});
      this.setState({Buy: false});
      if(!this.state.showType){this.setState({showType : true});}
    }
    else if(event.target.name==="Achat"){
      this.setState({Buy: !this.state.Buy});
      this.setState({Lease: false});
      if(!this.state.showType){this.setState({showType : true});}
    }
    
    if(event.target.name==="Maison"){
      this.setState({Maison : !this.state.Maison});
      this.setState({Appart : false});
      if (!this.state.showPrice){this.setState({showPrice : true});}
      if(!this.state.showSurface){this.setState({showSurface : true});}
    }
    else if(event.target.name==="Appart"){
      this.setState({Maison : false});
      this.setState({Appart : !this.state.Appart});
      if (!this.state.showPrice){this.setState({showPrice : true});}
      if(!this.state.showSurface){this.setState({showSurface : true});}
    }
    
    
  }
  
  Listing(data,number=0){
    console.log(data);
    ReactDOM.render(<div id='Listings'></div>,document.getElementById('root'));
    const featuredPosts = [];
    data.forEach((element,i) => {
      if(i>=this.state.index*10 && i<(this.state.index+1)*10){
      let type ,type2="";
      if(element["type"]){type="Appartement";}
      else{type="Maison";}
      if(element["leasing"]){type2="/mois"}

      featuredPosts.push(
        {
          id: element["id"],
          index:i,
          title: type + " de "+ element["surface"] +" m²",
          prix: element["price"] +"€" + type2,
          room: element["rooms"],
          city: element["city"],
          codePostal: element["postal"],
          surface: element["surface"],
          image: element["images"][0],
          imageLabel: 'Image Text',
        }
      )}
    }
    );
    const mod10=[];
    for (var i=0;i < Math.max(featuredPosts.length /10,10); i++) {
      if(number-3>0){mod10[i]=number+i-3;}
      else {mod10[i]=+i; }
    }
      const Madiv = () => (
        <div className="annonces" >
          <a href='/' style={{poistion:"absolute",top:"20px",left:"20px"}}><ManageSearchIcon color="primary"/> </a>
          <Grid container={true} spacing={2}>
            {featuredPosts.map((post,index) => (
              <FeaturedPost key={post.id} post={post} index={index}/>
          ))}
          </Grid>
          <ButtonGroup style={{left:"center"}} ariant="contained" aria-label="outlined primary button group">
            {mod10.map((i,index)=>(         
              <Button onClick={()=> {this.state.index=i;this.Listing(data,i);}} key={i}>{i}</Button>
            ))}
          </ButtonGroup>
        </div>
    );
    ReactDOM.render(<Madiv/>,document.getElementById('Listings')); 
    
  }
  showAll(event){
    event.preventDefault();
    if(!(this.state.showPrice && this.state.showSurface && this.state.showType && this.state.showLeasing)){
      this.setState({showType : true});
      this.setState({showPrice : true});
      this.setState({showSurface : true});
      this.setState({showLeasing : true});
    }
    else{
      this.setState({showType : false});
      this.setState({showPrice : false});
      this.setState({showSurface : false});
      this.setState({showLeasing : false});
    }
  }

  selectSuggestion(value){
    console.log(value);
    this.setState({ville: value, suggestions:[]});
  }
  renderSuggestions(){
    if(this.state.suggestions.length>0){
      return(
        <ul className=" absolute w-8/12 h-48 z-30 bg-white border border-gray-300 mt-1  overflow-hidden overflow-y-scroll rounded-md shadow-md suggestions">
          {this.state.suggestions.map((city) => (
            <li className='px-4 py-2 hover:bg-gray-100' onClick={()=>this.selectSuggestion(city)}>{city}</li>
          ))}
        </ul>
      );
    }    
  }

  render(){
    const textButtonWhite = tw.style('text-center leading-0 text-lg text-white font-bold');
    const textButtonBlack = tw.style('text-center leading-none text-lg text-black font-bold');
    const btnRose = tw.style('w-38 h-12 py-3 bg-rose-700  rounded-xl');
    const btnGray = tw.style('w-38 h-12 py-3 bg-gray-300 hover:bg-rose-700 rounded-xl');
    const btnBlue = tw.style('w-38 h-12 py-3 bg-blue-900 rounded-xl left-25 top-4');
    const inputStyle = tw.style('w-38 h-12 bg-white rounded-xl text-center border border-slate-200');
    console.log(this.state.Appart);

    return (
      <>
      <div className="w-screen h-screen bg-cover bg-center z-0 absolute top-0 right-0" style={{ backgroundImage: `url(${background})` }}></div>
        <form onSubmit={this.handleSubmit} id="Formulaire" className="z-30 relative border px-32 py-16 bg-white rounded-md max-w-xl w-xl z-10 m-auto mt-24 mb-8" >

        <h1 className="text-slate-800 text-center font-sans text-4xl font-bold">Crem'Ailleurs !</h1>
        <h2 className="text-slate-700 text-center font-sans text-xl font-semibold pb-16 pt-4" >La crème de la crème de l'immobilier.</h2>

        <div className="search-container">
          <input type="text" name="city_search" style={{width : "100%"}} value={this.state.ville} onChange={this.handleChange} clearTextOnFocus= {true} placeholder="Paris" className="search-input" />
          {this.renderSuggestions()}
          <button className="search-button" >
              <i className="fas fa-search"></i>
          </button>
        </div>

        <div className={`py-4 ${ this.state.showLeasing ? "block" : "hidden"} `}>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={this.handleClick} name ="Location" style={this.state.Lease ? btnRose : btnGray} >
              Louer
            </button>

            <button onClick={this.handleClick} name ="Achat" style={this.state.Buy ? btnRose : btnGray } >
              Acheter
            </button>
          </div>
        </div>

        <div className={`py-4 ${ this.state.showType ? "block" : "hidden"} `}>
          <div className="grid grid-cols-2 gap-4">
            <button onClick={this.handleClick} name ="Maison" style={this.state.Maison ? btnRose : btnGray} >
              Maison
            </button>

            <button onClick={this.handleClick} name ="Appart" style={this.state.Appart ? btnRose : btnGray } >
              Appartement
            </button>
          </div>
        </div>
        <div className={`py-4 ${ this.state.showSurface && this.state.showPrice ? "block" : "hidden"} `}>
          <div className="grid grid-cols-2 gap-4">
            {/* <i style={{top: "25%",left: "80%"}}>€</i> */}
            <input name="minthune" value={this.state.thune} style={inputStyle} onChange={this.handleChange} placeholder="0€" className='thune' pattern='[0-9]*'/>

            {/* <i style={{top: "25%",left :"80%"}}>€</i> */}
            <input name="maxthune" value={this.state.thune} style={inputStyle} onChange={this.handleChange} placeholder="9999999€" className='thune' pattern='[0-9]*'/>

            {/* <i style={{top : "25%",left:"80%"}}>m²</i> */}
            <input type="text" name="minsurface" style={inputStyle}  value={this.state.minsurface} onChange={this.handleChange} placeholder="0m²" className='Surface' pattern='[0-9]*'></input>

            {/* <i style={{top : "25%",left:"80%"}}>m²</i> */}
            <input type="text" name="maxsurface" style={inputStyle} value={this.state.maxsurface} onChange={this.handleChange} placeholder="999999m²" className='Surface' pattern='[0-9]*'></input>
          </div>

        </div>


        <div className="mx-auto mt-8 w-fit">
          <Button sx={{ color: 'white', backgroundColor: 'Red'  }}
                        endIcon={ this.state.showSurface && this.state.showPrice && this.state.showType && this.state.showLeasing ? <ArrowDropUpIcon /> : <ArrowDropDownIcon/>} onClick={this.showAll} variant="contained" >
              Filtres
          </Button>


        </div>

        </form></>
      
  );
  
  }
}

export default Home;
