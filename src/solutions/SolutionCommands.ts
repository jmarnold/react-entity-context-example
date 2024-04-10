
import { EntityCommand } from "./EntityContext";
import { SolutionViewModel } from "./SolutionTypes";

export declare type SaveSolutionParams = {
  id: string;
  title: string;
};

export function saveSolution(params: SaveSolutionParams): EntityCommand<SolutionViewModel> {
  return async (solution) => {
    // call the api
    return {
      ...solution,
      title: params.title,
    };
  };
}