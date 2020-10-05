import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Monaco from '@monaco-editor/react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface EditorProps {
    theme: 'light' | 'dark',
    onEditorReady?: () => void,
}

const starterCode = "print('Welcome to the Intro To Coding demo!') \n\n# to get started, type \"run python\" in the terminal below. \n\n# Many features are still a work in progress. \n\nx = 4\nfor y in range(x):\n    print(y)";

const Editor = forwardRef((props: EditorProps, ref: any) => {
    const valueGetterRef = useRef<any>();

    useImperativeHandle(ref, () => ({
        getContent: () => {
            const valueGetter = valueGetterRef.current;
            if (!valueGetter) return '';
            return valueGetter();
        }
    }));

    return (
        //get language from course
        //get theme from settings or mui theme
        <Monaco language='python' theme={props.theme} value={starterCode} loading={'loading...'} editorDidMount={(_valueGetter) => {
            props.onEditorReady && props.onEditorReady();
            valueGetterRef.current = _valueGetter;
        }} />
    );
})

export default Editor;