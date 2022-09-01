import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import FolderList from './icon'

function FeaturedPost(props) {
  const { post } = props;
  const leasing=post.prix.includes("/mois") ? 'Location' : 'Vente';
  return (
    <Grid item xs={1} md={10} style={{width : '75%' , marginLeft: '12%' ,height:"30%",minWidth: "75%"}} className="grid">
      <CardActionArea component="a" href={"/post/"+post.id} style={{minwidth : "100%"}}>
        <Card sx={{ display: 'flex' }}>
          <img src={post.image} style={{width:"30%",height:"auto",minWidth:"25%"}}/>
          <CardContent sx={{ flex: 1 ,width:"fit-content%"}}>
            <Typography component="h2" variant="h5">
              {leasing} {post.title}
            </Typography>
            <Typography variant="h4" color="text.secondary" name='price' style={{position: 'absolute' , flex : 1, top: '8px', right : post.prix.length/3.7 +"em", width: '100px' ,textAlign:'right'}}>
              {post.prix}
            </Typography>
              <FolderList key={post.title} post={post} />
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  );
}

FeaturedPost.propTypes = {
  post: PropTypes.shape({
    image: PropTypes.string.isRequired,
    imageLabel: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    surface: PropTypes.number.isRequired,
    room: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    codePostal: PropTypes.string.isRequired,
  }).isRequired,
};

export default FeaturedPost;