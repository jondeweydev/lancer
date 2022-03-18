import React, { Component } from "react";

import Listing from "./Listing";

class ListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchedUsers: false,
      users: [],
    };
  }

  componentDidMount() {
    fetch("/users")
      .then((res) => res.json())
      .then((users) => {
        if (!Array.isArray(users)) users = [];
        return this.setState({
          users,
          fetchedUsers: true,
        });
      })
      .catch((err) =>
        console.log("ListContainer.componentDidMount: get users: ERROR: ", err)
      );
  }

  render() {
    if (!this.state.fetchedUsers)
      return (
        <div>
          <h1>Loading listings, please wait...</h1>
        </div>
      );

    const { users } = this.state;

    if (!users) return null;

    if (!users.length) return <div>Sorry, no services found</div>;

    const userElems = users.map((user, i) => {
      return (
        <div key={i}>
          <Listing key={i} info={user} />
          <hr />
        </div>
      );
    });

    return <div>{userElems}</div>;
  }
}

export default ListContainer;
