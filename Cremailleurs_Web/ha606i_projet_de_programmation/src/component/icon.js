import * as React from "react";
import List from "@mui/material/List";
import PropTypes from 'prop-types';
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { createSvgIcon } from "@mui/material/utils";
import PlaceIcon from '@mui/icons-material/Place';
import BedIcon from '@mui/icons-material/Bed';

function FolderList(props) {
    const { post } = props;
  const HomeIcon = createSvgIcon(
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />,
    "Home"
  );
  return (
    <div >
    <List sx={{width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      <ListItem style={{position : "absolute",left: "60%",top: "10%"}}>
        <ListItemAvatar >
          <Avatar>
            <BedIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={post.room}/>
      </ListItem>
      <ListItem>
        <ListItemAvatar >
          <Avatar>
            <PlaceIcon color=""/>
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={post.city} secondary={post.codePostal} />
      </ListItem>
      <ListItem>
        <ListItemAvatar >
          <Avatar>
            <HomeIcon color="primary" />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={post.surface +" m²"} />
      </ListItem>
    </List>
    </div>
  );
}

FolderList.propTypes = {
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

export default FolderList;