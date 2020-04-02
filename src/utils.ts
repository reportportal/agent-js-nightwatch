import { FILE_TYPES, DEFAULT_FILE_TYPE } from './constants';

export const getLastItem = (items: any[]): any => items[items.length - 1];

export const getFileType = (fileName: string): string => {
    const matches = fileName.match(/\.([^.]*)$/);
    let type;

    if (matches) {
        // @ts-ignore
        type = FILE_TYPES[matches[1].toUpperCase()];
    }

    return type || DEFAULT_FILE_TYPE;
};
