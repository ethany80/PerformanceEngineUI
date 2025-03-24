import React, { MouseEvent, useState } from "react";
import { useContext } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { GraphRequest } from "../../types/BackendInterfaces";
import { MOCK_BAR_GRAPH_REQUEST, MOCK_PIE_GRAPH_REQUEST } from "../../types/Constants";



type Props = { set_graph_request: (req: GraphRequest|undefined) => void }

const EditBar: React.FC<Props> = (props) => {

  const rand = Math.floor(Math.random() * 2);
  
  let newReq: GraphRequest;
  if (rand == 0) {
    newReq = MOCK_BAR_GRAPH_REQUEST;
  } else if (rand == 1) {
    newReq = MOCK_PIE_GRAPH_REQUEST
  }

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
