import React from "react";
import { Link, Route, Routes } from "react-router-dom";

import ListContainer from "./components/ListContainer";
import AddContainer from "./components/AddContainer";
import ProfileContainer from "./components/ProfileContainer";

import HomeIcon from "@material-ui/icons/Home";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from '@material-ui/icons/Add';
import styled from "styled-components";

const HomeButton = styled(HomeIcon)``;
const AddButton = styled(AddIcon)``;
const ProfileButton = styled(PersonIcon)``;

export function App() {
  return (
    <div id="react">
      <div id="header">
        <div id="title">LANCER</div>
      </div>
      <div id="dock">
        <Link to="/" className="dockLink">
          <HomeButton id="homeButton" className="dockButton" />
        </Link>
        <Link to="/add" className="dockLink">
          <AddButton id="addButton" className="dockButton" />
        </Link>
        <Link to="/profile" className="dockLink">
          <ProfileButton id="profileButton" className="dockButton" />
        </Link>
      </div>

      <Routes>
        <Route exact path="/" element={<ListContainer />} />
        <Route exact path="/add" element={<AddContainer />} />
        <Route exact path="/profile" element={<ProfileContainer />} />
      </Routes>
    </div>
  );
}
