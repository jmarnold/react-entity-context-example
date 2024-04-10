import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
} from "react";
import { getSolution } from "./SolutionData";
import { SolutionViewModel } from "./SolutionTypes";
import { EntityContext, useEntityCache } from "./EntityContext";

const SolutionContext = createContext<
  EntityContext<SolutionViewModel> | undefined
>(undefined);

declare type SolutionProviderProps = {
  id: string;
} & PropsWithChildren;

export function SolutionProvider(props: SolutionProviderProps) {
  const loader = useCallback((id: string) => getSolution(id), []);
  const context = useEntityCache<SolutionViewModel>(props.id, loader);

  return (
    <SolutionContext.Provider value={context}>
      {props.children}
    </SolutionContext.Provider>
  );
}

export function useSolution() {
  const context = useContext(SolutionContext);
  if (!context) {
    throw new Error("no provider");
  }

  return context;
}
