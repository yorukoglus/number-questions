import "./App.css";
import logo from './logo.svg';
import NumberReader from "./NumberReader";

function App() {
  return (
    <div className="App">
    <img src={logo} className="App-logo" alt="logo" />
      <NumberReader />
    </div>
  );
}

export default App;
