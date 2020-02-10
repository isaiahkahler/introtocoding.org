import React, { useState, useRef, DetailedHTMLProps, HTMLAttributes, PropsWithChildren } from 'react';
import Sidebar from './sidebar';
import Terminal from './terminal';
import Editor from './editor';
import { useSkulpt } from './skulpt';
import { styled, useTheme } from '@material-ui/core/styles';
import Resizable from '../resizable';
import Button from '@material-ui/core/Button';
import { ToolbarSpacer } from '../mixins';



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

    // const

    const editorRef = useRef<any>();

    const runCode = useSkulpt((output) => { console.log(output, 'output') });

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
                        {/* <StyledContentContainer> */}
                            <Resizable horizontal>
                            <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} />
                            {/* editor */}

                            {/* <div style={{ width: '500px', height: '300px', backgroundColor: '#ff0000' }}> stuff </div> */}
                            </Resizable>
                        {/* </StyledContentContainer> */}
                        {/* terminal */}
                        {/* <div style={{ width: '500px', height: '300px', backgroundColor: '#00ff00' }}> stuff </div> */}

                        <Terminal onInput={(input) => {
                                console.log(input)

                                //todo:
                                // -look for 'python'
                                // -respond to unrecognized commands  
                                // -switch to an 'input' mode when text input is required
                                // 'python filename.py'

                            }} theme={theme.palette.type} username={'isaiahkahler'} resizing={holdTerminal} />
                        {/* terminal! */}
                    </StyledRowsContainer>
                </Resizable>

            </StyledColumnsContainer>
        </StyledEnvironment>
        // <StyledEnvironment>
        //     <Resizable>
        //         content
        //         <Button onClick={() => {
        //             const editor = editorRef.current;
        //             if (!editor) return;
        //             const content = editor.getContent();
        //             runCode(content);
        //         }}>run</Button>
        //     </Resizable>
        // {/* {showSidebar && <StyledSidebar>
        //     sidebar
        //     <Button variant='contained' onClick={() => { setCount(count + 1) }}>
        //         {count} clicks
        //     </Button>
        // </StyledSidebar>} */}
        //     <StyledColumn vertical={terminalVertical}>
        // <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} />
        // {showTerminal && <div>
        //     <Terminal onInput={(input) => {
        //         console.log(input)

        //         //todo:
        //         // -look for 'python'
        //         // -respond to unrecognized commands  
        //         // -switch to an 'input' mode when text input is required
        //         // 'python filename.py'

        //         }} theme={theme.palette.type} username={'isaiahkahler'} />
        // </div>}
        //     </StyledColumn>
        // </StyledEnvironment>
    );
}