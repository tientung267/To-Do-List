import React, { useState, useEffect } from "react";
import CategoriesPage from "../ToDoList/CategoriesPage";
function HomePage(props) {
  const { setLoggedIn } = props;

  const [pageContent, setPageContent] = useState(null);

  const fetchData = async () => {
    //Get user-specific data (username and encrypted password)
    const response = await fetch("http://localhost:4000/api/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const message = await response.json();
    if (message.username !== undefined) {
      setLoggedIn(true);
      setPageContent (
        <div>
          <p>Welcome {message.username}</p>
          <CategoriesPage user={message.username}/>
        </div>
      );
      return;
    }

    setPageContent (
      <div>
        <h1 className="jumbotron-heading">
          Welcome to Homepage of to-do-list app
        </h1>
        <p>You are not logged in</p>
      </div>
    );
  };
 
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div>{pageContent}</div>;
}

export default HomePage;
