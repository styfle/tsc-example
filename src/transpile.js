const ts = require('typescript');
const { readFileSync, writeFileSync, readdirSync, statSync } = require('fs');
const { join, relative } = require('path');

const entrypoint = '/Users/styfle/Code/js/packagephobia/src/server.ts';
const workpath = '/Users/styfle/Code/js/packagephobia';

const parseConfigHost = {
  fileExists: ts.sys.fileExists,
  readFile: ts.sys.readFile,
  readDirectory: ts.sys.readDirectory,
  useCaseSensitiveFileNames: true
};

const configFileName = ts.findConfigFile(
  workpath,
  ts.sys.fileExists,
  'tsconfig.json'
);
const { config } = ts.readConfigFile(configFileName, ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(
  config,
  parseConfigHost,
  workpath
);

function walkSync(dir, filelist = []) {
  const files = readdirSync(dir);
  files.forEach(file => {
    const fullpath = join(dir, file);
    const stat = statSync(fullpath);
    if (stat.isDirectory()) {
      if (!file === 'node_modules') filelist = walkSync(fullpath, filelist);
    } else {
      filelist.push(file);
    }
  });
  return filelist;
}

const files = walkSync(workpath);

files.forEach(file => {
  const originalfile = join(workpath, file);
  console.log(originalfile);
  if (!originalfile.endsWith('.ts')) return;
  const source = readFileSync(originalfile, 'utf8');
  const result = ts.transpileModule(source, { compilerOptions: options });
  const relativefile = relative(workpath, file);
  const outputfile = join(__dirname, 'dist', relativefile);
  writeFileSync(outputfile, result.outputText);
});
