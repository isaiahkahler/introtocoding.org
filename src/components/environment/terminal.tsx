import React, { useEffect, useState } from 'react';
import {Terminal as XTerminal} from 'xterm';
import '../../../node_modules/xterm/css/xterm.css';



interface TerminalProps {
    onInput: (input: string) => void,
    theme: 'light' | 'dark'
}

const xTermID = 'x-terminal';

export default function Terminal(props: TerminalProps) {

    const [xTerm, setXTerm] = useState<XTerminal>();

    //set xTerm object
    useEffect(() => {
        if(!xTerm){
            setXTerm(new XTerminal({
                fontFamily: 'Courier New',
                // theme: props.theme === 'light'? {background: '#fff', foreground: '#000', selection: 'rgba(0,0,255,0.25)'} : {},
            }));
            console.log('set terminal object')
        }
    }, []);

    //start xTerm object
    useEffect(() => {
        if(xTerm){
            const el = document.getElementById(xTermID);
            el && xTerm.open(el);
            console.log('opened terminal')
            xTerm.onData((input) => {
                // xTerm.write(input);
                // props.onInput(input);
            });

            const prompt = () => {
                xTerm.write('\r\n> ');
            };


            xTerm.onKey((e: { key: string, domEvent: KeyboardEvent }) => {
                const ev = e.domEvent;
                const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;
            
                if (ev.keyCode === 13) {
                    prompt();
                } else if (ev.keyCode === 8) {
                 // Do not delete the prompt
                //   if (xTerm._core.buffer.x > 2) {
                    xTerm.write('\b \b');
                //   }
                } else if (printable) {
                  xTerm.write(e.key);
                }
              });

        }

        return(() => {
            xTerm && xTerm.dispose();
        });
    }, [xTerm]);

    return(
        <div id={xTermID}>
        </div>
    );
}