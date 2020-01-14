import React, { useState, useRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import Sidebar from './sidebar';
import Terminal from './terminal';
import Editor from './editor';
import { useSkulpt } from './skulpt';

import Grid from '@material-ui/core/Grid';
import { makeStyles, styled } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';



interface EnvironmentProps {

}

const StyledEnvironment = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
}));

const StyledSidebar = styled('div')(({ theme }) => ({
    width: '250px',
    [theme.breakpoints.down('xs')]: {
        width: '100vw',
    },
}));


const StyledColumn = (props: PropsWithChildren<{ vertical: boolean }>) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: props.vertical ? 'column' : 'row',
            width: '100%',
        }}>
            {props.children}
        </div>
    );
}

export default function Environment(props: EnvironmentProps) {

    const [showSidebar, setShowSidebar] = useState(true);

    const [showTerminal, setShowTerminal] = useState(true);

    const [terminalVertical, setTerminalVertical] = useState(true);

    const editorValueGetter = useRef<() => string>();

    const runCode = useSkulpt((output) => { console.log(output) });

    const [count, setCount] = useState(1);



    return (

        //implement button bar

        <StyledEnvironment>
            {showSidebar && <StyledSidebar>
                sidebar
                <Button variant='contained' onClick={() => { setCount(count + 1) }}>
                    {count} clicks
                </Button>
            </StyledSidebar>}
            <StyledColumn vertical={terminalVertical}>
                <Editor theme='dark' onEditorReady={() => { }} valueGetter={editorValueGetter} />
                {showTerminal && <div>
                    {/* terminal */}
                    {/* <Button onClick={() => { setTerminalVertical(!terminalVertical) }}>switch</Button> */}
                    <Terminal onInput={(input) => {console.log(input)}} theme='light' />
                </div>}
            </StyledColumn>
        </StyledEnvironment>
    );
}