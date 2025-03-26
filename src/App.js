import "./App.css";

import { useState } from 'react';
import TextField from '@mui/material/TextField';

const TotoItemInputField = (props) => {
const [input, setInput] = useState();

  return <div>
    <TextField
    id="todo-item-input"
    label="todo Item"
    variant="outlined"
    onChange={(e)=>setInput(e.target.value)}
    value={input}
    />
  </div>;
};
function App() {
  return <div className="App">
    <TotoItemInputField />
  </div>;
}

export default App;
