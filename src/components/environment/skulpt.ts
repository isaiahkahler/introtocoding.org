import React, { useState, useEffect } from 'react';

export function useSkulpt(onOutput: (output: string) => void,) {
    const [worker, setWorker] = useState<Worker>();

    const [code, runCode] = useState('');

    // load skulpt worker
    useEffect(() => {
        setWorker(new Worker('./webworker.js'))
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
    }, [worker]);

    // on new code
    useEffect(() => {
        !!worker && worker.postMessage(code);
    }, [code]);

    return runCode;
}
