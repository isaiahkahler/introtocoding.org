import React, { RefObject, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';

export function useResizable(targetRef: RefObject<HTMLDivElement>, mirrorRef: RefObject<HTMLDivElement>, containerRef: RefObject<HTMLDivElement>, direction: 'horizontal' | 'vertical') {

    const theme = useTheme();

    useEffect(() => {
    // setTimeout( () => {
        console.log('start resizable')
        const target = targetRef.current;
        const mirror = mirrorRef.current;
        const containerElement = containerRef.current;
        if (target && mirror && containerElement) {
            const targetChildren = target.innerHTML;

            target.innerHTML = '';
            const grabBar = document.createElement('div');
            const grabIndicator = document.createElement('div');
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '100%';
            target.style.display = 'flex';
            if (direction === 'vertical') {
                mirror.style.width = '100%';
                grabBar.style.top = '0';
                grabBar.style.right = '0';
                grabBar.style.minWidth = '10px';
                grabBar.style.backgroundColor = theme.palette.background.paper;
                grabBar.style.display = 'flex';
                grabBar.style.justifyContent = 'center';
                grabBar.style.alignItems = 'center';
                grabBar.style.borderLeft = '1px solid #000';
                grabBar.style.borderRight = '1px solid #000';
                grabBar.style.cursor = 'col-resize';
                grabBar.style.userSelect = 'none';
                grabIndicator.style.height = '50px';
                grabIndicator.style.width = '5px';
                grabIndicator.style.backgroundColor = theme.palette.grey[500];
                grabIndicator.style.borderRadius = '5px';
                target.style.flexDirection = 'row';
            } else {
                // mirror.style.height = containerElement.getBoundingClientRect().height - target.getBoundingClientRect().height + 'px';
                grabBar.style.top = '0';
                grabBar.style.left = '0';
                grabBar.style.minHeight = '10px';
                grabBar.style.backgroundColor = theme.palette.background.paper;
                grabBar.style.display = 'flex';
                grabBar.style.justifyContent = 'center';
                grabBar.style.alignItems = 'center';
                grabBar.style.borderTop = '1px solid #000';
                grabBar.style.borderBottom = '1px solid #000';
                grabBar.style.cursor = 'row-resize';
                grabBar.style.userSelect = 'none';
                grabIndicator.style.height = '5px';
                grabIndicator.style.width = '50px';
                grabIndicator.style.backgroundColor = theme.palette.grey[500];
                grabIndicator.style.borderRadius = '5px';
                target.style.flexDirection = 'column';
            }

            grabBar.appendChild(grabIndicator);
            container.append(targetChildren)
            
            if (direction === 'vertical') {
                target.appendChild(container);
                target.appendChild(grabBar);
            } else {
                target.appendChild(grabBar);
                target.appendChild(container);
            }
            
            let initialPosition = 0;
            let initialSize = 0;
            let moving = false;
            let initialSizeMirror = 0;

            if(direction === 'vertical'){
                mirror.style.width = containerElement.getBoundingClientRect().width - target.getBoundingClientRect().width + 'px';
            } else {
                mirror.style.height = containerElement.getBoundingClientRect().height - target.getBoundingClientRect().height + 'px';
            }

            //mouse event handlers
            grabBar.addEventListener('mousedown', (event) => {
                initialPosition = direction === 'vertical' ? event.pageX : event.pageY;
                initialSize = direction === 'vertical' ? target.getBoundingClientRect().width : target.getBoundingClientRect().height;
                initialSizeMirror = direction === 'vertical' ? mirror.getBoundingClientRect().width : mirror.getBoundingClientRect().height;
                moving = true;
            });

            document.addEventListener('mouseup', (event) => {
                moving = false;
            });

            document.addEventListener('mousemove', (event) => {
                if (moving) {
                    if(direction === 'vertical') {
                        const difference = event.pageX - initialPosition;
                        target.style.width = initialSize + difference + 'px';
                        mirror.style.width = initialSizeMirror - difference + 'px';
                    } else {
                        const difference = initialPosition - event.pageY;
                        target.style.height = initialSize + difference + 'px';
                        mirror.style.height = initialSizeMirror - difference + 'px';

                    }
                }
            });

            window.addEventListener('resize', () => {
                if(direction === 'vertical'){
                    mirror.style.width = containerElement.getBoundingClientRect().width - target.getBoundingClientRect().width + 'px';
                } else {
                    mirror.style.height = containerElement.getBoundingClientRect().height - target.getBoundingClientRect().height + 'px';
                }
            });

        }

    }, [targetRef, mirrorRef, containerRef]);

    return (null);
}
