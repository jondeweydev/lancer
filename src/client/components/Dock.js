import React from 'react'
import HomeIcon from '@material-ui/icons/Home';
import PersonIcon from '@material-ui/icons/Person';

const homeClick = () => {

}

const profileClick = () => {
    
}

function Dock() {
  return (
    <div id='dock'>
        <img id='homeButton' onClick={homeClick}></img>
        <img id='profileButton' onClick={profileClick}></img>
    </div>
  )
}

export default Dock