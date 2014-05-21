
var SESSION_TAG = 'admin-backend';

// restrict access for admin backend only
function adminAuth(req, res, next) {
  if (req.session[SESSION_TAG] === true) {

    // pass to view
    res.locals.adminAuth = true;

    next();
  } else {
    res.redirect('/'+res.locals.app+'/admin/login');
  }
}

module.exports = function(get, post) {

  get('index', adminAuth, function(req, res) {
    res.render('admin/index');
  });

  get('tools', adminAuth, function(req, res) {
    res.render('admin/tools');
  });

  get('login', function(req, res) {
    res.render('admin/login');
  });

  post('login', function(req, res) {

    if (req.body.email === 'admin@l2p.net' && req.body.password === '1') {
      req.session[SESSION_TAG] = true;
      res.redirect(req.path + '/../index');
    }
    else {
      res.send('400', 'Bad Auth..');
    }

  });

  get('logout', function(req, res) {
    delete req.session[SESSION_TAG];

    // redirect relative style
    res.redirect('./login');

    // or absolute style
    // res.redirect('/backend/admin/login');

    // or app level absolute style
    // res.redirect('/' + res.locals.app + '/admin/login');
  });

  get('forgot-password', function(req, res) {
    res.send('Gw juga gak tau bro..');
  });

};
