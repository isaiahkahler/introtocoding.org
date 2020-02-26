import { useState } from "react";

export interface File {
    name: string,
    type: 'file',
    content: string
}

export interface Folder {
    name: string,
    type: 'folder',
    content: Array<File | Folder>
}

export default function useFileSystem(folderName: string, fileName: string) {

    const [fileSystem, setFileSystem] = useState<Folder>({
        name: folderName,
        type: 'folder',
        content: [{
            name: fileName,
            type: 'file',
            content: ''
        }]
    });

    const files = {
        files: fileSystem,
        addFile: (_file: File) => {
            if(fileSystem.content.find(item => item.name === _file.name) !== undefined){
                setFileSystem(prev => {return({...prev, content: [...prev.content, _file]});})
            }
        }
    }

    return(files);
}