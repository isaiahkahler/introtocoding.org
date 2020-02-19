import React, { useState, useRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren, useLayoutEffect, createRef } from 'react';
import Sidebar from './sidebar';
import Terminal from './terminal';
import Editor from './editor';
import { useSkulpt } from './skulpt';
import { styled, useTheme } from '@material-ui/core/styles';
import Resizable from '../resizable';
import Button from '@material-ui/core/Button';
import { ToolbarSpacer } from '../mixins';
import { useXterm } from './xterm';



interface EnvironmentProps {

}

const StyledEnvironment = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100vh',
});

const StyledColumnsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    overflow: 'hidden',
});

const StyledRowsContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    overflow: 'hidden'
});

const StyledContentContainer = styled('div')({
    display: 'flex',
    flexGrow: 1,
});

const StyledSidebar = styled('div')(({ theme }) => ({
    width: '250px',
    [theme.breakpoints.down('xs')]: {
        width: '100vw',
    },
}));

const StyledColumn = (props: PropsWithChildren<{ vertical?: boolean }>) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: props.vertical ? 'column' : 'row',
            flexGrow: 1,
            // width: '100%',
        }}>
            {props.children}
        </div>
    );
}

export default function Environment(props: EnvironmentProps) {

    const theme = useTheme();

    const [showSidebar, setShowSidebar] = useState(true);

    const [showTerminal, setShowTerminal] = useState(true);

    const terminalEl = document.createElement('div');

    const terminalRef = createRef<HTMLDivElement>();

    const terminal = useXterm(terminalRef, {}, onInput);

    function onInput(data: string) {
        if (data === 'run') {
            const code = editorRef.current.getContent()
            runCode(code);
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
            <StyledColumnsContainer>

                {/* sidebar */}
                <StyledColumn>
                    <StyledSidebar>
                        Side Bar
                    </StyledSidebar>
                </StyledColumn>

                <Resizable>
                    <StyledRowsContainer>
                        {/* editor */}
                        <Resizable horizontal>
                            <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} />
                        </Resizable>
                        {/* terminal */}
                        <div ref={terminalRef}></div>
                    </StyledRowsContainer>
                </Resizable>

            </StyledColumnsContainer>
        </StyledEnvironment>
    );
}