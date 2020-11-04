// global imports
import React from "react";

// local imports
import "./Dropzone.css";

const Dropzone = ({ droppedItems }) => {
  const renderElement = (item, index) => {
    /* Rendering the type of element based on items array
     but this time with addition info about the style */
    switch (item.type) {
      case "input":
        return React.createElement(item.type, {
          className: `${item.className}`,
          draggable: "true",

          style: {
            left: item.style.left,
            right: item.style.right,
            top: item.style.top,
            bottom: item.style.bottom,
            position: "relative",
          },
          "data-item": index,
        });
      case "button":
        return React.createElement(
          item.type,
          {
            className: `${item.className}`,
            draggable: "true",
            style: {
              left: item.style.left,
              right: item.style.right,
              top: item.style.top,
              bottom: item.style.bottom,
              position: "relative",
            },
            "data-item": index,
          },
          "Button"
        );
      case "h1":
        return React.createElement(
          item.type,
          {
            className: `${item.className}`,
            draggable: "true",
            style: {
              left: item.style.left,
              right: item.style.right,
              top: item.style.top,
              bottom: item.style.bottom,
              position: "relative",
            },
            "data-item": index,
          },
          "Large Text"
        );
      case "textarea":
        return React.createElement(item.type, {
          className: `${item.className}`,
          draggable: "true",
          style: {
            type: item.type,
            left: item.style.left,
            right: item.style.right,
            top: item.style.top,
            bottom: item.style.bottom,
            position: "relative",
          },
          "data-item": index,
        });
    }
  };

  return (
    <React.Fragment>
      <h2>Drop Zone</h2>
      {droppedItems &&
        droppedItems.length > 0 &&
        droppedItems.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {renderElement(item, index)}
            </React.Fragment>
          );
        })}
    </React.Fragment>
  );
};
export default Dropzone;
