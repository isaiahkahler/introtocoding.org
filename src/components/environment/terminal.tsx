import React, { useEffect, useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Terminal as XTerminal, ITheme } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useTheme } from '@material-ui/core/styles';

/** Div ID of the XTermJS element */
const xTermID = 'x-terminal';

const xTermLight: ITheme = {
    background: '#fff',
    foreground: '#000',
    // //@ts-ignore
    selection: 'rgba(0,0,0,0.5)',
    cursorAccent: '#eee',
    cursor: '#ccc',
};

const lightTheme = {
    fontFamily: '"Roboto Mono", monospace',
    theme: xTermLight,
};

const darkTheme = {
    fontFamily: '"Roboto Mono", monospace'
};


interface TerminalProps {
    onInput: (input: string) => void,
    theme: 'light' | 'dark',
    username?: string,
    resizing: boolean,
}

export default function Terminal(props: TerminalProps) {

    const xTermOptions = props.theme === 'light' ? lightTheme : darkTheme;

    const xTerm = useMemo(() => new XTerminal(xTermOptions), [xTermOptions]);

    const fitAddon = useMemo(() => new FitAddon(), []);

    const [isStarted, setIsStarted] = useState(false);

    const [command, setCommand] = useState('');

    const promptText = props.username ? `${props.username}:~$ ` : 'guest user:~$ ';

    const commandRef = useRef(command);

    const [resizing, setResizing] = useState(props.resizing);

    useLayoutEffect(() => {
        commandRef.current = command;
    }, [command]);

    //start xTerm object
    useEffect(() => {

        if (xTerm && !isStarted) {

            xTerm.loadAddon(fitAddon);
            const el = document.getElementById(xTermID);
            el && xTerm.open(el);
            fitAddon.fit();

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

        return (() => {
            xTerm && xTerm.dispose();
        });
    }, [xTerm]);

    // useEffect(() => {
    //     const unsubscribe = xTerm.onKey(e => {

    //         const prompt = () => {
    //             xTerm.write(`\r\n${promptText}`);
    //         };

    //         const ev = e.domEvent;
    //         const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
    //         const _command = commandRef.current;

    //         // on 'enter'
    //         if (ev.keyCode === 13) {
    //             props.onInput(_command);
    //             //on enter, clear the current command
    //             setCommand('');
    //             prompt();
    //         // on 'backspace'
    //         } else if (ev.keyCode === 8) {
    //          // Do not delete the prompt
    //           if (xTerm.buffer.cursorX > promptText.length) {
    //             xTerm.write('\b \b');
    //             setCommand(prev => prev.slice(0, prev.length - 1));
    //           }
    //         // on printable character
    //         } else if (printable) {
    //           xTerm.write(e.key);
    //           setCommand(prev => prev + e.key);
    //         }
    //       });

    //     return () => {
    //         unsubscribe.dispose();
    //     }
    // }, [xTerm])


    useEffect(() => {

        xTerm && xTerm.setOption('theme', props.theme === 'light' ? xTermLight : {});

    }, [props.theme, xTerm]);

    return (
        <div id={xTermID} style={{position: false ? 'absolute' : 'relative'}}>
        </div>
    );
}