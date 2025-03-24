import { useState } from 'react';

import { Dataset } from "./types/BackendInterfaces";

import GridEditor from "./components/GridEditor/GridEditor";
import EditBar from './components/EditBar/EditBar';
import "./App.css";

const App: React.FC = () => {
  const [datasets, setDatasets] = useState<Dataset[]>([
    {
      id: "chart1",
      data: [1,4,7,4,2],
      axes: ["A", "B", "C"],
      supportedTypes: ["bar"]
    },
    {
      id: "chart2",
      data: [4,4,8,3,9.3],
      axes: ["A", "B", "C"],
      supportedTypes: ["bar"]
    }
  ]);

  return (
    <div className="App">
      <h1>Shape Dragging App</h1>
      <EditBar datasets={datasets} />
      <GridEditor datasets={datasets} />
    </div>
  );
};

export default App;
