const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('src/db/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const db = router.db;
  const user = db.get('users').find({ username, password }).value();

  if (user) {
    res.status(200).json({ username: user.username, token: user.token });
  } else {
    res.status(401).json({ error: 'Invalid username or password' });
  }
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server is running on http://localhost:3000');
});
