console.log('starting ...');
process.title = 'Safari Icon Fix';
import psList from 'ps-list';
import fs from 'fs';
import path from 'path';

const NOIR_PATH = '/Applications/Noir.app/Contents/PlugIns/Mac Extension.appex/Contents/Resources';
const NOIR_FILES = ['toolbar-icon-16.pdf', 'toolbar-icon-paused-16.pdf', 'toolbar-icon-stop-16.pdf'];

const isSafariRunning = async () =>
  Boolean((await psList()).find(({ cmd: name }) => name && name.includes('/Safari.app/Contents/MacOS/Safari')));

const patchIcon = (source = 'fixed') =>
  NOIR_FILES.forEach((file) =>
    fs.cpSync(path.join('./', 'assets', source, file), `${NOIR_PATH}/${file}`, { force: true })
  );

const restoreIcon = () => patchIcon('originals');

let isLocked = false;
let isCleared = false;
let patchTimeout = null;

const app = async () => {
  const isSafari = await isSafariRunning();
  if (isSafari && !isLocked) {
    isLocked = true;
    isCleared = false;
    console.log('Will inject fixed icon soon ...');
    patchTimeout = setTimeout(async () => {
      if (await isSafariRunning()) patchIcon();
      console.log('Done !');
    }, 30000);
  } else if (!isSafari && !isCleared) {
    restoreIcon();
    isCleared = true;
    isLocked = false;
    if (patchTimeout) clearTimeout(patchTimeout);
    patchTimeout = null;
  }

  setTimeout(() => app(), 2000);
};

app();

console.log('started !');
