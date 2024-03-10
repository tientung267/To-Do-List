import React, { useEffect, useState } from "react";
import ItemPage from "./Items";
import { Navigate, useLocation } from "react-router-dom";

//Display all To-Do Items of an category
function ItemsPage({ setLoggedIn }) {
  const { state } = useLocation(); //this state store the index of current category in Database
  const [category, setCategory] = useState({});
  // Each category consists of a set of items
  const [itemList, setItemList] = useState([]);
  
  //state of a single item
  const [item, setItem] = useState({
    title: "",
    text: "",
    status: "In Progress",
  });
  const [message, setMessage] = useState("");
  const [backToCategory, setBackToCategory] = useState(false);

  //Add New Item to current category
  const submit = async (event) => {
    event.preventDefault();

    //new item title can not be duplicated or empty
    if (
      !itemList.some((it) => it.title === item.title) &&
      item.title !== "" &&
      item.text !== ""
    ) {
      setItemList((prevValue) => {
        const newItemList = [...prevValue, item];

        return newItemList;
      });
      setItem({ title: "", text: "", status: "In Progress" });

      setMessage("");
      return;
    } else {
      setMessage("Failed, try again!");
    }
  };
  

  useEffect(() => {
   
  }, [itemList]);

  useEffect(() => {
    setCategory((prevValue_) => {
      const newCategory = {
        ...prevValue_,
        item: JSON.stringify(itemList),
      };
      fetchItem(newCategory);

      return newCategory;
    });
  }, [itemList]);


  //Update the item list for current category
  const fetchItem = async (category) => {
    if (!category.name || !category.owner) {
      return;
    }
    console.log(category);
    const response = await fetch(
      "http://localhost:4000/api/updateItemInCategory",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(category),
      }
    );

    const Res = await response.json();
    if (Res.response) {
      setMessage(Res.response);
      return;
    }
    console.log(Res)
    setCategory(Res);
  };

  //Retrieve current category based on it index in DB and than display the list of all items in the category
  const getItemsInCategory = async (rightRestrict) => {
    const route = rightRestrict ? "getSharedList" : "getList"
    const index = !rightRestrict ? state.indexInDB : state.index
    
    const response = await fetch(`http://localhost:4000/api/${route}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const Res = await response.json();
    if (Res.response) {
      setMessage(Res.response);
      return;
    }
    
    setCategory(Res[index]);
    console.log(Res[index]);
    setItemList(JSON.parse(Res[index].item));
  };

  useEffect(() => {
    getItemsInCategory(state.rightRestrict)
    setLoggedIn(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (backToCategory) {
    return <Navigate to="/" />;
  }

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-7">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">My List</h4>

                {!state.rightRestrict && (
                  <form
                    className="row row-cols-lg-auto g-3 justify-content-center align-items-center mb-4 pb-2"
                    onSubmit={submit}
                  >
                    <div className="col-12">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="form1"
                          className="form-control"
                          placeholder="task title"
                          value={item.title}
                          onChange={(event) =>
                            setItem((prevValue) => ({
                              ...prevValue,
                              title: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-outline">
                        <input
                          type="text"
                          id="form2"
                          className="form-control"
                          placeholder="task text"
                          value={item.text}
                          onChange={(event) =>
                            setItem((preValue) => ({
                              ...preValue,
                              text: event.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        Add
                      </button>
                    </div>

                    <div>{message}</div>
                  </form>
                )}
                <div className="col-12">
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={() => setBackToCategory(true)}
                  >
                    Get back to category
                  </button>
                </div>
                <p>Owner: {category.owner}</p>
                <p>This list is shared with: {category.coOwner}</p>
                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">Title</th>
                      <th scope="col">Text</th>
                      <th scope="col">Status</th>
                      <th scope="col">Actions</th>
                    </tr>
                  </thead>
                  <ItemPage
                    itemList={itemList}
                    setItemList={setItemList}
                    rightRestrict={state.rightRestrict}
                  />
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ItemsPage;
