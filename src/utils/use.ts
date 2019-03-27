import * as React from "react";

export function useEffectSkipN(effect: React.EffectCallback, deps?: React.DependencyList, n = 1) {
  const countRef = React.useRef(0);

  React.useEffect(() => {
    if (countRef.current >= n) {
      return effect();
    } else {
      countRef.current++;
    }
  }, deps);
}

export function useEffectCond(effect: React.EffectCallback, cond = () => true, deps?: React.DependencyList, n = 1) {
  const countRef = React.useRef(0);

  React.useEffect(() => {
    if (cond()) {
      if (countRef.current < n) {
        countRef.current++;
        return effect();
      }
    }
  }, deps);
}

export function useValueRef<T>(val: T) {
  const ref = React.useRef(val);
  React.useEffect(() => {
    ref.current = val;
  }, [val]);
  return ref;
}

export function useEffectRef<T>(effect: (ref: React.MutableRefObject<T>) => void | (() => void | undefined), val: T, deps?: React.DependencyList) {
  const ref = useValueRef(val);
  React.useEffect(() => effect(ref), deps);
}