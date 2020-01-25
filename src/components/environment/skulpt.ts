import React, { useState, useEffect, useMemo, useCallback } from 'react';

export function useSkulpt(onOutput: (output: string) => void,) {
    const [worker, setWorker] = useState<Worker>();

    // load skulpt worker
    useEffect(() => {
        setWorker(new Worker('./webworker.js'));
        return () => {
            //cleanup
            !!worker && worker.terminate();
        }
    }, []);

    // set skulpt listener
    useEffect(() => {


        if (!!worker) {
            worker.addEventListener('message', (message) => {
                onOutput(message.data);
            });
        }

        return () => {
            worker && worker.removeEventListener('message', (message) => {
                onOutput(message.data);
            });
        };
    }, [worker]);

    // on new code
    const runCode = useCallback((code: string) => {
        worker && worker.postMessage(code);
    }, []);

    return runCode;
}
