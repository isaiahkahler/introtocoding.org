import React, { useState, useRef } from 'react';
import Sidebar from './sidebar';
import Terminal from './terminal';
import Editor from './editor';
import { useSkulpt } from './skulpt';

import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Button } from '@material-ui/core';

interface EnvironmentProps {

}


const useStyles = makeStyles(theme => ({
    sidebar: {

    }
  }));

export default function Environment(props: EnvironmentProps) {

    const [showSidebar, setShowSidebar] = useState(true);

    const [showTerminal, setShowTerminal] = useState(true);

    const editorValueGetter = useRef<() => string>();

    const runCode = useSkulpt((output) => {console.log(output)});

    return(

        //implement button bar

        <Grid container>
            <Grid item md={3}>sidebar</Grid>
            <Grid item container xs>
                <Grid item xs={12}>
                    <Editor theme='dark' onEditorReady={() => {}} valueGetter={editorValueGetter} /> 
                </Grid>
                <Grid item xs={12}>
                    <Terminal />
                    {/* temporary */}
                    <Button onClick={() => {
                        !!editorValueGetter && editorValueGetter.current && runCode(editorValueGetter.current());
                    }} variant='contained'>run</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}