import { useState } from "react";
import uid from 'uid';

interface FileBase {
    name: string,
    id: string,
    type: 'file' | 'folder',
    mode?: 'edit' | 'create'
}

export interface File extends FileBase {
    name: string,
    baseName: string,
    extension: string,
    type: 'file',
    content: string,
    id: string,
}

export interface Folder extends FileBase {
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
    findParentFromID: (id: string) => Folder | undefined,
    addItem: (item: File | Folder, folderID: string) => void,
    deleteItem: (id: string) => void,
    renameItem: (name: string, id: string) => void,
    moveItem: (id: string, targetID: string) => void,
    updateItem: (item: File | Folder) => void,
    replaceItem: (item: File | Folder, targetID: string) => void,
    print: (item?: File | Folder) => void,
    toString: (item?: File | Folder) => string,
    sendToClipboard: (item: File | Folder) => void,
    getFromClipboard: () => File | Folder | undefined, 
    copy: (id: string) => void,
    cut: (id: string) => void,
    paste: (targetID: string) => void,
    _forEachRecursive: (folder: Folder, action: (item: File | Folder, parentItem?: Folder) => void, parentItem?: Folder) => void,
}


export default function useFileSystem(name: string, defaultFile?: File) {

    const [fileSystem, setFileSystem] = useState<Folder>({
        name: name,
        type: 'folder',
        id: uid(),
        content: defaultFile ? [defaultFile] : [],
    });

    const [clipboard, setClipboard] = useState<File | Folder | null>();



    const files: FileManager = {
        files: fileSystem,
        findFromID: (id: string) => {
            let found = undefined;
            files._forEachRecursive(fileSystem, (item) => {
                if (item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        findParentFromID: (id: string) => {

            if(fileSystem.id === id) return fileSystem;
            let found = undefined;
            files._forEachRecursive(fileSystem, (item, parentItem) => {
                if(item.id === id && parentItem){
                    found = parentItem;
                }
            });

            return found;
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
            const insertFile = (folder: Folder, _item: File | Folder, _folderID: string) => {
                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (item) => {
                    if (item.id === _folderID) {
                        if (item.type === 'folder') {
                            item.content.push(_item);
                        } else {
                            console.error('could not add item to filesystem. target ID is not a folder.')
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
        /** sets the name of item with matching id to given and removes any mode property. */
        renameItem: (name: string, id: string) => {
            const refactor = (folder: Folder, _name: string, _id: string) => {
                const newFolder = { ...folder };
                files._forEachRecursive(newFolder, (item) => {
                    if (item.id === _id) {
                        item.name = _name;
                        if (item.type === 'file') {
                            item.baseName = name.includes('.') ? name.substring(0, name.indexOf('.')) : name;
                            item.extension = name.includes('.') ? name.substring(name.indexOf('.') + 1) : '';
                        }
                        if ('mode' in item) {
                            delete item.mode;
                        }
                    }
                });
                return newFolder;
            }
            setFileSystem(prev => refactor(prev, name, id));
        },
        moveItem: (id: string, targetID: string) => {
            //code review: implementation?? never tested
            const item = files.findFromID(id);
            if(item){
                const newItem = {...item};
                files.deleteItem(id);
                files.addItem(newItem, targetID);
            } else {
                console.error('failed to delete item.')
            }
        },
        /** updates all item values with same ID. does not update items to a different type. */
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
                        if ('mode' in interest) {
                            //if mode in interest, add to original
                            _item.mode = interest.mode;
                        } else {
                            //remove mode from original if not in interest
                            if ('mode' in _item) {
                                delete _item.mode;
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
                    if (_item.type === 'file') {
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
        sendToClipboard: (item: File | Folder) => {
            setClipboard(item);
        },
        getFromClipboard: () => {
            if(clipboard){
                return clipboard;
            } else {
                return undefined;
            }
        }, 
        copy: (id: string) => {
            const item = files.findFromID(id);
            if(item){
                const newItem = {...item};
                setClipboard(newItem);
            } else {
                console.error('could not copy. file does not exist.')
            }
        },
        cut: (id: string) => {
            files.copy(id);
            files.deleteItem(id);
        },
        paste: (targetID: string) => {
            // copy object and assign new IDs to all items
            if(clipboard){
                const newClipboard = {...clipboard};
                newClipboard.id = uid();
                if(newClipboard.type === 'folder'){
                    files._forEachRecursive(newClipboard, (item) => {
                        item.id = uid();
                    });
                }
                files.addItem(newClipboard, targetID);
            } else {
                console.error('could not paste. nothing in clipboard.')
            }
        },
        _forEachRecursive: (folder: Folder, action: (item: File | Folder, parentItem?: Folder) => void, parent?: Folder) => {
            //logic looks funky but this will go through ALL items INCLUDING the base folder.
            parent ? action(folder, parent) : action(folder);
            folder.content.forEach(item => {
                if (item.type === 'folder') {
                    files._forEachRecursive(item, action, folder);
                } else {
                    action(item, folder);
                }
            });
        },
    }

    return (files);
}
