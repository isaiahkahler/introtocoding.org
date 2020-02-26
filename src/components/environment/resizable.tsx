import { RefObject, useEffect, useState } from 'react';
import { useTheme } from '@material-ui/core/styles';

interface UseResizableProps {
    targetRef: RefObject<HTMLDivElement>,
    mirrorRef: RefObject<HTMLDivElement>,
    containerRef: RefObject<HTMLDivElement>,
    direction: 'horizontal' | 'vertical',
    onResize?: () => void,
}

export function useResizable(props: UseResizableProps) {

    const theme = useTheme();

    const [started, setStarted] = useState(false);

    const [grabBar, setGrabBar] = useState<HTMLDivElement>();

    useEffect(() => {
        if(grabBar){
            grabBar.style.backgroundColor = theme.palette.background.paper;
        }
    }, [theme, grabBar]);

    useEffect(() => {

        const target = props.targetRef.current;
        const mirror = props.mirrorRef.current;
        const containerElement = props.containerRef.current;
        
        if (target && mirror && containerElement && !started) {
            console.log('start resizable')
            setStarted(true);
            const grabBar = document.createElement('div');
            setGrabBar(grabBar);
            const grabIndicator = document.createElement('div');
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.height = '100%';
            target.style.display = 'flex';
            if (props.direction === 'vertical') {
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
            //assemble grab bar
            grabBar.appendChild(grabIndicator);
            
            if (props.direction === 'vertical') {

                for (let i = 0; i < target.children.length; i++) {
                    container.append(target.children[i]);
                }
                target.appendChild(container);
                target.appendChild(grabBar);
                

            } else {
                target.insertBefore(grabBar, target.childNodes[0]);
            }
            
            let initialPosition = 0;
            let initialSize = 0;
            let moving = false;
            let initialSizeMirror = 0;

            //calculate and set initial mirror element width / height 
            if(props.direction === 'vertical'){
                mirror.style.width = containerElement.getBoundingClientRect().width - target.getBoundingClientRect().width + 'px';
            } else {
                mirror.style.height = containerElement.getBoundingClientRect().height - target.getBoundingClientRect().height + 'px';
            }

            //mouse event handlers

            //when click down, record mouse position, size, and set moving
            
            const onMouseDown = (event: MouseEvent) => {
                initialPosition = props.direction === 'vertical' ? event.pageX : event.pageY;
                initialSize = props.direction === 'vertical' ? target.getBoundingClientRect().width : target.getBoundingClientRect().height;
                initialSizeMirror = props.direction === 'vertical' ? mirror.getBoundingClientRect().width : mirror.getBoundingClientRect().height;
                moving = true;
            }
            const onTouchStart = (event: TouchEvent) => {
                event.preventDefault();
                initialPosition = props.direction === 'vertical' ? event.changedTouches[0].pageX : event.changedTouches[0].pageY;
                initialSize = props.direction === 'vertical' ? target.getBoundingClientRect().width : target.getBoundingClientRect().height;
                initialSizeMirror = props.direction === 'vertical' ? mirror.getBoundingClientRect().width : mirror.getBoundingClientRect().height;
                moving = true;
            }
            grabBar.addEventListener('mousedown', onMouseDown);
            grabBar.addEventListener('touchstart', onTouchStart);



            //finish moving
            const onMouseUp = (event: MouseEvent) => {
                moving = false;
                props.onResize && props.onResize();
            }
            const onTouchEnd = (event: TouchEvent) => {
                event.preventDefault();
                moving = false;
                props.onResize && props.onResize();
            }
            document.addEventListener('mouseup', onMouseUp);
            document.addEventListener('touchend', onTouchEnd);

            //when moving, set the width / height of the element to the calculated difference 
            //also subtract the change in size to the mirror element, so the page remains the same size
            const onMouseMove = (event: MouseEvent) => {
                if (moving) {
                    if(props.direction === 'vertical') {
                        const difference = event.pageX - initialPosition;
                        target.style.width = initialSize + difference + 'px';
                        mirror.style.width = initialSizeMirror - difference + 'px';
                    } else {
                        const difference = initialPosition - event.pageY;
                        target.style.height = initialSize + difference + 'px';
                        mirror.style.height = initialSizeMirror - difference + 'px';

                    }
                }
            }
            const onTouchMove = (event: TouchEvent) => {
                event.preventDefault();
                if (moving) {
                    if(props.direction === 'vertical') {
                        let difference = event.changedTouches[0].pageX - initialPosition;
                        target.style.width = initialSize + difference + 'px';
                        mirror.style.width = initialSizeMirror - difference + 'px';
                    } else {
                        let difference = initialPosition - event.changedTouches[0].pageY;
                        target.style.height = initialSize + difference + 'px';
                        mirror.style.height = initialSizeMirror - difference + 'px';

                    }
                }
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('touchmove', (event) => onTouchMove);

            //when the window resizes, fit the mirror element to what's left
            window.addEventListener('resize', () => {
                if(props.direction === 'vertical'){
                    mirror.style.width = containerElement.getBoundingClientRect().width - target.getBoundingClientRect().width + 'px';
                } else {
                    mirror.style.height = containerElement.getBoundingClientRect().height - target.getBoundingClientRect().height + 'px';
                }
            });

            return(() => {
                grabBar.removeEventListener('mousedown', onMouseDown);
                grabBar.removeEventListener('touchstart', onTouchStart);
                document.removeEventListener('mouseup', onMouseUp);
                document.removeEventListener('touchend', onTouchEnd);
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('touchmove', onTouchMove);
            });

        }

    }, [props, started, theme.palette.background.paper, theme.palette.grey]);

    return (null);
}
