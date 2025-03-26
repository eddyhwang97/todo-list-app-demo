import "./App.css";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const TotoItemInputField = (props) => {
  const [input, setInput] = useState();

  const onSubmit = ()=>{
    props.onSubmit(input);
    setInput("");
  }

  return (
    <div>
      <TextField id="todo-item-input" label="todo Item" variant="outlined" onChange={(e) => setInput(e.target.value)} value={input} />
      <Button variant="outlined" onClick={onSubmit}>submit</Button>
    </div>
  );
};
function App() {
  return (
    <div className="App">
      {/* TotoItemInputField/버튼 눌렀을때  onSubmit callback 콜해주기  */}
      <TotoItemInputField onSubmit={()=>{}}/> 
    </div>
  );
}

export default App;
