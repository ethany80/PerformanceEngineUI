import { GraphRequest, GraphRequestReturn } from "./BackendInterfaces";

export interface VizDataProps {
    req: GraphRequest;
    ret: GraphRequestReturn | undefined;
    x: number;
    y: number;
    width: number;
    height: number;
}