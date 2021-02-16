import { useRef, useEffect, useState } from "react";

type PromiseState<T> = {
    error?: Error;
    done: false;
    result: T | undefined;
} | {
    error?: Error;
    done: true
    result: T;
};

export function usePromise<T>(fn: () => Promise<T>, dependencies: any[]): [boolean, T] {
    const active = useRef({ promise: null as any });
    const [state, setState] = useState<PromiseState<T>>({
        done: false,
        result: undefined
    });

    useEffect(() => {
        let promise = Promise
            .resolve<any>(undefined)
            .then(fn)
            .then(
                result => {
                    if (active.current.promise !== promise) return;
                    setState({ done: true, result });
                },
                error => {
                    if (active.current.promise !== promise) return;
                    setState({ done: false, error, result: undefined });
                    throw error;
                });

        active.current.promise = promise;
        setState({ done: false, result: undefined });
        return () => active.current.promise = undefined;
    }, dependencies);

    if (state.error) {
        throw state.error;
    }
    return [state.done, state.result as any];
}

// store a state value in localStorage to preserve it between page views
export const useLocalState = (name, initialValue) => {
    const [value, setValue] = useState(localStorage[name] === undefined ? initialValue : JSON.parse(localStorage[name]));
    useEffect(() => {
        localStorage[name] = JSON.stringify(value);
    }, [value]);
    return [value, setValue];
}

// get the value from an input field in an html change event
export const changeFnNumber = fn => evt => fn(Number(evt.target.value));
