import React, { useState, useEffect, useRef } from 'react';
import Monaco from '@monaco-editor/react';

interface EditorProps { }

export default function Editor(props: EditorProps) {

    const valueGetter = useRef<() => string>();

    const [editorReady, setEditorReady] = useState(false);

    const [skulptWorker, setSkulptWorker] = useState<Worker>();

    const [output, setOutput] = useState('');

    // load skulpt worker
    useEffect(() => {
        setSkulptWorker(new Worker('./webworker.js'))
    }, []);

    // set skulpt listener
    useEffect(() => {
        if (!!skulptWorker) {
            skulptWorker.addEventListener('message', (message) => {
                setOutput(previous => previous + message.data);
            });
        }
    }, [skulptWorker]);

    return (

        <Monaco language='python' height='500px' theme='dark' editorDidMount={(_valueGetter) => {
            setEditorReady(true);
            valueGetter.current = _valueGetter;
        }} />

        // <Button variant='contained' onClick={() => {
        //     !!valueGetter.current && !!skulptWorker && skulptWorker.postMessage(valueGetter.current());
        //     setOutput('');
        // }} >
        //     RUn
        //             </Button>
    );
}