import { useState, useMemo, useEffect, useLayoutEffect, useRef, Ref, MutableRefObject, RefObject } from 'react';
import { Terminal as XTerminal, ITheme, IDisposable } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';
import { useTheme } from '@material-ui/core/styles';

const xTermLight: ITheme = {
    background: '#fff',
    foreground: '#000',
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

export function useXterm(elementRef: RefObject<HTMLDivElement>, options: { username?: string }, onInput: (command: string) => void) {

    const theme = useTheme();

    const xTermOptions = theme.palette.type === 'light' ? lightTheme : darkTheme;

    //code review: memoized value should not change if options change. 
    //if options change, xterm is updated through 
    const xTerm = useMemo(() => new XTerminal(xTermOptions), []);

    const fitAddon = useMemo(() => new FitAddon(), []);

    const [isStarted, setIsStarted] = useState(false);

    const [command, setCommand] = useState('');

    const promptText = options.username ? `${options.username}:~$ ` : 'guest user:~$ ';

    const commandRef = useRef(command);

    useLayoutEffect(() => {
        commandRef.current = command;
    }, [command]);

    useEffect(() => {

        let onKeySubscription: IDisposable;

        if (xTerm && !isStarted && elementRef.current) {
            setIsStarted(true);
            xTerm.open(elementRef.current);
            xTerm.loadAddon(fitAddon);
            fitAddon.fit();
            console.log('opened terminal!!');

            const prompt = () => {
                xTerm.write(`\r\n${promptText}`);
            };

            onKeySubscription = xTerm.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
                const ev = e.domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
                const _command = commandRef.current;

                // on 'enter'
                if (ev.keyCode === 13) {

                    onInput(_command);
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


        //code review: terminal never disposes.
        // makes infinite loop because flips isStarted

        // return (() => {
        //     if (onKeySubscription) {
        //         onKeySubscription.dispose();
        //     }
        //     setIsStarted(false);
        //     xTerm && xTerm.dispose();
        //     console.log('disposed terminal')
        // });
    }, [elementRef, fitAddon, xTerm, isStarted, onInput, promptText]);

    useEffect(() => {

        xTerm && xTerm.setOption('theme', theme.palette.type === 'light' ? xTermLight : {});

    }, [theme.palette.type, xTerm]);


    const terminal = {
        write: (data: string) => {
            xTerm.write(`\r${data}`);
        },
        resize: () => {
            if (xTerm) {
                fitAddon.fit();
            }
        },
        clear: () => {
            if(xTerm) {
                xTerm.clear();
            }
        }
    };

    return terminal;
}