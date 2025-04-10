import { createContext, RefObject } from "react";
import { GraphRequest, GraphRequestReturn } from "./BackendInterfaces";

export interface ChartDataProps {
    req: GraphRequest;
    ret: GraphRequestReturn | undefined;
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
}

export const ChartDataPropContext = createContext<ChartDataProps[]>([]);