import { createContext, useState } from 'react';


import GridEditor from "./components/GridEditor/GridEditor";
import EditBar from './components/EditBar/EditBar';
import "./App.css";
import { GraphRequest } from './types/BackendInterfaces';

const App: React.FC = () => {
  const [newGraph, setNewGraph] = useState<GraphRequest|undefined>(undefined);
  const [loadData, setLoadData] = useState<boolean>(false);

  const loadBtnClick = (_: any): void => {
    setLoadData(true);
  };

  return (
    <div className="App">
      <h1>Shape Dragging App</h1>
      <EditBar set_graph_request={setNewGraph} />
      <button onClick={loadBtnClick}>Load Data</button>
      <GridEditor 
        new_graph_request={newGraph} 
        set_graph_request={setNewGraph} 
        loadData={loadData}
        setLoaded={setLoadData} />
    </div>
  );
};

export default App;
