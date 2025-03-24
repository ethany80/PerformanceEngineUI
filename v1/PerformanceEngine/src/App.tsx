import { createContext, useState } from 'react';

import { SharedContent } from './types/DataContexts';

import GridEditor from "./components/GridEditor/GridEditor";
import EditBar from './components/EditBar/EditBar';
import "./App.css";
import { GraphRequest } from './types/BackendInterfaces';

const App: React.FC = () => {
  const [newGraph, setNewGraph] = useState<GraphRequest|undefined>(undefined);

  return (
    <div className="App">
      <h1>Shape Dragging App</h1>
      <EditBar set_graph_request={setNewGraph} />
      <GridEditor new_graph_request={newGraph} set_graph_request={setNewGraph} />
    </div>
  );
};

export default App;
