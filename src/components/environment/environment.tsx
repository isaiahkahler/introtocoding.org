import React, { useState, useRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useLayoutEffect, createRef, useEffect } from 'react';
import Sidebar from './sidebar';
import Editor from './editor';
import { useSkulpt } from './skulpt';
import { styled, useTheme } from '@material-ui/core/styles';
import Resizable from '../resizable';
import Button from '@material-ui/core/Button';
import { ToolbarSpacer } from '../mixins';
import { useXterm } from './xterm';
import { useResizable } from './resizable';



interface EnvironmentProps {

}

const StyledEnvironment = styled('div')({
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
});

const StyledColumnsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
});

const StyledRowsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
});

const StyledEditorContainer = styled('div')({
});


export default function Environment(props: EnvironmentProps) {

    const theme = useTheme();

    const [showSidebar, setShowSidebar] = useState(true);

    const [showTerminal, setShowTerminal] = useState(true);

    const terminalRef = createRef<HTMLDivElement>();

    const terminal = useXterm(terminalRef, {}, onInput);

    const sidebarRef = createRef<HTMLDivElement>();
    const rowContainerRef = createRef<HTMLDivElement>();
    const containerRef = createRef<HTMLDivElement>();

    const terminalContainerRef = createRef<HTMLDivElement>();
    const editorContainerRef = createRef<HTMLDivElement>();

    useResizable({
        targetRef: sidebarRef, 
        mirrorRef: rowContainerRef, 
        containerRef: containerRef, 
        direction: 'vertical',
    });
    useResizable({
        targetRef: terminalContainerRef, 
        mirrorRef: editorContainerRef, 
        containerRef: containerRef, 
        direction: 'horizontal',
        onResize: () => {
            terminal.resize();
        }
    });

    function onInput(data: string) {
        if (data === 'run') {
            const code = editorRef.current.getContent()
            runCode(code);
        } else if(data === 'clear'){
            terminal.clear();
        } else {
            terminal.write(`command not found: ${data}`);
        }
    }

    useEffect(() => {
        console.log(`terminal ready: ${terminal.isReady}`);
    }, [terminal.isReady]);

    const editorRef = useRef<any>();

    const runCode = useSkulpt((output) => {
        terminal.write(output);
    });

    return (
        
        <StyledEnvironment>
            <ToolbarSpacer />

            <StyledColumnsContainer ref={containerRef}>

                <div ref={sidebarRef} style={{width: '500px'}}>hello</div>

                <div ref={rowContainerRef}>
                    <div ref={editorContainerRef}>
                        <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} /> 
                      
                    </div>
                    <div ref={terminalContainerRef} style={{height: '500px'}}>
                        <div ref={terminalRef} style={{width: '100%', height: '100%'}}></div>
                    </div>
                </div>

            </StyledColumnsContainer>

        </StyledEnvironment>
    );
}