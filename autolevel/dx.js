import { Delaunator } from "delaunator";
export function CreateDelaunator(points) {
  return new Delaunator(points);
}
