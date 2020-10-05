import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FolderIcon from '@material-ui/icons/Folder';
import { File, Folder, FileManager } from '../fileSystem';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

interface FileActions {
    onFileClick: (file: File) => void,

}

interface FileListProps {
    fileManager: FileManager,
    fileActions: FileActions,
}

export default function FileList(props: FileListProps) {

    const theme = useTheme();

    const [selectedFolder, setSelectedFolder] = useState(props.fileManager.files.id);

    const [mouse, setMouse] = useState<{
        x: number | null,
        y: number | null,
        item: File | Folder | null,
    }>({ x: null, y: null, item: null });

    const handleItemClick = (event: React.MouseEvent<HTMLElement>, item: File | Folder) => {
        if (item.type === 'folder') {
            setSelectedFolder(item.id);
        } else {
            //is a file
            const parentFolder = props.fileManager.findParentFromID(item.id);
            if(parentFolder) {
                setSelectedFolder(parentFolder.id);
            }
        }
    };

    const handleContextMenu = (event: React.MouseEvent<HTMLElement>, item: File | Folder) => {
        event.preventDefault();
        setMouse({
            x: event.clientX - 2,
            y: event.clientY - 4,
            item: item
        });

        if (item.type === 'folder') {
            setSelectedFolder(item.id);
        } else {
            //is a file
            const parentFolder = props.fileManager.findParentFromID(item.id);
            if(parentFolder) {
                setSelectedFolder(parentFolder.id);
            };
        }
    };

    const handleCloseContextMenu = () => {
        setMouse({
            x: null,
            y: null,
            item: null,
        });
    };

    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.action.active
        }}>
            <div style={{ width: '100%', padding: theme.spacing(1), backgroundColor: theme.palette.action.selected }}>
                <Typography variant='body1' component='p' style={{ fontWeight: 'bold' }} >
                    {props.fileManager.files.name}
                </Typography>
            </div>
            <div style={{ width: '100%' }}>
                <IconButton size='small' onClick={() => {
                    //create a placeholder folder with mode set to create
                    //causes the list item component to render appropriate text field and event handlers.
                    const newFile = props.fileManager.createFile('holder', '');
                    newFile.mode = 'create';
                    props.fileManager.addItem(newFile, selectedFolder);
                }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12,14V11H10V14H7V16H10V19H12V16H15V14M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18" />
                    </svg>
                </IconButton>
                <IconButton size='small' onClick={() => {
                    //create a placeholder file with mode set to create
                    //causes the list item component to render appropriate text field and event handlers.
                    const newFolder = props.fileManager.createFolder('holder');
                    newFolder.mode = 'create';
                    props.fileManager.addItem(newFolder, selectedFolder);
                }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M12 12H14V10H16V12H18V14H16V16H14V14H12V12M22 8V18C22 19.11 21.11 20 20 20H4C2.89 20 2 19.11 2 18V6C2 4.89 2.89 4 4 4H10L12 6H20C21.11 6 22 6.89 22 8M20 8H4V18H20V8Z" />
                    </svg>
                </IconButton>
            </div>


            <ListItem folder={props.fileManager.files} onItemClick={handleItemClick} onItemContext={handleContextMenu} fileManager={props.fileManager} />
            {/* click target for selecting base folder */}
            <div 
                style={{ width: '100%', height: '100%' }} 
                onClick={(event) => handleItemClick(event, props.fileManager.files)} 
                onContextMenu={(event) => handleContextMenu(event, props.fileManager.files)} 
            />
            <Menu
                keepMounted
                open={!!mouse.y}
                onClose={handleCloseContextMenu}
                onClick={handleCloseContextMenu}
                onContextMenu={(event) => {
                    event.preventDefault();
                    handleCloseContextMenu();
                }}
                anchorReference='anchorPosition'
                anchorPosition={mouse.y !== null && mouse.x !== null
                    ? { top: mouse.y, left: mouse.x }
                    : undefined
                }
            >
                {mouse.item && mouse.item.type === 'file' && <MenuItem>Open</MenuItem>}
                <MenuItem onClick={() => {
                    if(mouse.item){
                        props.fileManager.deleteItem(mouse.item.id);
                    }
                }}>Delete</MenuItem>
                <MenuItem 
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                        console.log('cm click')
                        if(mouse.item){
                            const newItem = mouse.item;
                            newItem.mode = 'edit';
                            props.fileManager.updateItem(newItem);
                        }
                    }}
                    onBlur={() => {console.log('cm blur')}}
                >Rename</MenuItem>
                <MenuItem onClick={() => {
                    if(mouse.item){
                        props.fileManager.cut(mouse.item.id);
                    }
                }}>Cut</MenuItem>
                <MenuItem onClick={() => {
                    if(mouse.item){
                        props.fileManager.copy(mouse.item.id);
                    }
                }}>Copy</MenuItem>
                <MenuItem onClick={() => {
                    if(mouse.item){
                        props.fileManager.paste(selectedFolder);
                    }
                }}>Paste</MenuItem>
                <MenuItem onClick={() => {console.log(props.fileManager.files)}}>print</MenuItem>
            </Menu>
        </div>
    );
}


interface ListItemProps {
    folder: Folder,
    fileManager: FileManager,
    // selectFolder: (id: string) => void,
    onItemClick: (event: React.MouseEvent<HTMLElement>, item: File | Folder) => void,
    onItemContext: (event: React.MouseEvent<HTMLElement>, item: File | Folder) => void,
}

