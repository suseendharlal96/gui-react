// global imports
import React, { useEffect, useState, createElement } from "react";

// local imports
import Dropzone from "./Dropzone";
import "./Items.css";

const Items = () => {
  // initializing the type of elements needed
  const [items, setItems] = useState([
    { id: "1", type: "input" },
    { id: "2", type: "button" },
    { id: "3", type: "h2" },
    { id: "4", type: "textarea" },
  ]);

  /* assigning the necessary events to the items and drop-zone
  (after initial component render)*/
  useEffect(() => {
    const dm = document.getElementsByClassName("dragme");

    for (let i = 0; i < dm.length; i++) {
      // assigning 'dragstart' event on the items
      dm[i].addEventListener("dragstart", drag_start, false);

      // assigning 'dragover' event on the drop-zone div
      document
        .getElementsByClassName("drop-zone")[0]
        .addEventListener("dragover", drag_over, false);

      // assigning 'drop' event on the drop-zone div
      document
        .getElementsByClassName("drop-zone")[0]
        .addEventListener("drop", drop, false);
    }
  }, []);

  const [change, isChange] = useState();

  // initializing the items to be dropped on drop-zone
  const [droppedItems, setDroppedItems] = useState([]);

  // keeping the items in sync with localstorage whenever an item is being dropped
  useEffect(() => {
    setDroppedItems(JSON.parse(localStorage.getItem("data")));
  }, [change]);

  /* constantly keeping track of elements on drop-zone 
  and assigning the necessary DOM events*/
  useEffect(() => {
    if (document.getElementsByClassName("dropped")) {
      const drop = document.getElementsByClassName("dropped");
      for (let i = 0; i < drop.length; i++) {
        // assigning 'dragstart' event on the items already on drop-zone
        drop[i].addEventListener("dragstart", drag_start, false);
      }
    }
  });

  function drag_start(event) {
    // getting the style properties of the actively-dragged element
    const style = window.getComputedStyle(event.target, null);

    /* setting the dragged element properties on 'dataTransfer' so that 
    it can be utilized while being dropped*/
    event.dataTransfer.setData(
      "text/plain",
      parseInt(style.getPropertyValue("left"), 10) -
        // clientX
        event.clientX +
        "," +
        // clientY
        (parseInt(style.getPropertyValue("top"), 10) - event.clientY) +
        "," +
        // unique attribute name
        event.target.getAttribute("data-item") +
        "," +
        // wheather its input/button etc.
        event.target.localName +
        "," +
        // element's classname
        event.target.className
    );
  }

  function drag_over(event) {
    event.preventDefault();
    return false;
  }

  function drop(event) {
    event.preventDefault();
    // retrieving the element's properties which was previously set on 'dragstart'
    const offset = event.dataTransfer.getData("text/plain").split(",");

    if (offset[4].search("dropped") === -1) {
      // Condition 1 : Elements dragged from original place to drop-zone
      const dm = document.getElementsByClassName("dragme");

      // getting the data of how much the element has moved
      dm[parseInt(offset[2])].style.left =
        event.clientX + parseInt(offset[0], 10) + "px";
      dm[parseInt(offset[2])].style.top =
        event.clientY + parseInt(offset[1], 10) + "px";

      // creating a new object to be dropped on drop-zone
      let cssProp = {};
      cssProp = {
        className: `dropped ${Math.random()}`,
        type: offset[3],
        style: {
          left: dm[parseInt(offset[2])].style.left,
          top: dm[parseInt(offset[2])].style.top,
        },
      };
      const copy = JSON.parse(localStorage.getItem("data"))
        ? JSON.parse(localStorage.getItem("data"))
        : droppedItems;

      copy.push(cssProp);
      // populating droppedItems
      setDroppedItems(copy);

      // populating localstorage after successful drop
      localStorage.setItem("data", JSON.stringify(copy));

      // triggering the hook which was keeping the items in sync with localstorage
      isChange(new Date().getTime());

      // setting the item to its original position from where it was taken
      dm[parseInt(offset[2])].style.left = "0px";
      dm[parseInt(offset[2])].style.top = "0px";
    } else {
      // Condition 2 : Elements dragged & dropped within drop-zone
      const dm = document.getElementsByClassName("dropped");

      // getting the data of how much the element has moved within the drop-zone
      dm[parseInt(offset[2])].style.left =
        event.clientX + parseInt(offset[0], 10) + "px";
      dm[parseInt(offset[2])].style.top =
        event.clientY + parseInt(offset[1], 10) + "px";

      let cssProp = {};
      cssProp = {
        className: offset[4],
        type: offset[3],
        style: {
          left: dm[parseInt(offset[2])].style.left,
          top: dm[parseInt(offset[2])].style.top,
        },
      };
      const copy = JSON.parse(localStorage.getItem("data"))
        ? JSON.parse(localStorage.getItem("data"))
        : droppedItems;

      /* finding the element which has moved and updating that particular
       element's property
       */
      const index = copy.findIndex((c) => c.className === offset[4]);
      if (index !== -1) {
        copy[index] = cssProp;
        setDroppedItems(copy);

        // updating localstorage
        localStorage.setItem("data", JSON.stringify(copy));
        // triggering to keep in sync with localstorage
        isChange(new Date().getTime());
      }
    }

    return false;
  }

  const handleChange = (e) => {
  };

  const handleClick = () => {
    alert("clicked");
  };

  const renderElement = (type, index) => {
    // Rendering the type of element based on items array
    switch (type) {
      case "input":
        return createElement(type, {
          className: `dragme ${index}`,
          draggable: "true",
          "data-item": index,
          onChange: handleChange,
        });
      case "button":
        return createElement(
          type,
          {
            className: `dragme ${index}`,
            draggable: "true",
            "data-item": index,
            onClick: (e) => handleClick(e),
          },
          "Button"
        );
      case "h2":
        return createElement(
          type,
          {
            className: `dragme ${index}`,
            draggable: "true",
            "data-item": index,
          },
          "Large Text"
        );
      case "textarea":
        return createElement(type, {
          className: `dragme ${index}`,
          draggable: "true",
          "data-item": index,
        });
    }
  };

  return (
    <div className="main-container">
      <div style={{ width: "100%" }}>
        <h2>Tools</h2>
        <div className="side-panel">
          {items.map((item, index) => (
            <React.Fragment key={item.id}>
              {renderElement(item.type, index)}
            </React.Fragment>
          ))}
        </div>
      </div>
      <div className="drop-zone">
        <Dropzone droppedItems={droppedItems} />
      </div>
      {/* {JSON.stringify(droppedItems, null, 2)} */}
    </div>
  );
};

export default Items;
