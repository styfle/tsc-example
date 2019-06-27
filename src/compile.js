const ts = require('typescript');

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
console.log('configFileName ', configFileName);
const { config } = ts.readConfigFile(configFileName, ts.sys.readFile);
const { options } = ts.parseJsonConfigFileContent(
  config,
  parseConfigHost,
  workpath
);
const program = ts.createProgram([entrypoint], options);
const emitResult = program.emit();

const diagnostics = ts
  .getPreEmitDiagnostics(program)
  .concat(emitResult.diagnostics);

diagnostics.forEach(d => {
  if (d.file) {
    const { line, character } = d.file.getLineAndCharacterOfPosition(d.start);
    const message = ts.flattenDiagnosticMessageText(d.messageText, '\n');
    console.log(
      `${d.file.fileName} (${line + 1},${character + 1}): ${message}`
    );
  } else {
    console.log(`${ts.flattenDiagnosticMessageText(d.messageText, '\n')}`);
  }
});

console.log(emitResult.emitSkipped ? 'failed' : 'success');
