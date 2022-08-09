import React, { Component } from "react";
import {useNavigate} from "react-router-dom";

let message;

function LoginWrapper(props) {
  const navigate = useNavigate();
  const navHome = () => {
    navigate("/");
  };
  return (
    <LoginContainer
      handleInput={props.handleInput}
      navHome={navHome}
    ></LoginContainer>
  );
}

class LoginContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    handle: "",
    password: "",
    firstName: "",
    lastName: "",
    signup: false,
  };

  handleInput = (event) => {
    const newState = {};
    newState[event.target.id] = event.target.value;
    this.setState(newState);
    // console.log(this.state);
  };

  login = async () => {
    const reqParams = {
      // mode: 'no-cors',
      method: "POST",
      body: JSON.stringify({
        handle: this.state.handle,
        password: this.state.password,
      }),
      headers: {
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": '*'
      },
      credentials: "include",
    };
    if (!this.state.handle || !this.state.password) {
      message.innerText("Both fields are required to login");
      return;
    }
    await fetch("http://localhost:3000/auth/login", reqParams).then((res) => {
      if (res.status === 401) {
        message.innerText = "This username does not exist";
        return;
      }
      if (res.status === 402) {
        message.innerText = "Invalid username or password";
        return;
      }
      if (res.status >= 500) {
        message.innerText = "Internal server error, please try again";
        return;
      }

      window.location.reload();
      return;
    });
  };

  signup = async () => {
    if (
      !this.state.handle ||
      !this.state.password ||
      !this.state.firstName ||
      !this.state.lastName
    ) {
      message.innerText = "All fields are required for user creation.";
      return;
    }

    const reqParams = {
      method: "POST",
      body: JSON.stringify({
        handle: this.state.handle,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        bio: "",
        listings: {},
      }),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    };

    await fetch("http://localhost:3000/auth/signup", reqParams).then(
      async (res) => {
        if (res.status === 402) {
          message.innerText = "This username is already in use.";
        } else {
          message.innerText = "Signup success";
          this.setState({signup: false})
          window.location.reload();
          // return setTimeout(this.props.navHome, 1000);
        }
      }
    );
  };

  componentDidMount() {
    message = document.getElementById("signupMessage");
  }

  render() {
    return (
      <div id="loginContainer">
        {!this.state.signup ? <h3>Login</h3> : <h3>Signup</h3>}
        <input
          className="loginContainerIn"
          id="handle"
          onChange={this.handleInput}
          placeholder="Username"
        ></input>
        <input
          className="loginContainerIn"
          id="password"
          type="password"
          placeholder="Password"
          onChange={this.handleInput}
        ></input>
        {!this.state.signup ? (
          <button onClick={this.login}>Login</button>
        ) : (
          <div id="signupInputs">
            <input
              id="firstName"
              placeholder="First Name"
              onChange={this.handleInput}
            ></input>
            <input
              id="lastName"
              placeholder="Last Name"
              onChange={this.handleInput}
            ></input>
          </div>
        )}
        <button
          onClick={
            this.state.signup
              ? this.signup
              : () => {
                  const newState = { signup: true };
                  this.setState(newState);
                }
          }
        >
          Signup
        </button>
        <div id="signupMessage"></div>
      </div>
    );
  }
}

export default LoginWrapper;
