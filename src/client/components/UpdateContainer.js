import React from "react";

export const UpdateContainer = (props) => {
  return (
    <div id="addContainer">
      <div id="addTitle">Update Profile</div>
      <input
        placeholder="New Username (Optional)"
        id="userIn"
        className="addIn"
        onChange={props.handleInput}
        value={props.value}
      ></input>
      <input
        placeholder="New First Name (Optional)"
        id="firstIn"
        className="addIn"
        onChange={props.handleInput}
        value={props.value}
      ></input>
      <input
        placeholder="New Last Name (Optional)"
        id="lastIn"
        className="addIn"
        onChange={props.handleInput}
        value={props.value}
      ></input>
      <input
        placeholder="New Bio (Optional)"
        id="bioIn"
        className="addIn"
        onChange={props.handleInput}
        value={props.value}
      ></input>
    </div>
  );
};
