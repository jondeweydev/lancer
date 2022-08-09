import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import regeneratorRuntime from "regenerator-runtime";


function SubmitButton(props) {
  const navigate = useNavigate();
  const submit = () => {
    props.submitListing();
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 2000);
  };

  return <button onClick={submit}>Submit</button>;
}

class AddContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    titleIn: "",
    zipIn: 0,
    serviceIn: "",
    rateIn: 0,
    isMessageVisible: false,
    message: "",
    userInfo: {},
    isLoggedIn: false,
  };

  loggedIn = async () => {
    const reqParams = {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };

    await fetch("http://localhost:3000/auth/", reqParams)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.isLoggedIn) {
          // console.log(data)
          const newState = {};
          newState.isLoggedIn = true;
          if (Object.entries(this.state.userInfo).length === 0) {
            newState.userInfo = data.user;
          }
          return this.setState(newState);
        } else return console.log("not logged in");
      });
  };

  logout = async () => {
    await fetch("http://localhost:3000/auth/logout");
    const newState = {};
    newState.isLoggedIn = false;
    newState.userInfo = {};
    this.setState(newState);
    return window.location.reload(true);
  };

  // every time any character is changed in an input box
  // state is updated
  handleInput = (event) => {
    const newState = {};
    if (event.target.id === "zipIn" || event.target.id === "rateIn") {
      newState[event.target.id] = Number(event.target.value);
    } else {
      newState[event.target.id] = event.target.value;
    }
    this.setState(newState);
    // console.log(this.state);
  };

  // once the submit button is pressed (calls back from child component)
  submitListing = async () => {
    if (this.state.zipIn && this.state.serviceIn && this.state.rateIn) {
      const reqParams = {
        method: "POST",
        body: JSON.stringify({
          handle: this.state.userInfo.handle,
          title: this.state.titleIn,
          zip: this.state.zipIn,
          service: this.state.serviceIn,
          hourly: this.state.rateIn,
        }),
        headers: {
          "Content-type": "application/json",
        },
        credentials: "include",
      };

      await fetch("http://localhost:3000/api/listings", reqParams)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.error(err);
        });

      this.setState({
        isMessageVisible: true,
        message: "Your listing has been submitted",
      });
    } else {
      this.setState({
        isMessageVisible: true,
        message: "All values must be entered",
      });
    }
  };

  componentDidMount() {
    this.loggedIn();
  }

  componentDidUpdate() {
    this.loggedIn();
  }

  render() {
    return (
      <div>
        {this.state.isLoggedIn ? (
          <div id="addContainer">
            <div id="addTitle">Create Listing</div>
            <input
              placeholder="Title"
              id="titleIn"
              className="addIn"
              onChange={this.handleInput}
            ></input>
            <input
              placeholder="Zip Code"
              id="zipIn"
              className="addIn"
              onChange={this.handleInput}
            ></input>
            <input
              placeholder="Service"
              id="serviceIn"
              className="addIn"
              onChange={this.handleInput}
            ></input>
            <input
              placeholder="Hourly Rate"
              id="rateIn"
              className="addIn"
              onChange={this.handleInput}
            ></input>
            <SubmitButton id="submit" submitListing={this.submitListing} />
            {this.state.isMessageVisible ? (
              <div id="submitError">{this.state.message}</div>
            ) : null}
          </div>
        ) : (
          <div id="pleaseLogin">Please login to submit a listing</div>
        )}
      </div>
    );
  }
}

export default AddContainer;
