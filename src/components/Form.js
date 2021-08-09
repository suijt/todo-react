import React, { useState } from "react";
import axios from "axios";

function Form(props) {
  const [name, setTitle] = useState({
    title: ""
  });

  const handleSubmit = async e => {
    e.preventDefault();
    if (name.title != '' && name.title != null) {
      const data = {
        title: name.title
      };
      axios.post("https://mi-linux.wlv.ac.uk/~2017754/todo/create", data)
      props.addTask(name.title);
      setTitle("");
    }
  }

  function onInputChange(e) {
    setTitle({ ...name, [e.target.name]: e.target.value });
  }

  return (
    <form onSubmit={e => handleSubmit(e)}>
      <h2 className="label-wrapper">
        <label htmlFor="title" className="label__lg">
          What needs to be done?
        </label>
      </h2>

      <input
        type="text"
        id="title"
        className="input input__lg"
        name="title"
        autoComplete="off"
        onChange={e => onInputChange(e)}
      />
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
