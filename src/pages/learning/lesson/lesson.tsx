import React, { useEffect, useState, useMemo } from 'react';
import Page from '../../../components/page';
import Editor from '@monaco-editor/react';


function LessonContainer(props: {}) {
   
    return (
        <Page title='Learning!'>
            <Editor language='python' height='500px' />
        </Page>
    );
}

export default LessonContainer;