import React, { useState } from 'react';
import Sidebar from './sidebar';
import Terminal from './terminal';
import Editor from './editor';

import Grid from '@material-ui/core/Grid';

interface EnvironmentProps {

}

export default function Environment(props: EnvironmentProps) {

    const [showSidebar, setShowSidebar] = useState(true);

    const [showTerminal, setShowTerminal] = useState(true);

    return(
        <div>
            <Grid container>
                <Grid item>
                    <Sidebar />
                </Grid>
                <Grid container item>
                    <Grid item>
                        <Editor />
                        <Terminal />
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}