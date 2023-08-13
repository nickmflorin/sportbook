import { useRef, useEffect, useMemo, type DependencyList } from "react";

import isEqual from "lodash.isequal";

export const useDeepEqualMemo: typeof useMemo = (fn, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useMemo(fn, [signalRef.current]);
};

export const useDeepEqualEffect: typeof useEffect = (effect, deps) => {
  const ref = useRef<DependencyList>();
  const signalRef = useRef<number>(0);

  if (!isEqual(deps, ref.current)) {
    ref.current = deps;
    signalRef.current += 1;
  }

  /* eslint-disable-next-line react-hooks/exhaustive-deps */
  return useEffect(effect, [signalRef.current]);
};
