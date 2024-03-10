import React, { useEffect, useState } from "react";
import Category from "./Categories";
import SharedCategory from "./SharedCategories";

//Main page after login, display user`s list of categories
function CategoriesPage({ user }) {
  const defaultCategory = {
    order : "0",
    owner: user,
    coOwner: "",
    name: "",
    item: [],
    status: "In Progress",
  };

  //currently handling category
  const [category, setCategory] = useState(defaultCategory); 
  //list of categories, which belong to this user
  const [categoryList, setCategoryList] = useState([]);
  //List of categories, which are shared to this user
  const [sharedCategoryList, setSharedCategoryList] = useState([]);
  const [message, setMessage] = useState("");
  //Flag to trigger an update displayes list
  const [updateList, setUpdateList] = useState(false);

  const submit = async (event) => {
    event.preventDefault();

    if (
      !categoryList.some((ct) => ct.name === category.name) && //duplicated or empty name will not be added
      category.name !== ""
    ) {
      setMessage("");
      fetchCategory();
      setCategory(defaultCategory);
    } else {
      setMessage("Failed, try again!");
    }
  };

  //Add new category to database
  const fetchCategory = async () => {
    const response = await fetch("http://localhost:4000/api/addCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(category),
    });

    const Res = await response.json();
    if (Res.response) {
      setMessage(Res.response);
      return;
    }
    setUpdateList((prevValue) => !prevValue); // put it inside asynchronous function
  };

   //Get list of categories belong to this user from database
  const getCategoryList = async () => {
    const response = await fetch("http://localhost:4000/api/getList", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const Res = await response.json();
    if (Res.response) {
      setMessage(Res.response);
      setCategoryList([]);
      return;
    }
    setCategoryList(Res);
  };

  //Get list of categories, which are shared to this user from database
  const getSharedCategoryList = async () => {
    const response = await fetch("http://localhost:4000/api/getSharedList", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }); 

    const Res = await response.json();
    if (Res.response) {
      setSharedCategoryList([]);
      return;
    }
    console.log(Res)
    setSharedCategoryList(Res);
  };

  useEffect(() => {
    getCategoryList();
    getSharedCategoryList();
  }, [updateList]);

  return (
    <section className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-lg-9 col-xl-7">
            <div className="card rounded-3">
              <div className="card-body p-4">
                <h4 className="text-center my-3 pb-3">To Do App</h4>

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
                        placeholder="add a new category"
                        value={category.name}
                        onChange={(event) =>
                          setCategory({
                            order : (categoryList.length + 1).toString(),
                            owner: user,
                            coOwner: "",
                            name: event.target.value,
                            item: JSON.stringify([
                              {
                                title: "Job1",
                                text: "doThis1",
                                status: "In Progress",
                              },
                              {
                                title: "Job2",
                                text: "doThis2",
                                status: "In Progress",
                              },
                              {
                                title: "Job3",
                                text: "doThis3",
                                status: "In Progress",
                              },
                            ]),
                            status: "In Progress",
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>

                  {message !== "" && (
                    <div className={`alert alert-warning`} role="alert">
                      {message}
                    </div>
                  )}
                </form>

                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                  </thead>
                  <Category
                    categoryList={categoryList}
                    setCategoryList={setCategoryList}
                    setUpdateList={setUpdateList}
                    rightRestrict={false} 
                  />
                </table>
                <h2>Following ToDos are shared with you: </h2>
                <table className="table mb-4">
                  <thead>
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Category</th>
                      <th scope="col">Status</th>
                      <th scope="col">Action</th>
                    </tr>
                    
                  </thead>
                  <SharedCategory
                    sharedCategoryList={sharedCategoryList}
                    rightRestrict={true}
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

export default CategoriesPage;
