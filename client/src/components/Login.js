import React, {useState, useEffect} from "react";
import axios from 'axios';
import './Login.css';

import delay from '../modules/delay';

function formStatus(formState,errMsg="") {
  // console.log("In formStatus and errMsg:",errMsg);
  switch(formState) {
    case 0:
      return "Not authenticated";
    case 1:
      return "Checking credentials on server. Please wait...";
    case 2:
      return "You are logged in, you can now visit other pages on this site.";
    case 3:
      return errMsg;
    default:
      return "Unknown Error";      
  }
}

const delay_time = 1500;  //This is length of artificial delay time (in ms) so that we can see different states

const Login = () => {
  // make a post request to retrieve a token from the api
  // when you have handled the token, navigate to the BubblePage route

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    formState:0,   //0-not authenticated, 1-getting server data, 2-auth success, 3-auth fail
    errMsg:"", //This stores the error message from the server
  });

  function changeHandler(event) {
    // console.log(`This is the field: ${event.target.name} and this is the value: ${event.target.value}`);
    setLoginData( { 
     ...loginData, 
     [event.target.name]: event.target.value, 
    });
  }

  //Checks if the token is on sessionStorage and then authenticates user
  useEffect(()=>{
    if(sessionStorage.getItem('token')) {
      setLoginData({...loginData,formState:2});
    }
  },[])


  function submitForm(event) {
    event.preventDefault();

    setLoginData({...loginData,formState:1});

    const authInfo = {username:loginData.username,password:loginData.password};

    axios
    .post("http://localhost:5000/api/login", authInfo)
    .then(response => {
      // console.log("This is data from server, in THEN of login.js:",response.data.payload);
      delay(delay_time); //This is artificail delay time so that we can see different states
      sessionStorage.setItem("token", response.data.payload);
      setLoginData({
        username: "",
        password: "",
        formState:2,
        errMsg:"",
      });
    })
    .catch(err => {   
      // console.log("This is data from server, in CATCH of loginSrv err:",err);
      // console.log("This is data from server, in CATCH of loginSrv err.response:",err.response);
      delay(delay_time); //This is artificail delay time so that we can see different states
      if(err.response && err.response.status===403) {
        const errMsg = "You have entered an invalid username and/or password";
        setLoginData({...loginData,formState:3,errMsg,errMsg});
      } else {
        const errMsg = ""+err;
        setLoginData({...loginData,formState:3,errMsg,errMsg});
      }
    }); 
  };


  return ( 
    <div className="loginContainer">
    
      {/* <h1>Welcome to the Bubble App!</h1>
      <p>Build a login page here</p> */}
      <h1 className="titleHeader">Login Page</h1>

      <form className="formContainer" onSubmit={submitForm}> 

        <div className="formInputContainer">
          <label htmlFor="username">Username</label>
          <input className="input-area"
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            onChange={changeHandler}
            value={loginData.username}         
          />
        </div>

        <div className="formInputContainer">
          <label htmlFor="password">Password</label>
          <input className="input-area"
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={changeHandler}
            value={loginData.password}         
          />
        </div>
        
        <button className="loginSubmitBtn" type="submit">Login</button>

        <h3 className="formStatus">{formStatus(loginData.formState,loginData.errMsg)}</h3>

      </form>

      {/* This is for debugging purposes only
      remove for production */}
      {/* <p>{`username:${loginData.username}`}</p>
      <p>{`password:${loginData.password}`}</p> */}

    </div> 
  );
};

export default Login;
