import React, { PropsWithChildren, useEffect, useState } from 'react';

import { styled, useTheme } from '@material-ui/core/styles';

interface ResizableProps {
    horizontal?: boolean,
    initialWidth?: string,
    maxWidth?: string,
    closeWidth?: string,
    onClose?: () => void,
}

const StyledContent = styled('div')({
    width: '100%',
    height: '100%'
});


export default function Resizable(props: PropsWithChildren<ResizableProps>) {

    const theme = useTheme();

    const id = useState(Math.round(Math.random() * 1000))[0].toString();

    const colID = `col-${id}`

    const [grabber, setGrabber] = useState<HTMLElement | null>(null);

    const [container, setContainer] = useState<HTMLElement | null>(null);


    useEffect(() => {

        setGrabber(document.getElementById(id));

        setContainer(document.getElementById(colID));

    }, []);

    useEffect(() => {
        
        let _container: HTMLElement | null;
        let initialPosition: number;
        let initialSize: number | null;

        grabber && grabber.addEventListener('mousedown', (e) => {
            initialPosition = props.horizontal ? e.pageY : e.pageX;
            _container = container;
            initialSize = container && (props.horizontal ? container.getBoundingClientRect().height : container.getBoundingClientRect().width);
        });

        document.addEventListener('mouseup', () => {
            _container = null;
        });

        document.addEventListener('mousemove', (e) => {
            if (_container && initialSize) {
                props.horizontal ? _container.style.height = `${initialSize - (e.pageY - initialPosition)}px` : _container.style.width = `${initialSize + (e.pageX - initialPosition)}px`
            }
        });

    }, [grabber]);

    return (
        <div id={colID} style={{display: 'flex', flexDirection: props.horizontal ? 'column' : 'row' }}>
            {!props.horizontal && <StyledContent>
                {props.children}
            </StyledContent>}

            {/* grab bar */}
            <div id={id} style={props.horizontal ? {
                top: 0,
                left: 0,
                height: '10px',
                backgroundColor: theme.palette.background.paper,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px solid #000',
                cursor: 'row-resize',
                userSelect: 'none'
            } : {
                    top: 0,
                    right: 0,
                    width: '10px',
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    border: '1px solid #000',
                    cursor: 'col-resize',
                    userSelect: 'none'
                }}>
                    {/* grab indicator */}
                <div style={props.horizontal ? {
                    height: '5px',
                    width: '25px',
                    backgroundColor: theme.palette.grey[500],
                    borderRadius: '5px',
                } : {
                        height: '25px',
                        width: '5px',
                        backgroundColor: theme.palette.grey[500],
                        borderRadius: '5px',
                    }} />
            </div>
            {props.horizontal && <StyledContent>
                {props.children}
            </StyledContent>}
        </div>
    );
}