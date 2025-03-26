import "./App.css";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

// TotoItemInputField :  Todo아이템 입력할 컴포넌트
const TotoItemInputField = (props) => {
  const [input, setInput] = useState();
  // onSubmit : submit버튼 클릭시 택스트필드에 있는 text 전송
  const onSubmit = () => {
    props.onSubmit(input);
    setInput("");
  };

  return (
    <div>
      <TextField id="todo-item-input" label="todo Item" variant="outlined" onChange={(e) => setInput(e.target.value)} value={input} />
      <Button variant="outlined" onClick={onSubmit}>
        submit
      </Button>
    </div>
  );
};

// TotoItemLIst :  등록된 아이템 보여줄 컴퍼넌트
const TotoItemLIst = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    return <li key={index}>{todoItem.todoItemContent}</li>;
  });
  return (
    <div>
      <ul>{todoList}</ul>
    </div>
  );
};

// app 컴포넌트
function App() {
  return (
    <div className="App">
      {/* TotoItemInputField/버튼 눌렀을때  onSubmit callback 콜해주기  */}
      <TotoItemInputField onSubmit={() => {}} />
        {/* TodoItemList 콤포넌트 props 로 등록된 Todo 아이템들 받기  */}
      <TotoItemLIst todoItemList={[]} />
    </div>
  );
}

export default App;
