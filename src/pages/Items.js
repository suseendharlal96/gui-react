import React, { useEffect, useState, createElement } from "react";
import Dropzone from "./Dropzone";
import "./Items.css";
const Items = () => {
  const [items, setItems] = useState([
    { id: "1", type: "aside" },
    { id: "2", type: "input" },
    { id: "3", type: "button" },
  ]);

  const [change, isChange] = useState();

  const [arr, setArr] = useState([]);

  useEffect(() => {
    if (JSON.parse(localStorage.getItem("data"))) {
      setArr(JSON.parse(localStorage.getItem("data")));
    }
  }, []);

  useEffect(() => {
    setArr(JSON.parse(localStorage.getItem("data")));
  }, [change]);

  useEffect(() => {
    const dm = document.getElementsByClassName("dragme");
    for (let i = 0; i < dm.length; i++) {
      dm[i].addEventListener("dragstart", drag_start, false);
      document
        .getElementsByClassName("drop-zone")[0]
        .addEventListener("dragover", drag_over, false);
      document
        .getElementsByClassName("drop-zone")[0]
        .addEventListener("drop", drop, false);
    }
  }, []);

  useEffect(() => {
    console.log(1);
    if (document.getElementsByClassName("dropped")) {
      const drop = document.getElementsByClassName("dropped");
      for (let i = 0; i < drop.length; i++) {
        drop[i].addEventListener("dragstart", drag_start, false);
        document
          .getElementsByClassName("drop-zone")[0]
          .addEventListener("dragover", drag_over, false);
        document
          .getElementsByClassName("drop-zone")[0]
          .addEventListener("drop", drop, false);
      }
    }
  });

  function drag_start(event) {
    console.log(event);
    const style = window.getComputedStyle(event.target, null);
    event.dataTransfer.setData(
      "text/plain",
      parseInt(style.getPropertyValue("left"), 10) -
        event.clientX +
        "," +
        (parseInt(style.getPropertyValue("top"), 10) - event.clientY) +
        "," +
        event.target.getAttribute("data-item") +
        "," +
        event.target.localName +
        "," +
        event.target.className
    );
  }

  function drag_over(event) {
    event.preventDefault();
    return false;
  }

  function drop(event) {
    event.preventDefault();
    // console.log("e", event);
    const offset = event.dataTransfer.getData("text/plain").split(",");
    console.log(offset);

    if (offset[4].search("dropped") === -1) {
      const dm = document.getElementsByClassName("dragme");
      console.log(dm);
      dm[parseInt(offset[2])].style.left =
        event.clientX + parseInt(offset[0], 10) + "px";
      dm[parseInt(offset[2])].style.top =
        event.clientY + parseInt(offset[1], 10) + "px";

      let cssProp = {};
      cssProp = {
        className: `dropped ${offset[2]}`,
        type: offset[3],
        style: {
          left: dm[parseInt(offset[2])].style.left,
          top: dm[parseInt(offset[2])].style.top,
        },
      };
      const copy = arr;

      copy.push(cssProp);
      console.log(copy);
      setArr(copy);
      // arr.push(cssProp);
      localStorage.setItem("data", JSON.stringify(copy));
      console.log("local", JSON.parse(localStorage.getItem("data")));
      isChange(new Date().getTime());
      dm[parseInt(offset[2])].style.left = "0px";
      dm[parseInt(offset[2])].style.top = "0px";
    } else {
      const dm = document.getElementsByClassName("dropped");
      console.log(dm);
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
      const copy = arr;
      const index = copy.findIndex((c) => c.className === offset[4]);
      if (index !== -1) {
        copy[index] = cssProp;
        console.log(copy);
        setArr(copy);
        localStorage.setItem("data", JSON.stringify(copy));
        console.log("local", JSON.parse(localStorage.getItem("data")));
        isChange(new Date().getTime());
      }
    }

    return false;
  }

  const handleChange = (e) => {
    console.log(e);
  };

  const handleClick = () => {
    alert("clicked");
  };

  const renderElement = (type, index) => {
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
      case "aside":
        return createElement(
          type,
          {
            className: `dragme ${index}`,
            draggable: "true",
            "data-item": index,
            onClick: (e) => handleClick(e),
          },
          "Container"
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
        }}
      >
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {renderElement(item.type, index)}
          </React.Fragment>
        ))}
      </div>
      {/* {JSON.stringify(arr, null, 2)} */}
      <Dropzone droppedItems={arr} />
    </div>
  );
};

export default Items;
