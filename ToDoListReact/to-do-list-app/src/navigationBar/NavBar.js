import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function NavBar({ loggedIn, setLoggedIn }) {
   //determine which options the NavBar displays based on the user's login status
  const [navState, setNavState] = useState(null);
  
  // State to trigger navigation to a new page
  const [redirect, setRedirect] = useState(false);

  const navigate = useNavigate();

  //Send request to invalid the cookie
  const logout = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const message = await response.json();
    console.log(message);
    if (message.response.includes("successfully")) {
      setLoggedIn(false);
      setRedirect(true);
    }
  };

  //Send request to delete user from database
  const deleteAccount = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:4000/api/deleteUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const message = await response.json();
    console.log(message);
    if (message.response.includes("successfully")) {
      setLoggedIn(false);
      setRedirect(true);
      return;
    }
  };

  useEffect(() => {
   
    if (!loggedIn) {
      setNavState(
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul
            className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style={{ "--bs-scroll-height": "100px" }}
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/register"
              >
                register
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="/login">
                login
              </a>
            </li>
          </ul>
        </div>
      );
    } else {
      setNavState(
        <div className="collapse navbar-collapse" id="navbarScroll">
          <ul
            className="navbar-nav me-auto my-2 my-lg-0 navbar-nav-scroll"
            style={{ "--bs-scroll-height": "100px" }}
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                aria-current="page"
                href="/"
                onClick={logout}
                role="button"
              >
                logout
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link active"
                href="/"
                onClick={deleteAccount}
                role="button"
              >
                delete account
              </a>
            </li>
          </ul>
        </div>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn]);

  useEffect(() => {
    if (redirect) {
      navigate("/logout");
    }
  }, [redirect, navigate]);

  return (
    <nav className="navbar navbar-expand-lg fixed-bottom navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          Home
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarScroll"
          aria-controls="navbarScroll"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {navState}
      </div>
    </nav>
  );
}

export default NavBar;
