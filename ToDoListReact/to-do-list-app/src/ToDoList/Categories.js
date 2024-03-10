import React, { useState, useEffect } from "react";
import { useNavigate  } from "react-router-dom";

function Category({
  categoryList,
  setCategoryList,
  setUpdateList,
  rightRestrict,
}) {
  /*rightRestrict: for the list, that're only shared to this user, some actions will be not available*/

  const navigate = useNavigate();
  //In MySQL Database the list elements are automatically sorted, in able to manually reorganise the list, we need extra state
  const [orderedCategoryList, setOrderedCategoryList] = useState([]);
  //set the person, who is allowed to see a specific category. Each category can only be shared with one person
  const [coOwners, setCoOwners] = useState([]);

  useEffect(() => {
    setCoOwners(Array(categoryList.length).fill(""));
  }, [categoryList]);

  useEffect(() => {
    //Each category has a key "order" which spefifies the order that user manuelly set
    const sortedCategoryList = categoryList
      .slice()
      .sort((a, b) => parseInt(a.order, 10) - parseInt(b.order, 10));
    setOrderedCategoryList(sortedCategoryList);
  }, [categoryList]);

  const deleteCategory = async (index) => {
    const response = await fetch("http://localhost:4000/api/deleteCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(categoryList[index]),
    });

    const message = await response.json();
    setUpdateList((preValue) => !preValue);
    console.log(message);
  };

  //set person allowed to see the toDo category outside owner
  const shareCategory = async (event, index) => {
    event.preventDefault();

    setCategoryList((preValue) => {
      //index of a category in orderedCategoryList is manuelly set by user, index of the corresponding category
      //in categoryList is sorted by MySQL database, that why we have to convert two index
      const indexInDB = categoryList.findIndex(
        (category) => category.name === orderedCategoryList[index].name
      );

      let tempList = [...preValue];
      tempList[indexInDB].coOwner = coOwners[index];
      fetchCoOwner(tempList[indexInDB]);
      return tempList;
    });
  };

  //send request to set co-owner in database
  const fetchCoOwner = async (category) => {
    const response = await fetch("http://localhost:4000/api/shareCategory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(category),
    });

    const Res = await response.json();
    if (Res.response) {
      return;
    }
    console.log(Res);
    setUpdateList((prevValue) => !prevValue);
  };

  const openCategory = (index, rightRestrict) => {
    const indexInDB = categoryList.findIndex(
      (category) => category.name === orderedCategoryList[index].name
    );
    navigate("/list", { state: { indexInDB, rightRestrict } });
  };

  //reorganise position of categories up or down
  const moveCategory = (index, direction) => {
    setCategoryList((prevValue) => {
      let newList = [...prevValue];

      const indexInDB = categoryList.findIndex(
        (category) => category.name === orderedCategoryList[index].name
      );

      const directionIndex = direction === "up" ? index - 1 : index + 1;
      const conditionToMove =
        direction === "up"
          ? newList[indexInDB].order !== "1"
          : newList[indexInDB].order !== newList.length.toString();

      //change position of current category with the category above or below
      if (conditionToMove && index >= 0) {
        const newIndex = categoryList.findIndex(
          (category) =>
            category.name === orderedCategoryList[directionIndex].name
        );
        console.log(newIndex);

        [newList[indexInDB].order, newList[newIndex].order] = [
          newList[newIndex].order,
          newList[indexInDB].order,
        ];

        switchCategoriesPosition([newList[indexInDB], newList[newIndex]]);
        return newList;
      }
      return prevValue;
    });
  };

  //fetch the 2 categories with switched Positions
  const switchCategoriesPosition = async (categories) => {
    const response = await fetch(
      "http://localhost:4000/api/updateCategoryPosition",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(categories),
      }
    );

    const Res = await response.json();
    console.log(Res);
    setUpdateList((prevValue) => !prevValue);
  };

  return (
    <tbody>
      {orderedCategoryList.map((category, index) => (
        <React.Fragment key={index}>
          <tr key={index}>
            <th scope="row">{index}</th>
            <td>{category.name}</td>
            <td>In progress</td>
            <td>
              <button
                type="button"
                className="btn btn-danger ms-1 mb-2"
                onClick={() => deleteCategory(index)}
              >
                Delete
              </button>

              <button
                type="button"
                className="btn btn-success ms-1 mb-2"
                onClick={() => openCategory(index, rightRestrict)}
              >
                Open
              </button>

              <form
                className="row row-cols-lg-auto mb-2 "
                onSubmit={(event) => shareCategory(event, index)}
              >
                <div className="col-12">
                  <div className="form-outline">
                    <input
                      type="text"
                      id="form3"
                      className="form-control"
                      placeholder="enter a username to share"
                      value={coOwners[index]}
                      onChange={(event) =>
                        setCoOwners((preValue) => {
                          let tempCoOwners = [...preValue];
                          tempCoOwners[index] = event.target.value;
                          return tempCoOwners;
                        })
                      }
                    />
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-success ms-1">
                    Share with
                  </button>
                </div>
              </form>

              <button
                type="button"
                className="btn btn-success ms-1 mb-2"
                onClick={() => moveCategory(index, "up")}
              >
                Move Up
              </button>

              <button
                type="button"
                className="btn btn-success ms-1 mb-2"
                onClick={() => moveCategory(index, "down")}
              >
                Move Down
              </button>
            </td>
          </tr>
          <tr>
            <td colSpan="4"></td>
          </tr>
        </React.Fragment>
      ))}
    </tbody>
  );
}
export default Category;
