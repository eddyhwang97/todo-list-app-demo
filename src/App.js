import "./App.css";
import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';


// ======================== firebase ======
// ========================================
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc, setDoc, doc, deleteDoc, getDocs, query, orderBy } from "firebase/firestore";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmuJD2NVIMa9N82BZGbrZJ2vDVjqLW5o0",
  authDomain: "todo-list-app-demo-15ca2.firebaseapp.com",
  projectId: "todo-list-app-demo-15ca2",
  storageBucket: "todo-list-app-demo-15ca2.firebasestorage.app",
  messagingSenderId: "1031929234392",
  appId: "1:1031929234392:web:25eed06c7bfb0847b528ad",
  measurementId: "G-RWS8HYV97C",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ======================== firebase ======

// firebase 에서 불러온 데이터
const db = getFirestore(app);

// ============== TotoItemInputField ======
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
// ============== TotoItemInputField ======

// ============== TodoItem ================
// TodoItem : 등록된 아이템 li>span
const TodoItem = (props) => {
  // style적용 : isFinished 상태면 strikethrough 적용
  const style = props.todoItem.isFinished ? { textDecoration: "line-through" } : {};
  return (
    <li>
      <span
        style={style}
        onClick={() => {
          // TodoItem 클릭시 onTodoItemClick에 todoItem 객체 정보 보냄
          props.onTodoItemClick(props.todoItem);
        }}
      >
        {props.todoItem.todoItemContent}
      </span>
      <Button
        variant="outlined"
        // 클릭시 onRemoveClick 함수로 삭제할 아이템 전송
        onClick={() => {
          props.onRemoveClick(props.todoItem);
        }}
      >
        Remove
      </Button>
    </li>
  );
};
// ============== TodoItem ================

// ============== TotoItemLIst ============
// TotoItemLIst :  등록된 아이템 보여줄 컴퍼넌트 div>ul
const TotoItemLIst = (props) => {
  // todoItemList배열 map으로 리턴
  const todoList = props.todoItemList.map((todoItem, index) => {
    // 등록된 아이템
    return (
      <TodoItem
        key={index}
        // 아이템
        todoItem={todoItem}
        // strikethrough함수
        onTodoItemClick={props.onTodoItemClick}
        // 완료아이템 삭제함수
        onRemoveClick={props.onRemoveClick}
      />
    );
  });
  return (
    <div>
      <ul>{todoList}</ul>
    </div>
  );
};
// ============== TotoItemLIst ============

const TodoListAppbar = (props)=>{
  return(
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{flexGrow:1}}>
          Todo List App
        </Typography>
        <Button color="inherit">Log In</Button>
      </Toolbar>
    </AppBar>
  )
}


// app 컴포넌트
function App() {
  // Todo아이템들 state로 관리
  const [todoItemList, settodoItemList] = useState([]);

  // syncTodoItemListStateWithFirestore : 서버에서 item 가져오기
  const syncTodoItemListStateWithFirestore = () => {
    const q = query(collection(db, "todoItem"), 
    orderBy("createdTime", "desc")); //추가
    getDocs(q).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          // item id
          id: doc.id,
          // item content
          todoItemContent: doc.data().todoItemContent,
          // item state
          isFinished: doc.data().isFinished,
          // item stamptime
          createdTime: doc.data().createdTime ?? 0, 
          //createdTime이 null,undifined면 return 0
        });
      });
      // firestoreTodoItemList : firestore에서 불러온 Todo아이템들
      settodoItemList(firestoreTodoItemList);
    });
  };
  // 렌더링시 처음 켜졌을때 Todo item 읽어오기
  useEffect(() => {
    syncTodoItemListStateWithFirestore();
    // 렌더링시 한번
  }, []);

  // onSubmit :  새로운 Todo 저장
  // -> Todo 아이템 버튼 눌릴때 스테이트에 추가하는 callback function 만들어서 props로 넘겨줌
  const onSubmit = async (newTodoItem) => {
    // 새로운 Todo 아이템이 생겼을 때 Firestore 에 저장하기
    await addDoc(collection(db, "todoItem"), {
      todoItemContent: newTodoItem,
      isFinished: false,
      createdTime: Math.floor(Date.now() / 1000),
    });

    // 추가된 item 다시 가져와서 셋팅
    syncTodoItemListStateWithFirestore();
  };

  // onTodoItemClick : 완료된 리스트 strikeThrough 하는 함수
  // -> isFinished 값 변경으로 토글기능
  const onTodoItemClick = async (clickedTodoItem) => {
    // todoItemRef : db 내 todoItem clickedTodoItem.id 값과 일치한느 데이터
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, { isFinished: !clickedTodoItem.isFinished }, { merge: true });

    // 완료 처리하면 item 상태 변경 후 재 셋팅
    syncTodoItemListStateWithFirestore();
  };

  // onRemoveClick : 완료된 아이템 삭제함수
  const onRemoveClick = async (removeTodoItem) => {
    // Todo 아이템 삭제할때 Firestore 에서도 지우기
    const todoItemRef = doc(db, "todoItem", removeTodoItem.id);
    await deleteDoc(todoItemRef);
    // 아이템 삭제 후 데이터 다시 가져오기
    syncTodoItemListStateWithFirestore();
  };

  return (
    <div className="App">
      <TodoListAppbar/>
      <TotoItemInputField onSubmit={onSubmit} />
      {/* TodoItemList 컴포넌트 props 로 등록된 Todo 아이템들 받기  */}
      <TotoItemLIst
        // 화면에 출력될 리스트 props
        todoItemList={todoItemList}
        // onTodoItemClick : 완료된 리스트 strikeThrough 하는 함수
        onTodoItemClick={onTodoItemClick}
        onRemoveClick={onRemoveClick}
      />
    </div>
  );
}

export default App;
