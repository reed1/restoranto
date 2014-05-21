
var SESSION_TAG = 'admin-backend';

// restrict access for admin backend only
function adminAuth(req, res, next) {
  if (req.session[SESSION_TAG] === true) {

    // pass to view
    res.locals.adminAuth = true;
    next();

  } else {

    req.flash('login', 'unauthorized');
    res.redirect('./login');
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

    var flash = req.flash('login')[0];

    res.render('admin/login', {
      flash: flash
    });
  });

  post('login', function(req, res) {

    if (req.body.email === 'admin@l2p.net' && req.body.password === '1') {
      req.session[SESSION_TAG] = true;
      res.redirect('./index');
    }
    else {
      req.flash('login', 'bad-auth');
      res.redirect('./login');
    }

  });

  get('logout', function(req, res) {
    delete req.session[SESSION_TAG];

    // redirect relative style
    res.redirect('./login');

    // or absolute style
    // res.redirect('/backend/admin/login');

    // or app level absolute style
    // res.redirect('/' + res.locals.app + '/' + res.locals.controller '/login');
  });

  get('forgot-password', function(req, res) {
    res.send('Gw juga gak tau bro..');
  });

};
