import GridEditor from "./components/GridEditor/GridEditor";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Shape Dragging App</h1>
      <GridEditor />
    </div>
  );
};

export default App;
