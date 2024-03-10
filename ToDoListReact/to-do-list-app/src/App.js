import "./App.css";

import React, { useState } from "react";
import LoginPage from "./navPages/LoginPage";
import RegisterPage from "./navPages/RegisterPage";
import NavBar from "./navigationBar/NavBar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./navPages/HomePage";
import LogoutPage from "./navPages/LogoutPage";
import ItemsPage from "./ToDoList/ItemsPage"

function App() {
  const [loggedIn, setLoggedIn] = useState(false);  //<NavBar> displays different options based on current state
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<HomePage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/logout" element={<LogoutPage />} />    
          <Route path="/list" element={<ItemsPage setLoggedIn={setLoggedIn} />} />  {/*ItemsPage show all ToDos in a category*/}
        </Routes>
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      </BrowserRouter>
    </div>
  );
}

export default App;
