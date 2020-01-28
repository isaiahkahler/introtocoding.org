import { useEffect, useCallback, useMemo, useRef } from 'react';

export function useSkulpt(onOutput: (output: string) => void,) {
    const worker = useMemo(() => new Worker('./webworker.js'), []);
    const onOutputRef = useRef(onOutput);

    useEffect(() => {
        return () => {
            worker.terminate();
        };
    }, [worker]);

    // set skulpt listener
    useEffect(() => {
        const handleMessage = (message: {data: string}) => {
            const onOutput = onOutputRef.current;
            onOutput(message.data);
        }
        worker.addEventListener('message', handleMessage);

        return () => {
            worker.removeEventListener('message', handleMessage);
        };
    }, [worker]);

    // on new code
    const runCode = useCallback((code: string) => {
        worker.postMessage(code);
    }, [worker]);

    return runCode;
}
