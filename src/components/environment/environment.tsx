import React, { useState, useRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useLayoutEffect, createRef } from 'react';
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

    const terminalEl = document.createElement('div');

    const terminalRef = createRef<HTMLDivElement>();

    const terminal = useXterm(terminalRef, {}, onInput);

    const sidebarRef = createRef<HTMLDivElement>();
    const rowContainerRef = createRef<HTMLDivElement>();
    const containerRef = createRef<HTMLDivElement>();

    const terminalContainerRef = createRef<HTMLDivElement>();
    const editorContainerRef = createRef<HTMLDivElement>();

    useResizable(sidebarRef, rowContainerRef, containerRef, 'vertical');
    useResizable(terminalContainerRef, editorContainerRef, containerRef, 'horizontal');

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

    // const

    const editorRef = useRef<any>();

    const runCode = useSkulpt((output) => {
        terminal.write(output);
    });

    // sets the terminal position to absolute while resizing
    const [holdTerminal, setHoldTerminal] = useState(false);

    return (
        
        <StyledEnvironment>
            <ToolbarSpacer />

            <StyledColumnsContainer ref={containerRef}>
                {/* <Resizable>
                    column !
                </Resizable> */}

                <div ref={sidebarRef} style={{width: '500px'}}>hello</div>

                <div ref={rowContainerRef}>
                    {/* <StyledEditorContainer ref={editorContainerRef}>
                        <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} /> 
                    </StyledEditorContainer> */}
                    <div ref={editorContainerRef}>
                        stuff
                    </div>
                    <div ref={terminalContainerRef} style={{height: '500px'}}>
                        <div ref={terminalRef}></div>
                    </div>
                </div>

                {/* <StyledRowsContainer>
                    <StyledEditorContainer>
                        <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} /> 
                    </StyledEditorContainer>
                    <Resizable horizontal>
                        <div ref={terminalRef}></div>
                    </Resizable>
                </StyledRowsContainer> */}

            </StyledColumnsContainer>

        </StyledEnvironment>
        // <StyledEnvironment>

        //     <ToolbarSpacer />
        //     <StyledColumnsContainer>

        //         {/* sidebar */}
        //         {/* <StyledColumn>
        //             <StyledSidebar>
        //                 Side Bar
        //             </StyledSidebar>
        //         </StyledColumn> */}

        //         <Resizable>
        //             side bar
        //         </Resizable>

        //         <StyledRowsContainer>
        //             <Resizable horizontal>
        //                 <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} />
        //             </Resizable>
        //             {/* <div style={{position: 'fixed', width: '100%', height: '100%'}}>
        //                 <div style={{height: '500px', width: '500px', }}></div>
        //             </div> */}
        //             {/* <div style={{flexGrow: 1, position: 'absolute'}}> */}
        //                 <div ref={terminalRef}></div>
        //             {/* </div> */}
        //         </StyledRowsContainer>

        //     </StyledColumnsContainer>
        // </StyledEnvironment>
    );
}