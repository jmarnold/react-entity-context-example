import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSolution } from "./SolutionData";
import { SolutionViewModel } from "./SolutionTypes";

export declare type EntityCommand<T> = (current: T) => Promise<T>;

declare type EntityContext<T> = {
  loading: boolean;
  current?: T;
  modify: (transform: EntityCommand<T>) => Promise<void>;
};

const SolutionContext = createContext<
  EntityContext<SolutionViewModel> | undefined
>(undefined);

declare type SolutionProviderProps = {
  id: string;
} & PropsWithChildren;

export function SolutionProvider(props: SolutionProviderProps) {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [current, setCurrent] = useState<SolutionViewModel | undefined>(
    undefined
  );
  const modify = useCallback(
    async (transform: EntityCommand<SolutionViewModel>) => {
      if (!current) {
        return;
      }

      const modified = await transform(current);
      setCurrent(modified);
    },
    [current, setCurrent]
  );

  const executeQuery = useCallback(async () => {
    setInitialized(false);
    setLoading(true);

    try {
      const solution = await getSolution(props.id);
      setCurrent(solution);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [setCurrent, setInitialized, setLoading, props.id]);

  useEffect(() => {
    if (initialized || loading) {
      return;
    }

    executeQuery();
  }, [initialized, loading, executeQuery]);

  const context: EntityContext<SolutionViewModel> = useMemo(
    () => ({
      current,
      loading,
      modify,
    }),
    [current, loading, modify]
  );

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

declare type EntityDispatcher<T> = {
  dispatch(command: EntityCommand<T>): Promise<void>;
};

export function useSolutionDispatcher() {
  const { modify } = useSolution();
  const dispatcher: EntityDispatcher<SolutionViewModel> = useMemo(() => {
    return {
      dispatch(command) {
        return modify(command);
      }
    }
  }, [modify]);

  return dispatcher;
}