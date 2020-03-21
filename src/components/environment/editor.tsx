import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import Monaco from '@monaco-editor/react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface EditorProps {
    theme: 'light' | 'dark',
    onEditorReady?: () => void,
}

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

        <Monaco language='python' theme={props.theme} loading={'loading...'} editorDidMount={(_valueGetter) => {
            props.onEditorReady && props.onEditorReady();
            valueGetterRef.current = _valueGetter;
        }} />
    );
})

export default Editor;