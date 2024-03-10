import React, {useState} from "react";
import todolisticon from "../to-do-list.png";
import {Navigate} from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");

  //send login request and get response from backend
  const submit = async (event) => {
    event.preventDefault();

    const serverResponse = await fetch('http://localhost:4000/api/login', {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      credentials : 'include', 
      body: JSON.stringify({
        username,
        password,
      })
    });
    
    const message = await serverResponse.json()
    console.log(message)
    if (!message.response.includes("succeed")) {
      setResponseMessage("Failed! " + message.response)
      return
    }
    
    setRedirect(true);
  }

  //If login is successfully, user will be navigated to HomePage
  if (redirect) {
    return <Navigate to="/" />
  }

  return (
    <main className="form-signin">
      <form onSubmit={submit}>
        <img
          className="mb-4"
          src={todolisticon}
          alt="logo"
          width="72"
          height="57"
        />
        <h1 className="h3 mb-3 fw-normal"> Sign in your to-do-list</h1>

        <div className="form-floating">
          <input
            type="username"
            className="form-control"
            id="floatingInput"
            onChange = {event => setUsername(event.target.value)}
          />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            onChange = {event => setPassword(event.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Sign in
        </button>
        <p>{responseMessage}</p>
      </form>
    </main>
  );
}

export default LoginPage;
