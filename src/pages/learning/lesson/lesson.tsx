import React, { useEffect, useState, useMemo, useRef } from 'react';
import Page from '../../../components/page';
import Editor from '@monaco-editor/react';
import { Button } from '@material-ui/core';

function LessonContainer(props: {}) {
   
    // const [loadedSkulpt, setLoadedSkulpt] = useState(0);
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
        if(!!skulptWorker){
            skulptWorker.addEventListener('message', (message) => {
                setOutput(previous => previous + message.data);
            });
        }
    }, [skulptWorker]);

    return (
        <Page title='Learning!'>
            <Editor language='python' height='500px' editorDidMount={(_valueGetter) => {
                setEditorReady(true);
                valueGetter.current = _valueGetter;
            }} />

            <Button variant='contained' onClick={() => {
                !!valueGetter.current && !!skulptWorker && skulptWorker.postMessage(valueGetter.current());
                setOutput('');
                }} >
                    RUn
                </Button>

            <div>
                {output}
            </div>
        </Page>
    );
}

export default LessonContainer;