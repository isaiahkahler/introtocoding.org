import React, { PropsWithChildren, useEffect, useState, useCallback } from 'react';

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

    const [initialPosition, setInitialPosition] = useState(0);

    const [initialSize, setInitialSize] = useState(0);

    const [size, setSize] = useState<React.CSSProperties>();

    const [moving, setMoving] = useState(false);


    const onMouseDown = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // console.log('mouse down')
        setInitialPosition(props.horizontal ? event.pageY : event.pageX);

        event.currentTarget.parentElement && setInitialSize(props.horizontal ? event.currentTarget.parentElement.getBoundingClientRect().height : event.currentTarget.parentElement.getBoundingClientRect().width);
        setMoving(true);
    }

    const onMouseUp = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // console.log('mouse up')
        setMoving(false);
    }

    // needs code review
    const onMouseMove = useCallback((event: MouseEvent) => {
        // console.log('mouse move')
        if(moving){
            setSize(props.horizontal ? {height: `${initialSize - (event.pageY - initialPosition)}px`} : {width: `${initialSize + (event.pageX - initialPosition)}px`});
        }
    }, [initialPosition, initialSize, moving, props.horizontal])


    //needs code review
    //
    useEffect(() => {
        // console.log('setup')
        const call = (event: MouseEvent) => {
            onMouseMove(event);
        }

        document.addEventListener('mousemove', call);
        return () => {
            document.removeEventListener('mousemove', call);
        };
    }, [onMouseMove]);

    return (
        <div style={{ ...size, display: 'flex', flexDirection: props.horizontal ? 'column' : 'row' }}>
            {!props.horizontal && <StyledContent>
                {props.children}
            </StyledContent>}

            {/* grab bar */}
            <div onMouseDown={onMouseDown} onMouseUp={onMouseUp} style={props.horizontal ? {
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