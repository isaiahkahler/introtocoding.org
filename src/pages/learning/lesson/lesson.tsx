import React, { useEffect, useState, useMemo, useRef } from 'react';
import Page from '../../../components/page';
import Editor from '@monaco-editor/react';
import { Button } from '@material-ui/core';
import Environment from '../../../components/environment';

function LessonContainer(props: {}) {
   
    return (
        <Page title='Learning!' noSpacer>
            <Environment />
        </Page>
    );
}

export default LessonContainer;