import React, { useState, useEffect, useRef } from 'react';
import Monaco from '@monaco-editor/react';

interface EditorProps {
    theme: 'light' | 'dark',
    onEditorReady: () => void,
    valueGetter: React.MutableRefObject<(() => string) | undefined>,
    
}

export default function Editor(props: EditorProps) {

    return (
        //get language from course
        //get theme from settings or mui theme

        <Monaco language='python' height='500px' theme={props.theme} editorDidMount={(_valueGetter) => {
            props.onEditorReady();
            props.valueGetter.current = _valueGetter;
        }} />
    );
}