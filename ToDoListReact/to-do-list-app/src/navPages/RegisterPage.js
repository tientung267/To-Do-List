import React, { useState } from "react";
import todolisticon from "../to-do-list.png";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  //add a new account to database
  const  submit = async (event) => {
    event.preventDefault();

    const serverResponse = await fetch('http://localhost:4000/api/register', {
      method : 'POST',
      headers : {'Content-Type' : 'application/json'},
      body: JSON.stringify({
        username,
        password,
      })
    })

    const message = await serverResponse.json()
    console.log(message)

    if (message.username === undefined) {
      setResponseMessage("Failed! " + message.response)
      return
    }
    setResponseMessage("Success! You can now log in. Welcome!")
  };
  
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
        <h1 className="h3 mb-3 fw-normal"> Create your account</h1>

        <div className="form-floating">
          <input
            type="username"
            className="form-control"
            id="floatingInput"
            onChange={(event) => setUsername(event.target.value)}
          />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <input
            type="password"
            className="form-control"
            id="floatingPassword"
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>

        <button className="w-100 btn btn-lg btn-primary" type="submit">
          Register
        </button>
        <p>{responseMessage}</p>
      </form>
    </main>
  );
}

export default LoginPage;
