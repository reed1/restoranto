
var SESSION_TAG = 'admin-backend';

// restrict access for admin backend only
function adminAuth(req, res, next) {
  if (req.session[SESSION_TAG] === true) {
    next();
  } else {
    res.send('401', 'Access Denied');
  }
}

module.exports = function(app) {

  app.get('/index', adminAuth, function(req, res) {
    res.render('admin/index');
  });

  app.get('/tools', adminAuth, function(req, res) {
    res.render('admin/tools');
  });

  app.get('/login', function(req, res) {
    res.render('admin/login');
  });

  app.post('/login', function(req, res) {

    if (req.body.email === 'admin@l2p.net' && req.body.password === '1') {
      req.session[SESSION_TAG] = true;
      res.redirect(req.path + '/../index');
    }
    else {
      res.send('400', 'Bad Auth..');
    }

  });

  app.get('/logout', function(req, res) {
    delete req.session[SESSION_TAG];

    // redirect relative style
    res.redirect(req.path + '/../login');

    // or absolute style
    // res.redirect('/backend/admin/login');

    // or app level absolute style
    // res.redirect('/' + res.locals.app + '/admin/login');
  });

  app.get('/forgot-password', function(req, res) {
    res.send('Gw juga gak tau bro..');
  });

};
