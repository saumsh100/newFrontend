const argv = require('yargs').argv;
const fs = require('fs');
const path = require('path');
const pb = require('pretty-bytes');

const fromFile = argv.file || argv.F;
const fromStdin = argv.stdin;

if (!fromFile && !fromStdin) {
  console.error('No source selected.');
  process.exit(1);
}

const sfd = fromStdin ?
  process.stdin :
  fs.openSync(fromFile, 'r');

const blockSize = parseInt(argv.bs, 10) || 1024 * 4;

const readFileFromFd = fd =>
  new Promise((fulfill, reject) => {
    let read = 0;
    let maxBufferSize = blockSize;
    let bufferScaleIteration = 0;
    let buffer = Buffer.alloc(blockSize);

    const allocateMoreBuffer = () => {
      bufferScaleIteration += 1;
      maxBufferSize = blockSize * Math.pow(2, bufferScaleIteration);

      const newBuffer = Buffer.alloc(maxBufferSize);
      buffer.copy(newBuffer, 0, 0, read);
      buffer = newBuffer;
    };

    const readNextBuffer = () => {
      if ((maxBufferSize - read) < blockSize) {
        allocateMoreBuffer();
      }

      fs.read(fd, buffer, read, blockSize, null, (err, bytesRead) => {
        if (err) {
          return reject(err);
        }

        if (bytesRead === 0) {
          return fulfill([buffer, read]);
        }

        read += bytesRead;
        return readNextBuffer();
      });
    };

    readNextBuffer();
  });

const base = argv.base || __filename.replace(argv.$0, '');
const moduleNameRE = /~\/([\w-.]+)\//g;

const splitModules = (group, module) => {
  const relatedName = module.name.replace(base, '');

  const emptyGroup = name => ({
    name,
    modules: [],
    totalSize: 0,
    count: 0,
    dependencies: {},
  });

  const updateGroup = (updatePath, moduleName) => {
    if (!group.dependencies) {
      group.dependencies = {};
    }

    let head = group;

    const inc = () => {
      head.totalSize += module.size;
      head.count += 1;
    };

    updatePath.forEach((name) => {
      head = (head.dependencies[name]) ?
        head.dependencies[name] :
        (head.dependencies[name] = emptyGroup(name));

      inc();
    });

    group.usage[module.id] = (group.usage[module.id] === undefined) ?
      1 :
      group.usage[module.id] + 1;

    head.modules.push([moduleName, module.size, module.id]);
  };

  if (relatedName.indexOf('(webpack)') === 0) {
    updateGroup(['system'], relatedName.replace('(webpack)', ''));
    return group;
  }

  if (moduleNameRE.test(relatedName)) {
    const submodulesPath = [];
    relatedName.replace(moduleNameRE, (_, moduleName) => submodulesPath.push(moduleName));

    submodulesPath.forEach((mn, i) => {
      group.usage[i + mn] = group.usage[mn] ? group.usage[mn] + 1 : 1;
    });

    const submodulesPathStr = submodulesPath.map(sm => `~/${sm}/`).join('');
    updateGroup(['submodules', ...submodulesPath], relatedName.replace(submodulesPathStr, ''));
    return group;
  }

  const srcPath = relatedName.split('/');
  const srcName = srcPath.pop();

  updateGroup(['src', ...srcPath], srcName);
  return group;
};

const repeat = (ch, times) => {
  let str = '';

  for (let i = 0; i < times; i += 1) {
    str += ch;
  }

  return str;
};

const printSplitModules = (head, usage, depth = 0, wsbase = 2) => {
  const modules = head.dependencies;
  const pad = n => repeat(' ', (depth + n) * wsbase);

  const log = (p, str) =>
    console.log(`${pad(p)}${str}`);

  Object.keys(modules).forEach((key) => {
    const group = modules[key];

    const usageCount = usage[group.name] > 1 ?
      `, used ${usage[group.name]} times, all size ~${pb(group.totalSize * usage[group.name])}` :
      '';

    log(1, `[${group.name}] total_size: ${pb(group.totalSize)}, count: ${group.count}${usageCount}`);

    if (group.modules.length) {
      group.modules.forEach(([name, size, id]) => {
        const ut = usage[id] > 1 ? ` -- used ${usage[id]} times, total size ${pb(usage[id] * size)}` : '';
        log(2, `[${id}] ${name} - ${pb(size)}${ut}`);
      });
    }

    if (Object.keys(group.dependencies).length) {
      printSplitModules(group, usage, depth + 1, wsbase);
    }
  });
};

readFileFromFd(sfd)
  .then(([buf, read]) => {
    return JSON.parse(buf.toString('utf8', 0, read));
  })
  .then((res) => {
    console.log('Chunks: ');
    let chunk = null;
    const usage = {};
    const chunkStats = {};

    for (chunk of res.chunks) {
      chunkStats[chunk.id] = chunk.modules.reduce(splitModules, { usage });
    }

    for (chunk of res.chunks) {
      console.log(`${chunk.id} -> [${chunk.parents.join(',')}]`);
      printSplitModules(chunkStats[chunk.id], usage);
    }
  })
  .catch(err => console.error(err, err.stack));

