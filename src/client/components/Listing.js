import React from "react";

function Listing(props) {
  const info = [props.info];
  return (
    <div id="listing">
      <div id="text">
        <div id="id">
          <h3 id="handle">@{props.info.handle}</h3>
        </div>
        <div id="job">
          <div id="name">
            {props.info.firstName + " "}
            {props.info.lastName}{" "}
          </div>
          <div id="service">{props.info.service}</div>
          <div id="hourly">{" ~$" + props.info.hourly}</div>
        </div>
      </div>
      <div id="showcase">
        <img className="showcase" id="showcase1" src={"img/purp.png"}/>
        <img className="showcase" id="showcase2" src={"img/sunset.png"} />
        <img className="showcase" id="showcase3" src={"img/waterfall.png"} />
      </div>
    </div>
  );
}

export default Listing;
