import React, { MouseEvent, useState } from "react";
import { useContext } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { GraphRequest } from "../../types/BackendInterfaces";

type Props = { set_graph_request: (req: GraphRequest|undefined) => void }

const EditBar: React.FC<Props> = (props) => {

  const newReq: GraphRequest = {
    id: 'testgraph',
    type: 'returns',
    range: ['00', '01'],
  };

  const handleClick = (_: any): void => {
    props.set_graph_request(newReq);
  };

  return (
    <div id="editbar">
      <button onClick={handleClick}>Add Chart</button>
    </div>
  );
};

export default EditBar;
