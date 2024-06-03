import React, { useState, useEffect } from "react";
import { CloseOutlined } from "@ant-design/icons";

import {
  Input,
  Checkbox,
  Button,
  List,
  Typography,
  Flex,
  Segmented,
} from "antd";

const { Text } = Typography;

function Task({ task, index, completeTask, removeTask }) {
  const [hover, setHover] = useState(false);
  const handlemouseover = () => {
    setHover(true);
  };
  const handlemouseout = () => {
    setHover(false);
  };

  return (
    <div
      style={{ textDecoration: task.completed ? "line-through" : "" }}
      onMouseOver={handlemouseover}
      onMouseOut={handlemouseout}
    >
      <Flex gap="middle" justify={"flex-end"}>
        <Checkbox
          onClick={() => completeTask(task.id)}
          checked={task.completed ? true : false}
        ></Checkbox>
        <Text>{task.value}</Text>
        {hover && (
          <Button
            size="small"
            type="dashed"
            onClick={() => removeTask(task.id)}
            shape="circle"
            icon={<CloseOutlined />}
          />
        )}
      </Flex>
    </div>
  );
}
function CreateTask({ addTask }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTask(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="text"
        className="input"
        value={value}
        placeholder="Add a new task"
        onChange={(e) => setValue(e.target.value)}
      />
    </form>
  );
}

function NewTodolist() {
  const [task, setTask] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("task"));
    if (stored) {
      setTask(stored);
    }
  }, []);
  const updateStorage = (taskList) => {
    localStorage.setItem("task", JSON.stringify(taskList));

    setTask(taskList);
  };

  const [filter, setfilter] = useState("All");

  const FILTER = {
    All: () => true,
    Active: (task) => !task.completed,
    Completed: (task) => task.completed,
  };
  const filtername = Object.keys(FILTER);

  const filterList = filtername.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setfilter={setfilter}
    ></FilterButton>
  ));

  function FilterButton(props) {
    return (
      <Button
        aria-pressed={props.isPressed}
        onClick={() => setfilter(props.name)}
        type={props.isPressed ? "primary" : "default"}
      >
        {props.name}
      </Button>
    );
  }

  const completeTask = (id) => {
    const newTask = [...task];
    let t = newTask.find((todo) => todo.id == id);
    t.completed = !t.completed;
    updateStorage(newTask);
  };

  const checkAll = () => {
    const newTask = [...task];
    if (newTask.every((task) => task.completed == true)) {
      newTask.forEach((task) => {
        task.completed = false;
      });
    } else {
      newTask.forEach((task) => {
        task.completed = true;
      });
    }
    updateStorage(newTask);
  };

  const removeTask = (id) => {
    const newTask = task.filter((task) => task.id !== id);
    updateStorage(newTask);
  };

  const clearCompleted = () => {
    const newTask = task.filter((todo) => todo.completed == false);
    updateStorage(newTask);
  };

  const addTask = (item) => {
    let newTask = [];

    if (task.length == 0) {
      newTask = [...task, { id: 1, value: item, completed: false }];
    } else {
      newTask = [
        ...task,
        { id: task[task.length - 1].id + 1, value: item, completed: false },
      ];
    }

    updateStorage(newTask);
  };

  const Actives = () => {
    let n = 0;
    task.forEach((todo) => {
      if (todo.completed == false) {
        n++;
      }
    });
    return <>{n} left</>;
  };

  return (
    <div>
      <div>
        <CreateTask addTask={addTask} />
      </div>

      <div className="tasks">
        {task && task.length > 0 ? (
          <>
            <List bordered>
              <List.Item>{filterList}</List.Item>
              {task.filter(FILTER[filter]).map((task, index) => (
                <List.Item key={task.id}>
                  <Task
                    task={task}
                    index={index}
                    key={task.id}
                    removeTask={removeTask}
                    completeTask={completeTask}
                  />
                </List.Item>
              ))}{" "}
            </List>
            <Checkbox onClick={checkAll}></Checkbox> check all
            <Button type="link" danger onClick={clearCompleted}>
              clear completed
            </Button>
          </>
        ) : (
          <Text type="secondary">add a new task!</Text>
        )}
      </div>
    </div>
  );
}
export default NewTodolist;
