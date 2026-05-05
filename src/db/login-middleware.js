module.exports = (req, res, next) => {
  if (req.method === 'POST' && req.path === '/api/login') {
    const { username, password } = req.body;
    const db = req.app.db;
    const user = db.get('users').find({ username, password }).value();

    if (user) {
      res.status(200).json({ username: user.username, token: user.token });
    } else {
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } else {
    next();
  }
};
