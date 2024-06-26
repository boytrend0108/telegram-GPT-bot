import { unlink } from 'fs/promises';

export const removeFile = async (path) => {
  try {
    await unlink(path);
  } catch (err) {
    console.log('Error while removing file', err.message);
  }
};
