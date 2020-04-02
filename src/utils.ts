import { FILE_TYPES, DEFAULT_FILE_TYPE } from './constants';

export const getLastItem = (items: any[]): any => items[items.length - 1];

export const extractFileExtension = (fileName: string): string => {
    const matches = fileName.match(/\.([^.]*)$/);
    let extension;

    if (matches) {
        // @ts-ignore
        extension = FILE_TYPES[matches[1].toUpperCase()];
    }

    return extension || DEFAULT_FILE_TYPE;
};
