import fs from 'fs'; 
import path from 'path';

export const checkFilesInDirectory = (dirPath, fileName) => {
    fs.access(path.join(dirPath, fileName), fs.constants.F_OK, (err) => {
        if (err) { 
            console.log(`${fileName} does not exist in the directory.`);
        } else { 
            console.log(`${fileName} exists in the directory.`);
        } 
    });
};
