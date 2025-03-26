import "./App.css";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const TotoItemInputField = (props) => {
  const [input, setInput] = useState();

  return (
    <div>
      <TextField id="todo-item-input" label="todo Item" variant="outlined" onChange={(e) => setInput(e.target.value)} value={input} />
        <Button variant="outlined">submit</Button>
    </div>
  );
};
function App() {
  return (
    <div className="App">
      <TotoItemInputField />
    </div>
  );
}

export default App;