function ListItem(props: ListItemProps) {

    const theme = useTheme();

    const [inputValue, setInputValue] = useState('');

    const handleFocus = (item: File | Folder) => {
        console.log('focus')
        if('mode' in item){
            if(item.mode === 'edit'){
                console.log('focus edit')
                setInputValue(item.name);
            } else {
                //if create mode
            }
        }
    }

    const handleSubmit = (item: File | Folder) => {
        console.log('submit')
        //code review: else error
        if ('mode' in item) {
            if (item.mode === 'create') {
                let newItem;
                if (item.type === 'file') {
                    newItem = props.fileManager.createFile(inputValue);
                } else {
                    newItem = props.fileManager.createFolder(inputValue);
                }
                props.fileManager.replaceItem(newItem, item.id);
            } else {
                //edit mode
                props.fileManager.renameItem(inputValue, item.id);
            }
        }
        setInputValue('');

    }

    const handleBlur = (item: File | Folder) => {
        console.log('blur')
        if('mode' in item) {
            if(item.mode === 'create'){
                console.log('blur create')
                props.fileManager.deleteItem(item.id);
            } else {
                //edit mode
                console.log('blur edit')
                //remove mode property
                const newItem = {...item};
                delete newItem.mode;
                props.fileManager.updateItem(newItem);
            }
        }
        setInputValue('');
    }

    return (
        <div>
            {props.folder.content.map((item, index) => {
                if ('mode' in item) {
                    //is a holder
                    return (
                        <MenuItem 
                            style={{ paddingLeft: theme.spacing(1) }} 
                            key={index}
                        >
                            <form 
                                noValidate 
                                autoComplete='off' 
                                onSubmit={event => {
                                    event.preventDefault();
                                    handleSubmit(item);
                                }}
                            >
                                <TextField 
                                    autoFocus
                                    label={`${item.type} name`} 
                                    value={inputValue} 
                                    onFocus={(event) => handleFocus(item)}
                                    onChange={event => setInputValue(event.target.value)} 
                                    onSubmit={event => event.preventDefault()} 
                                    onBlur={() => handleBlur(item)} 
                                />
                            </form>
                        </MenuItem>
                    );
                } else if (item.type === 'file') {
                    //is a file
                    return (
                        <MenuItem style={{ paddingLeft: theme.spacing(1) }} key={index} onClick={(event) => {
                            props.onItemClick(event, item);
                        }} onContextMenu={event => props.onItemContext(event, item)}>
                            {item.extension === 'py' ? <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                                <path fill="currentColor" d="M19.14,7.5A2.86,2.86 0 0,1 22,10.36V14.14A2.86,2.86 0 0,1 19.14,17H12C12,17.39 12.32,17.96 12.71,17.96H17V19.64A2.86,2.86 0 0,1 14.14,22.5H9.86A2.86,2.86 0 0,1 7,19.64V15.89C7,14.31 8.28,13.04 9.86,13.04H15.11C16.69,13.04 17.96,11.76 17.96,10.18V7.5H19.14M14.86,19.29C14.46,19.29 14.14,19.59 14.14,20.18C14.14,20.77 14.46,20.89 14.86,20.89A0.71,0.71 0 0,0 15.57,20.18C15.57,19.59 15.25,19.29 14.86,19.29M4.86,17.5C3.28,17.5 2,16.22 2,14.64V10.86C2,9.28 3.28,8 4.86,8H12C12,7.61 11.68,7.04 11.29,7.04H7V5.36C7,3.78 8.28,2.5 9.86,2.5H14.14C15.72,2.5 17,3.78 17,5.36V9.11C17,10.69 15.72,11.96 14.14,11.96H8.89C7.31,11.96 6.04,13.24 6.04,14.82V17.5H4.86M9.14,5.71C9.54,5.71 9.86,5.41 9.86,4.82C9.86,4.23 9.54,4.11 9.14,4.11C8.75,4.11 8.43,4.23 8.43,4.82C8.43,5.41 8.75,5.71 9.14,5.71Z" />
                            </svg> : <InsertDriveFileIcon fontSize='small' style={{ padding: theme.spacing(1) }} />}
                            <Typography variant='body1' component='p'>
                                {item.name}
                            </Typography>
                        </MenuItem>
                    );
                } else {
                    //is a folder
                    return (
                        <DisplayFolder key={index} folder={item} onItemClick={props.onItemClick} onItemContext={props.onItemContext} fileManager={props.fileManager} />
                    );
                }
            })}
        </div>
    );
}

interface DisplayFolderProps {
    folder: Folder,
    fileManager: FileManager,
    onItemClick: (event: React.MouseEvent<HTMLElement>, item: File | Folder) => void,
    onItemContext: (event: React.MouseEvent<HTMLElement>, item: File | Folder) => void,
}

function DisplayFolder(props: DisplayFolderProps) {

    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    return (
        <>
            <MenuItem style={{ paddingLeft: theme.spacing(1) }} onClick={(event) => {
                setExpanded(prev => !prev);
                props.onItemClick(event, props.folder);
            }} onContextMenu={event => props.onItemContext(event, props.folder)}>
                <ExpandMoreIcon fontSize='small' style={{ padding: theme.spacing(1), transition: '200ms', transform: expanded ? 'rotate(0turn)' : 'rotate(-0.25turn)' }} />
                <Typography variant='body1' component='p'>
                    {props.folder.name}
                </Typography>
            </MenuItem>
            {expanded && <div style={{ paddingLeft: theme.spacing(2) }}><ListItem folder={props.folder} onItemClick={props.onItemClick} fileManager={props.fileManager} onItemContext={props.onItemContext} /></div>}
        </>
    );
}
