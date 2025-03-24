import React, { useState } from "react";
import { useRef } from "react";
import { BarChart } from "@mui/x-charts/BarChart";

import { Dataset } from "../../types/BackendInterfaces";

type Props = {datasets: Dataset[]}

const EditBar: React.FC<Props> = (props) => {

  return (
    <div id="editbar">
      <p>Editor</p>
    </div>
  );
};

export default EditBar;
