import React, { useState, useRef, useEffect } from "react";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { nanoid } from "nanoid";
import axios from 'axios';

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: task => task.status == 0 ? true : false,
  Completed: task => task.status == 1 ? true : false
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  function toggleTaskCompleted(id,status) {
    const data = {
      status: status
    };
    axios.post("https://mi-linux.wlv.ac.uk/~2017754/todo/updateStatus/"+id, data).then(response => {
      if (response.status === 200) {
        alert("Task Edited successfully");
        axios.get('https://mi-linux.wlv.ac.uk/~2017754/todo/')
          .then(res => {
            setTasks(res.data.reverse());
          });
      }
    });
  }


  function deleteTask(id) {
    axios.get("https://mi-linux.wlv.ac.uk/~2017754/todo/delete/"+id ).then(response => {
      if (response.status === 200) {
        alert("Task deleted successfully");
        axios.get('https://mi-linux.wlv.ac.uk/~2017754/todo/')
          .then(res => {
            setTasks(res.data.reverse());
          });
      }
    });
  }


  function editTask(id, newName) {
    const data = {
      title: newName
    };
    axios.post("https://mi-linux.wlv.ac.uk/~2017754/todo/updateTask/"+id, data).then(response => {
      if (response.status === 200) {
        alert("Task Edited successfully");
        axios.get('https://mi-linux.wlv.ac.uk/~2017754/todo/')
          .then(res => {
            setTasks(res.data.reverse());
          });
      }
    });
  }

  const loadTasks = async () => {
    const result = await axios.get("https://mi-linux.wlv.ac.uk/~2017754/todo");
    setTasks(result.data.reverse());
  };

  const taskList = tasks
  .filter(FILTER_MAP[filter])
  .map(task => (
    <Todo
      id={task.id}
      name={task.title}
      completed={task.status == 1 ? true : false}
      key={task.id}
      toggleTaskCompleted={toggleTaskCompleted}
      deleteTask={deleteTask}
      editTask={editTask}
    />
  ));

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));

  function addTask(name) {
    const newTask = { id: "todo-" + nanoid(), name: name, completed: false };
    setTasks([...tasks, newTask]);
  }


  const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
  const headingText = `${taskList.length} ${tasksNoun} remaining`;

  const listHeadingRef = useRef(null);
  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    loadTasks();
    if (tasks.length - prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);

  return (
    <div className="todoapp stack-large">
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
        {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>
        {headingText}
      </h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading"
      >
        {taskList}
      </ul>
    </div>
  );
}

export default App;
