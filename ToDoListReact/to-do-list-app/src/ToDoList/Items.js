import React from "react";

function ItemPage({ itemList, setItemList, rightRestrict }) {
  const deleteItem = (excludeIndex) => {
    setItemList((preValue) => {
      return preValue.filter((_, index) => index !== excludeIndex);
    });
  };

  //mark a ToDo Item as Done
  const finish = (itemIndex) => {
    setItemList((preValue) => {
      let tempItemList = [...preValue];
      tempItemList[itemIndex].status = "Done";
      return tempItemList;
    });
  };

  return (
    <tbody>
      {itemList.map((item, index) => (
        <tr key={index}>
          <th scope="row">{item.title}</th>
          <td>{item.text}</td>
          <td>{item.status}</td>
          <td>
            {!rightRestrict && <button
              type="submit"
              className="btn btn-danger"
              onClick={() => deleteItem(index)}
            >
              Delete
            </button>}
            <button
              type="submit"
              className="btn btn-success ms-1"
              onClick={() => finish(index)}
            >
              Finish
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
export default ItemPage;
