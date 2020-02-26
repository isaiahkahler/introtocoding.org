import React, { useRef, createRef } from 'react';
import Sidebar from './sidebar';
import Editor from './editor';
import { useSkulpt } from './skulpt';
import { styled, useTheme } from '@material-ui/core/styles';
import { ToolbarSpacer } from '../mixins';
import { useXterm } from './xterm';
import { useResizable } from './resizable';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton } from '@material-ui/core';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import SearchIcon from '@material-ui/icons/Search';
import NotesIcon from '@material-ui/icons/Notes';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import FileList from './sidebar/fileList';












interface EnvironmentProps {

}

const StyledEnvironment = styled('div')({
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
});

export default function Environment(props: EnvironmentProps) {

    const theme = useTheme();

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
    const terminalResizable = useResizable({
        targetRef: terminalContainerRef,
        mirrorRef: editorContainerRef,
        containerRef: containerRef,
        direction: 'horizontal',
        onResize: () => {
            terminal.resize();
        }
    });

    function onInput(data: string) {

        const keywords = data.split(' ').map(word => word.trim());

        if (keywords.indexOf('python') !== -1) {
            if (keywords.length === 1) {
                //start up the interpreter
                terminal.write('hey wait i havent made that feature yet')
                terminal.prompt();
            } else if (keywords.indexOf('--version') !== -1) {
                terminal.write('Python 3 (kind of...)');
                terminal.prompt();
            } else if (keywords.indexOf('run') !== -1) {
                terminal.writePlain('\n');
                const code = editorRef.current.getContent();
                runCode(code);
            }




        } else if (data === 'clear') {
            terminal.clear();
        } else {
            terminal.write(`command not found: ${data}`);
            terminal.prompt();
        }
    }

    const editorRef = useRef<any>();

    const runCode = useSkulpt((output) => {
        console.log(JSON.stringify(output))
        terminal.writePlain(output);
    });

    return (

        <StyledEnvironment>
            <ToolbarSpacer />

            <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }}>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: '72px',
                    height: '100%',
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.action.active,
                }}>
                    <IconButton>
                        <FileCopyIcon fontSize='large' />
                    </IconButton>
                    <IconButton>
                        <SearchIcon fontSize='large' />
                    </IconButton>
                    <IconButton>
                        <NotesIcon fontSize='large' />
                    </IconButton>
                    <IconButton>
                        <CheckBoxIcon fontSize='large' />
                    </IconButton>
                    <IconButton onClick={() => {
                        if (terminalResizable.visible) {
                            terminalResizable.close();
                        } else {
                            terminalResizable.open();
                        }
                    }}>
                        <svg style={{ width: '1.5em', height: '1.5em' }} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M20,19V7H4V19H20M20,3A2,2 0 0,1 22,5V19A2,2 0 0,1 20,21H4A2,2 0 0,1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z" />
                        </svg>
                    </IconButton>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexGrow: 1 }} ref={containerRef}>

                </div>

                <div ref={sidebarRef} style={{ width: '250px' }}>
                    <FileList files={{
                        name: 'h', 
                        type: 'folder', 
                        content: [{
                            name: 'something.py', 
                            type: 'file', 
                            content: 'fjdks'
                            }, {
                            name: 'unit whatever', 
                            type: 'folder', 
                            content: [{
                                name: 'something2.py', 
                                type: 'file', 
                                content: 'fjdks'
                            }, {
                                name: 'something3.py', 
                                type: 'file', 
                                content: 'fjdks'
                            }]},{
                                name: "weebo",
                                type: 'folder',
                                content: [{
                                    name: 'file.txt',
                                    type: 'file',
                                    content: 'fjkdl'
                                },{
                                    name: 'something.other',
                                    type: 'file',
                                    content: 'fj'
                                }, {
                                    name: 'mr berts nice worms',
                                    type: 'folder',
                                    content: [{
                                        name: 'loneley.boy.py',
                                        type: 'file',
                                        content: 'fds'
                                    }]
                                }]
                            }]}} />
                </div>

                <div ref={rowContainerRef}>
                    <div ref={editorContainerRef}>
                        <Editor ref={editorRef} theme={theme.palette.type} onEditorReady={() => { }} />
                        editor
                    </div>
                    <div ref={terminalContainerRef} style={{ height: '250px', position: 'relative' }}>
                        <div ref={terminalRef} style={terminal.isReady ? { width: '100%', height: '100%' } : { width: '200px', height: '100%' }}></div>
                        <div style={{
                            position: 'absolute',
                            top: theme.spacing(2),
                            right: theme.spacing(1),
                            display: 'flex',
                            flexDirection: 'row-reverse',
                            color: theme.palette.action.active,
                            zIndex: 10,
                        }}>
                            <IconButton onClick={() => {
                                terminalResizable.close();
                            }}>
                                <CloseIcon />
                            </IconButton>
                            <IconButton>
                                <ExpandLessIcon />
                            </IconButton>
                            <IconButton>
                                <DeleteIcon />
                            </IconButton>
                        </div>
                    </div>
                </div>

            </div>

        </StyledEnvironment>
    );
}