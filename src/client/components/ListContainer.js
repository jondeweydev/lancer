import React, { Component } from "react";
import { useNavigate } from "react-router-dom";

import Listing from "./Listing";

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedListings: false,
      listings: [],
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/api/listings")
      .then((res) => res.json())
      .then((listings) => {
        let fetchedListings = false;
        if (!Array.isArray(listings)) listings = [];
        if (listings.length > 0) {
          fetchedListings = true;
        }
        this.setState({
          listings,
          fetchedListings: fetchedListings,
        });
        this.sortBy(null);
        return;
      })
      .catch((err) =>
        console.log("ListContainer.componentDidMount: get users: ERROR: ", err)
      );
  }

  sortBy = (event) => {
    const newListings = this.state.listings;
    if (event === null) {
      newListings.sort((a, b) => {
        const aName = a.handle.toLowerCase();
        const bName = b.handle.toLowerCase();
        if (aName > bName) return 1;
        else if (aName < bName) return -1;
        else return 0;
      });
    } else if (event.target.value === "rate") {
      newListings.sort((a, b) => {
        return a.hourly - b.hourly;
      });
    } else if (event.target.value === "distance") {
      newListings.sort((a, b) => {
        return a.hourly - b.hourly;
      });
    }
    // alphabetical last Names
    else {
      newListings.sort((a, b) => {
        const aName = a.handle.toLowerCase();
        const bName = b.handle.toLowerCase();
        if (aName > bName) return -1;
        if (aName < bName) return 1;
        return 0;
      });
    }
    this.setState(newListings);
  };

  render() {
    if (!this.state.fetchedListings)
      return (
        <div>
          <h2 id="loading">Loading listings, please wait...</h2>
        </div>
      );

    const { listings } = this.state;

    if (!listings) return null;

    if (!listings.length) return <div>Sorry, no services found</div>;

    const listingElems = listings.map((listing, i) => {
      return (
        <div key={i}>
          <Listing key={i} info={listing} />
          <hr />
        </div>
      );
    });

    return (
      <div id="listContainer">
        <div id="sortContainer">
          <div>Sort By:</div>
          <select
            id="sortInput"
            type="text"
            name="Sort By"
            list="sortBy"
            onChange={this.sortBy}
          >
            <option value="alphabetical">Alphabetical</option>
            <option value="rate">Hourly Rate</option>
            <option value="distance">Distance</option>
          </select>
        </div>
        <div>{listingElems}</div>
      </div>
    );
  }
}

export default ListContainer;
