import "./App.css";
import React, { useState } from "react";
import { Input, Divider, List, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import TodoList from "./NewTodolist.js";

function App() {
  
  return (
    <div className="App">
    <TodoList/>
    
    </div>
  );
}

export default App;
