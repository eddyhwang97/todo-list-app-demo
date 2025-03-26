import "./App.css";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

let todoItemId = 0;

// TotoItemInputField :  Todo아이템 입력할 컴포넌트
const TotoItemInputField = (props) => {
  // textField에 입력도니 todo state로 관리
  const [input, setInput] = useState("");

  // onSubmit : submit버튼 클릭시 택스트필드에 있는 text 전송
  const onSubmit = () => {
    // 버튼을 누르면 input값을 상위컴포넌트인 onSubmit로 값을넘겨줌
    props.onSubmit(input);
    setInput("");
  };

  return (
    <div>
      <TextField id="todo-item-input" label="todo Item" variant="outlined" onChange={(e) => setInput(e.target.value)} value={input} />
      {/* 버튼 눌렀을때  onSubmit callback 콜해주기  */}
      <Button variant="outlined" onClick={onSubmit}>
        submit
      </Button>
    </div>
  );
};

// TodoItem : 등록된 아이템 li>span
const TodoItem = (props) => {
  const style = props.todoItem.isFinished ? { textDecoration: "line-through" } : {};
  console.log(props);
  return (
    <li>
      <span
        style={style}
        onClick={() => {
          props.onTodoItemClick(props.todoItem);
        }}
      >
        {props.todoItem.todoItemContent}
      </span>
    </li>
  );
};

// TotoItemLIst :  등록된 아이템 보여줄 컴퍼넌트 div>ul
const TotoItemLIst = (props) => {
  // todoItemList배열 map으로 리턴
  const todoList = props.todoItemList.map((todoItem, index) => {
    // 등록된 아이템
    return <TodoItem key={index} todoItem={todoItem} onTodoItemClick={props.onTodoItemClick} />;
  });
  return (
    <div>
      <ul>{todoList}</ul>
    </div>
  );
};

// app 컴포넌트
function App() {
  // Todo아이템들 state로 관리
  const [todoItemList, settodoItemList] = useState([]);

  // Todo 아이템 버튼 눌릴때 스테이트에 추가하는 callback function 만들어서 props로 넘겨줌
  const onSubmit = (newTodoItem) => {
    // newTodoItem은 TotoItemInputField에서 온 input값
    settodoItemList([
      ...todoItemList,
      {
        id: todoItemId++,
        todoItemContent: newTodoItem,
        isFinished: false,
      },
    ]);
  };

  const onTodoItemClick = (clickedTodoItem) => {
    settodoItemList(
      todoItemList.map((todoItem) => {
        if (clickedTodoItem.id === todoItem.id) {
          return {
            id: clickedTodoItem.id,
            todoItemContent: clickedTodoItem.todoItemContent,
            isFinished: !clickedTodoItem.isFinished,
          };
        } else {
          return todoItem;
        }
      })
    );
  };

  return (
    <div className="App">
      <TotoItemInputField onSubmit={onSubmit} />
      {/* TodoItemList 컴포넌트 props 로 등록된 Todo 아이템들 받기  */}
      <TotoItemLIst todoItemList={todoItemList} onTodoItemClick={onTodoItemClick} />
    </div>
  );
}

export default App;
