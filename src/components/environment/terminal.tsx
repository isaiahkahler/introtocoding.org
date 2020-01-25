import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import {Terminal as XTerminal, ITheme} from 'xterm';
import '../../../node_modules/xterm/css/xterm.css';
import { useTheme, Button } from '@material-ui/core';



interface TerminalProps {
    onInput: (input: string) => void,
    theme: 'light' | 'dark',
    username?: string,
}

/** Div ID of the XTermJS element */
const xTermID = 'x-terminal';

const xTermLight:ITheme = {
    background: '#fff',
    foreground: '#000',
    // //@ts-ignore
    selection: 'rgba(0,0,0,0.5)',
    cursorAccent: '#eee',
    cursor: '#ccc',
};




export default function Terminal(props: TerminalProps) {

    const xTermOptions = props.theme === 'light'? {
        fontFamily: 'Roboto Mono',
        theme: xTermLight,
    } : {
        fontFamily: 'Roboto Mono'
    };

    const [xTerm, setXTerm] = useState<XTerminal>(new XTerminal(xTermOptions));

    const [isStarted, setIsStarted] = useState(false);

    const [command, setCommand] = useState('');

    const promptText = props.username ? `${props.username}:~$ ` : 'guest user:~$ ';

    const commandRef = useRef(command);

    useLayoutEffect(() => {
        commandRef.current = command;
    }, [command])

    //start xTerm object
    useEffect(() => {

        if(xTerm && !isStarted){
            const el = document.getElementById(xTermID);
            el && xTerm.open(el);
            setIsStarted(true);
            console.log('opened terminal')

            const prompt = () => {
                xTerm.write(`\r\n${promptText}`);
            };

            xTerm.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
                const ev = e.domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
                const _command = commandRef.current;
            
                // on 'enter'
                if (ev.keyCode === 13) {
                    props.onInput(_command);
                    //on enter, clear the current command
                    setCommand('');
                    prompt();
                // on 'backspace'
                } else if (ev.keyCode === 8) {
                 // Do not delete the prompt
                  if (xTerm.buffer.cursorX > promptText.length) {
                    xTerm.write('\b \b');
                    setCommand(prev => prev.slice(0, prev.length - 1));
                  }
                // on printable character
                } else if (printable) {
                  xTerm.write(e.key);
                  setCommand(prev => prev + e.key);
                }
              });

              prompt();

        }

        return(() => {
            xTerm && xTerm.dispose();
        });
    }, []);


    useEffect(() => {

        xTerm && xTerm.setOption('theme', props.theme === 'light'? xTermLight : {});

    }, [props.theme, xTerm]);

    return(
        <div id={xTermID}>
        </div>
    );
}