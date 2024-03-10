import React from "react";
import { useNavigate } from "react-router-dom";

function SharedCategory({
  sharedCategoryList,
  rightRestrict,
}) {
  /*rightRestrict: for the list, that're only shared to this user, some actions will be not available*/

  const navigate = useNavigate();

  const openCategory = (index, rightRestrict) => {
    navigate("/list", { state: { index, rightRestrict, sharedCategoryList } });
  };

  return (
    <tbody>
      {sharedCategoryList.map((category, index) => (
        <React.Fragment key={index}>
          <tr key={index}>
            <th scope="row">{index}</th>
            <td>{category.name}</td>
            <td>In progress</td>
            <td>
              <button
                type="button"
                className="btn btn-success ms-1 mb-2"
                onClick={() => openCategory(index, rightRestrict)}
              >
                Open
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
export default SharedCategory;
