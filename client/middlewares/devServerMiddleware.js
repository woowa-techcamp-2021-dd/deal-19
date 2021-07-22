import path from 'path';

const devMiddleware = (compiler) => (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    const dir = req.path === '/' ? '/main' : req.path;
    const RESULT_FILE = path.join(compiler.outputPath, `${dir}/index.html`);

    compiler.outputFileSystem.readFile(RESULT_FILE, (err, result) => {
      if (err) return next(err);
      res.set('Content-Type', 'text/html');
      res.send(result);
      res.end();
    });
  } else {
    next();
  }
};

export default devMiddleware;
