import React, { useEffect, useState, useMemo } from 'react';
import Editor from 'react-monaco-editor';


function LessonContainer(props: {}) {

    const [code, setCode] = useState('');
   
    return (
        <div>

            <p>lesson tingz</p>
            <div style={{height: '100vh', width: '100vw', display: 'flex', }}>

            <Editor language='python' theme='vs-dark' value={code} onChange={(e) => setCode(e)}/>
            </div>
            {/* <iframe src="https://repl.it/repls/EssentialBuzzingMarketing?lite=true" scrolling="no" frameBorder='no' allowTransparency allowFullScreen sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe> */}

            {/* <h3>Try This</h3>
            <textarea id="yourcode" cols={40} rows={10} value={program} onChange={(event) => setProgram(event.target.value)}>
            </textarea><br />
            <button type="button" onClick={() => {
                console.log('sent', program)
                if(!!pyodideWorker){
                    pyodideWorker.postMessage({
                        python: program
                    })
                }
            }}>Run</button>
            <p>{output}</p> */}
        </div>
    );
}

export default LessonContainer;