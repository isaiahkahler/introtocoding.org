import React, { useState } from 'react';
import { useTheme, makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
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


    return (
        <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.default,
            color: theme.palette.action.active
        }}>
            <div style={{ width: '100%', padding: theme.spacing(1), backgroundColor: theme.palette.primary.dark }}>
                <Typography variant='body1' component='p' style={{ fontWeight: 'bold' }} >
                    {props.fileManager.files.name}
                </Typography>
            </div>
            <div style={{ width: '100%' }}>
                <IconButton size='small' onClick={() => {


                    // LIMIT TO ONE
                    const newFile = props.fileManager.createFile('holder.file', '');
                    props.fileManager.addItem(newFile, selectedFolder);
                }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,15V12H9V15H6V17H9V20H11V17H14V15H11Z" />
                    </svg>
                </IconButton>
                <IconButton size='small' onClick={() => {

                    const newFile = props.fileManager.createFile('holder.folder', '');
                    props.fileManager.addItem(newFile, selectedFolder);
                }}>
                    <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                        <path fill="currentColor" d="M10,4L12,6H20A2,2 0 0,1 22,8V18A2,2 0 0,1 20,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10M15,9V12H12V14H15V17H17V14H20V12H17V9H15Z" />
                    </svg>
                </IconButton>
            </div>
            <ListItem folder={props.fileManager.files} setSelectedFolder={setSelectedFolder} fileManager={props.fileManager} />
        </div>
    );
}


interface ListItemProps {
    folder: Folder,
    fileManager: FileManager,
    setSelectedFolder: (id: string) => void,
}

function ListItem(props: ListItemProps) {

    const theme = useTheme();

    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (name: string, oldID: string, type: string) => {
        let newItem;

        if(type === 'file') {
            newItem = props.fileManager.createFile(name);
        } else {
            newItem = props.fileManager.createFolder(name);
        }
        props.fileManager.replaceItem(newItem, oldID);
        setInputValue('');

    }

    const handleBlur = (id: string) => {
        setInputValue('');
        props.fileManager.deleteItem(id);
    }

    return (
        <div>
            {props.folder.content.map((item, index) => {
                if (item.type === 'file') {
                    if (item.baseName !== 'holder') {
                        return (
                            <MenuItem style={{ paddingLeft: theme.spacing(1) }} key={index}>
                                {item.extension === 'py' ? <svg style={{ width: '1.25rem', height: '1.25rem', padding: theme.spacing(1) }} viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19.14,7.5A2.86,2.86 0 0,1 22,10.36V14.14A2.86,2.86 0 0,1 19.14,17H12C12,17.39 12.32,17.96 12.71,17.96H17V19.64A2.86,2.86 0 0,1 14.14,22.5H9.86A2.86,2.86 0 0,1 7,19.64V15.89C7,14.31 8.28,13.04 9.86,13.04H15.11C16.69,13.04 17.96,11.76 17.96,10.18V7.5H19.14M14.86,19.29C14.46,19.29 14.14,19.59 14.14,20.18C14.14,20.77 14.46,20.89 14.86,20.89A0.71,0.71 0 0,0 15.57,20.18C15.57,19.59 15.25,19.29 14.86,19.29M4.86,17.5C3.28,17.5 2,16.22 2,14.64V10.86C2,9.28 3.28,8 4.86,8H12C12,7.61 11.68,7.04 11.29,7.04H7V5.36C7,3.78 8.28,2.5 9.86,2.5H14.14C15.72,2.5 17,3.78 17,5.36V9.11C17,10.69 15.72,11.96 14.14,11.96H8.89C7.31,11.96 6.04,13.24 6.04,14.82V17.5H4.86M9.14,5.71C9.54,5.71 9.86,5.41 9.86,4.82C9.86,4.23 9.54,4.11 9.14,4.11C8.75,4.11 8.43,4.23 8.43,4.82C8.43,5.41 8.75,5.71 9.14,5.71Z" />
                                </svg> : <InsertDriveFileIcon fontSize='small' style={{ padding: theme.spacing(1) }} />}
                                <Typography variant='body1' component='p'>
                                    {item.name}
                                </Typography>
                            </MenuItem>
                        );
                    } else {
                        //is a holder
                        return (
                            <MenuItem style={{ paddingLeft: theme.spacing(1) }} key={index}>
                                <form noValidate autoComplete='off' onSubmit={event => {
                                    event.preventDefault();
                                    handleSubmit(inputValue, item.id, item.extension);
                                }} onBlur={() => handleBlur(item.id)}>
                                    <TextField value={inputValue} onChange={event => {
                                        setInputValue(event.target.value);
                                    }} onSubmit={event => event.preventDefault()} autoFocus label={`${item.extension} name`} />
                                </form>
                            </MenuItem>
                        );
                    }
                } else {
                    return (
                        <DisplayFolder folder={item} setSelectedFolder={props.setSelectedFolder} fileManager={props.fileManager} />
                    );
                }
            })}
        </div>
    );
}

interface DisplayFolderProps {
    folder: Folder,
    fileManager: FileManager,
    setSelectedFolder: (id: string) => void,
}

function DisplayFolder(props: DisplayFolderProps) {

    const [expanded, setExpanded] = useState(false);
    const theme = useTheme();

    return (
        <>
            <MenuItem style={{ paddingLeft: theme.spacing(1) }} onClick={() => {
                setExpanded(prev => !prev);
                props.setSelectedFolder(props.folder.id);
            }} >
                <ExpandMoreIcon fontSize='small' style={{ padding: theme.spacing(1), transition: '200ms', transform: expanded ? 'rotate(-0.25turn)' : '' }} />
                <Typography variant='body1' component='p'>
                    {props.folder.name}
                </Typography>
            </MenuItem>
            {expanded && <div style={{ paddingLeft: theme.spacing(2) }}><ListItem folder={props.folder} setSelectedFolder={props.setSelectedFolder} fileManager={props.fileManager} /></div>}
        </>
    );
}