import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export declare type EntityCommand<T> = (current: T) => Promise<T>;

export declare type EntityDispatcher<T> = {
  dispatch(command: EntityCommand<T>): Promise<void>;
};

export  declare type EntityContext<T> = {
  loading: boolean;
  current?: T;
  dispatcher: EntityDispatcher<T>;
  refresh: () => Promise<void>;
  // modify: (transform: EntityCommand<T>) => Promise<void>;
};


export declare type EntityLoader<T> = (key: string) => Promise<T>;

// Forcing strings for identifiers right now but could make this smarter
export function useEntityCache<T>(key: string, loader: EntityLoader<T>) {
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [current, setCurrent] = useState<T | undefined>(
    undefined
  );
  const modify = useCallback(
    async (transform: EntityCommand<T>) => {
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
      const entity = await loader(key);
      setCurrent(entity);
      setInitialized(true);
    } finally {
      setLoading(false);
    }
  }, [setCurrent, setInitialized, setLoading, loader, key]);

  useEffect(() => {
    if (initialized || loading) {
      return;
    }

    executeQuery();
  }, [initialized, loading, executeQuery]);

  const dispatcher: EntityDispatcher<T> = useMemo(() => {
    return {
      dispatch(command) {
        return modify(command);
      }
    }
  }, [modify]);

  const context: EntityContext<T> = useMemo(
    () => ({
      current,
      dispatcher,
      loading,
      refresh: executeQuery,
    }),
    [current, executeQuery, loading, dispatcher]
  );

  return context;
}