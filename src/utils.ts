import path from 'path';
// @ts-ignore
import { version as pjsonVersion, name as pjsonName } from '../package.json';
import { FILE_TYPES, DEFAULT_FILE_TYPE } from './constants';
import { Attribute } from './models';

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

export const getAgentInfo = () => ({
    version: pjsonVersion,
    name: pjsonName,
});

export const getSystemAttributes = (): Array<Attribute> => ([{
    key: 'agent',
    value: `${pjsonName}|${pjsonVersion}`,
    system: true,
}]);

export const buildCodeRef = (testPath: string, itemName: string = ''): string => {
    const workingDir = process.cwd();

    const codeRef = testPath
        .replace(`${workingDir}${path.sep}`, '')
        .replace(/\\/g, '/');

    return itemName ? `${codeRef}/${itemName}` : codeRef;
};
