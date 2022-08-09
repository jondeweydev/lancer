import React, { Component } from "react";
import { UpdateContainer } from "./UpdateContainer";
import LoginWrapper from "./LoginContainer";

class ProfileContainer extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    userIn: "",
    firstIn: "",
    lastIn: "",
    bioIn: "",
    updateUser: false,
    isLoggedIn: false,
    isMessageVisible: false,
    logout: false,
    message: "",
    userInfo: {},
  };

  messageReset = () => {
    setTimeout(() => {
      this.setState({
        isMessageVisible: false,
        message: "",
      });
    }, 4000);
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
        const newState = {};
        if (data.isLoggedIn) {
          console.log(data)
          newState.isLoggedIn = true;
          if (Object.entries(this.state.userInfo).length === 0) {
            newState.userInfo = data.user;
          }
          return this.setState(newState);
        } else {
          newState.isLoggedIn = false;
          newState.userInfo = {};
          this.setState(newState);
          return console.log("not logged in");
        }
      });
  };

  logout = async () => {
    const newState = {};
    newState.isLoggedIn = false;
    newState.logout = true;
    newState.userInfo = {};
    this.setState(newState);
    await fetch("http://localhost:3000/auth/logout", {method: "DELETE"});
    newState.logout = false;
    
    return 
    // window.location.reload(true);
  };

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

  updateUser = async () => {
    if (this.state.updateUser) {
      if (
        this.state.userIn ||
        this.state.firstIn ||
        this.state.lastIn ||
        this.state.bioIn
      ) {
        const updateBody = {};

        if (this.state.userIn) {
          updateBody.handle = this.state.userIn;
        }
        if (this.state.firstIn) {
          updateBody.firstName = this.state.firstIn;
        }
        if (this.state.lastIn) {
          updateBody.lastName = this.state.lastIn;
        }
        if (this.state.bioIn) {
          updateBody.bio = this.state.bioIn;
        }

        const reqParams = {
          method: "PUT",
          body: JSON.stringify({ update: updateBody }),
          headers: {
            "Content-type": "application/json",
          },
        };

        await fetch(
          "http://localhost:3000/api/users/" + this.state.userInfo.handle,
          reqParams
        )
          .then((res) => {
            return res.json();
          })
          .then(async (user) => {
            this.setState({
              userInfo: user,
              isMessageVisible: true,
              message: "Your profile has been updated",
              updateUser: false,
            });
            await this.messageReset();
            console.log(this.state.userInfo);
            // window.location.reload(true);
          })

          .catch((err) => {
            console.log("UPDATE ERROR: \n" + err);
          });
        return;
      } else {
        this.setState({
          isMessageVisible: true,
          message: "At least one updated field is required",
        });
        this.messageReset();
      }
    } else this.setState({ updateUser: true });
  };

  deleteUser = async () => {
    const reqParams = {
      method: "DELETE",
      headers: {
        "Content-type": "application/json",
      },
    };

    await fetch(
      "http://localhost:3000/api/users/" + this.state.userInfo.handle,
      reqParams
    )
      .then((res) => {
        return res.json();
      })
      .then(async (user) => {
        this.setState({
          userInfo: {},
          isMessageVisible: true,
          message: "Your account has been deleted.",
          updateUser: false,
        });
        await this.logout();
        await this.messageReset();
        console.log(this.state.userInfo);
        // window.location.reload(true);
      })

      .catch((err) => {
        console.log("UPDATE ERROR: \n" + err);
      });
    return;
  };

  componentDidMount() {
    this.loggedIn();
  }

  componentDidUpdate() {
    setTimeout(this.loggedIn, 5000)
  }

  render() {
    return (
      <div id="profileContainer">
        {this.state.isLoggedIn ? (
          this.state.updateUser ? (
            <UpdateContainer handleInput={this.handleInput} />
          ) : (
            <div>
              <div id="profileTitle">@{this.state.userInfo.handle}</div>
              <div id="profileHeader">
                <img id="profilePicture" src="img/sunset.png"></img>
                <div id="profileName">
                  {this.state.userInfo.firstName +
                    " " +
                    this.state.userInfo.lastName}
                </div>
              </div>
              <div id="profileBody">
                <div id="profileBio">
                  {this.state.userInfo.bio
                    ? this.state.userInfo.bio
                    : "Add a bio here by updating your profile"}
                </div>
              </div>
            </div>
          )
        ) : (
          <LoginWrapper handleInput={this.handleInput}></LoginWrapper>
        )}
        {this.state.isLoggedIn ? (
          <button id="profileUpdate" onClick={this.updateUser}>
            Update
          </button>
        ) : null}
        {this.state.isLoggedIn && this.state.updateUser ? (
          <button id="profileDelete" onClick={this.deleteUser}>
            Delete Account
          </button>
        ) : null}
        {this.state.isLoggedIn ? (
          <button id="logout" onClick={this.logout}>
            Logout
          </button>
        ) : null}
        {this.state.isMessageVisible ? this.state.message : null}
      </div>
    );
  }
}

export default ProfileContainer;
