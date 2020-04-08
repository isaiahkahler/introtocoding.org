import { useState } from "react";
import uid from 'uid';

export interface File {
    name: string,
    baseName: string,
    extension: string,
    type: 'file',
    content: string,
    id: string,
}

export interface Folder {
    name: string,
    type: 'folder',
    content: Array<File | Folder>,
    id: string,
}

export interface FileManager {
    files: Folder,
    createFile: (name: string, content?: string) => File,
    createFolder: (name: string, content?: Array<File | Folder>) => Folder,
    findFromID: (id: string) => File | Folder | undefined,
    addItem: (file: File, folderID: string) => void,
    deleteItem: (id: string) => void,
    renameItem: (name: string, id: string) => void,
    moveItem: (id: string, targetID: string) => void,
    updateItem: (item: File | Folder) => void,
    replaceItem: (item: File | Folder, targetID: string) => void,
    print: (item?: File | Folder) => void,
    toString: (item?: File | Folder) => string,
    _forEachRecursive: (folder: Folder, action: (item: File | Folder, parentItem?: Folder) => void) => void,
}


export default function useFileSystem(name: string, defaultFile?: File) {

    const [fileSystem, setFileSystem] = useState<Folder>({
        name: name,
        type: 'folder',
        id: uid(),
        content: defaultFile ? [defaultFile] : [],
    });



    const files: FileManager = {
        files: fileSystem,
        findFromID: (id: string) => {
            files._forEachRecursive(fileSystem, (item) => {
                if(item.id === id) {
                    return item;
                }
            });
            return undefined;
        },
        /** creates a file object from data */
        createFile: (name: string, content?: string): File => {
            return {
                name: name,
                baseName: name.includes('.') ? name.substring(0, name.indexOf('.')) : name,
                extension: name.includes('.') ? name.substring(name.indexOf('.') + 1) : '',
                type: 'file',
                id: uid(),
                content: content ? content : '',
            }
        },
        createFolder: (name: string, content?: Array<File | Folder>) => {
            return {
                name: name,
                type: 'folder',
                content: content ? content : [],
                id: uid(),
            }
        },
        addItem: (item: File | Folder, folderID: string) => {
            console.log('added file')

            const insertFile = (folder: Folder, _item: File | Folder, _folderID: string) => {
                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (item) => {
                    if (item.id === _folderID) {
                        if(item.type === 'folder'){
                            item.content.push(_item);
                        }
                    }
                });
                return newFolder;
            };

            setFileSystem(prev => insertFile(prev, item, folderID));
        },
        deleteItem: (id: string) => {

            const removeItem = (folder: Folder, _id: string) => {

                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (item, parentItem) => {
                    if (item.id === _id) {
                        if (parentItem) {
                            const index = parentItem.content.findIndex(item => item.id === _id);
                            parentItem.content.splice(index, 1);
                        }
                    }
                });
                return newFolder;
            };

            setFileSystem(prev => removeItem(prev, id))
        },
        renameItem: (name: string, id: string) => {

        },
        moveItem: (id: string, targetID: string) => {

        },
        updateItem: (item: File | Folder) => {
            const changeItem = (folder: Folder, interest: File | Folder) => {
                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (_item) => {
                    if (_item.id === interest.id) {
                        if (interest.type === 'folder' && _item.type === 'folder') {
                            //is a folder
                            _item.content = interest.content;
                            _item.name = interest.name;
                        } else {
                            if (interest.type === 'file' && _item.type === 'file') {
                                _item.name = interest.name;
                                _item.extension = interest.extension;
                                _item.baseName = interest.baseName;
                                _item.content = interest.content;
                            }
                        }
                    }
                });
                return newFolder;
            };
            setFileSystem(prev => changeItem(prev, item));
        },
        replaceItem: (item: File | Folder, targetID: string, ) => {
            const subItem = (folder: Folder, _item: File | Folder, _targetID: string) => {
                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (searchItem, parentItem) => {
                    if (searchItem.id === _targetID) {
                        if (parentItem) {
                            const index = parentItem.content.findIndex(item => item.id === _targetID);
                            parentItem.content.splice(index, 1, _item);
                        }
                    }
                });
                return newFolder;
            };
            setFileSystem(prev => subItem(prev, item, targetID))
        },
        print: (item?: File | Folder) => {
            console.log(files.toString(item));
        },
        toString: (item?: File | Folder) => {

            const newItem = item ? item : fileSystem;
            let string = '';

            const stringFolder = (folder: Folder, indent?: number) => {
                //print the folder
                string += (indent ? '\n' : '') + (indent ? `${'  '.repeat(indent)}> ${folder.name}` : `> ${folder.name}`);
                //print the folder's contents
                folder.content.forEach(_item => {
                    if(_item.type === 'file') {
                        string += '\n' + (indent ? `  ${'  '.repeat(indent)}${_item.name}` : '  ' + _item.name);
                    } else {
                        stringFolder(_item, indent ? indent + 1 : 1);
                    }
                });
            };

            if (newItem.type === 'folder') {
                stringFolder(newItem);
            } else {
                string = newItem.name;
            }
            return string;
        },
        _forEachRecursive: (folder: Folder, action: (item: File | Folder, parentItem?: Folder) => void) => {
            //logic looks funky but this will go through ALL items INCLUDING the base folder.
            action(folder);
            folder.content.forEach(item => {
                if (item.type === 'folder') {
                    files._forEachRecursive(item, action);
                } else {    
                    action(item, folder);
                }
            });
        },
    }

    return (files);
}
