const express = require('express')
const router = express.Router()

var NotifyClient = require('notifications-node-client').NotifyClient, notify = new NotifyClient(process.env.NOTIFYAPIKEY)

// Add your routes here - above the module.exports line
router.get('/', function (req, res) {
  req.session.destroy()
  res.render('index', {
  })
})

// Guest sign in option
router.get('/guest-signin/option', function (req, res) {
  res.render('guest-signin/option', {
  })
})

router.post('/guest-signin/option', function (req, res) {
  var errors = []
  var value = req.session.data['guest-signin']
  if (typeof req.session.data['guest-signin'] === 'undefined') {
    errors.push({
      text: 'Enter the company authentication code',
      href: '#auth-number'
    })
    res.render('guest-signin/option', {
      errorOption: true,
      errorList: errors
    })
  } if (value === 'yes') {
    res.redirect('../sign-in')
  } if (value === 'no') {
    res.redirect('../oe-contact')
  }
})

// Sign in
router.get('/sign-in', function (req, res) {
  res.render('sign-in', {
  })
})

router.post('/sign-in', function (req, res) {
  var errors = []
  var emailHasError = false
  var passwordHasError = false

  if (req.session.data['email'] === '') {
    emailHasError = true
    errors.push({
      text: 'Enter your email address',
      href: '#email-error'
    })
  }
  if (req.session.data['password'] === '') {
    passwordHasError = true
    errors.push({
      text: 'Enter your password',
      href: '#password-error'
    })
  }

  if (emailHasError || passwordHasError) {
    res.render('sign-in', {
      errorEmail: emailHasError,
      errorPassword: passwordHasError,
      errorList: errors
    })
  } else {
    res.redirect('signed-in-details')
  }
})

// Type of Obliged entity
router.get('/oe-type', function (req, res) {
  res.render('oe-type', {
  })
})

router.post('/oe-type', function (req, res) {
  var errors = []
  if (typeof req.session.data['obliged-type'] === 'undefined') {
    errors.push({
      text: 'Select what type of obliged entity you are',
      href: '#obliged-type'
    })
    res.render('oe-type', {
      errorType: true,
      errorList: errors
    })
  } else {
    res.redirect('/discrepancy-details/company-number')
  }
})

// Obliged entity name
router.get('/oe-contact', function (req, res) {
  res.render('oe-contact', {
  })
})

router.post('/oe-contact', function (req, res) {
  var errors = []
  var emailHasError = false
  var nameHasError = false
  if (req.session.data['full-name'] === '') {
    nameHasError = true
    errors.push({
      text: 'Enter your full name',
      href: '#full-name'
    })
  } if (req.session.data['email'] === '') {
    emailHasError = true
    errors.push({
      text: 'Enter your email address',
      href: '#email'
    })
  } if (req.session.data['full-name'] === '@') {
    errors.push({
      text: 'Full name must only include letters a to z, hyphens, spaces and apostrophes',
      href: '#full-name'
    })
    res.render('oe-contact', {
      errorNametwo: true,
      errorEmail: emailHasError,
      errorList: errors
    })
  } if (emailHasError || nameHasError) {
    res.render('oe-contact', {
      errorEmail: emailHasError,
      errorName: nameHasError,
      errorList: errors
    })
  } else {
    res.redirect('/oe-type')
  }
})

// Company number
router.get('/discrepeancy-details/company-number', function (req, res) {
  res.render('discrepeancy-details/company-number', {
  })
})

router.post('/discrepancy-details/company-number', function (req, res) {
  var errors = []
  var str = req.session.data['company-number']
  var n = str.length
  if (str === '') {
    errors.push({
      text: 'Enter the company number',
      href: '#company-number'
    })
    res.render('discrepancy-details/company-number', {
      errorNum: true,
      errorList: errors
    })
    return
  } if (n !== 8) {
    errors.push({
      text: 'Company number must be 8 characters ',
      href: '#company-number'
    })
    res.render('discrepancy-details/company-number', {
      errorNum: true,
      errorList: errors
    })
    return
  } if (req.session.data['company-number'] === '00445790') {
    res.redirect('/unable-to-use')
  } else {
    res.redirect('/discrepancy-details/confirm-company')
  }
})

// All of the PSC's for that company
router.get('/discrepeancy-details/psc-names', function (req, res) {
  res.render('/discrepeancy-details/psc-names', {
  })
})

router.post('/discrepancy-details/psc-names', function (req, res) {
  var errors = []
  if (typeof req.body.psc === 'undefined') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#psc'
    })
    res.render('discrepancy-details/psc-names', {
      errorPSC: true,
      errorList: errors
    })
    return
  } if (req.body.psc.includes('duplicate')) {
    res.redirect('/discrepancy-details/psc-duplicate')
    return
  } if (req.body.psc.includes('other')) {
    res.redirect('/discrepancy-details/psc-missing')
    return
  } else {
    res.redirect('/discrepancy-details/psc-person')
    return
  }
})

// PSC Person
router.get('/discrepeancy-details/psc-person', function (req, res, next) {
  res.render('/discrepeancy-details/psc-person', {
  })
})

router.post('/discrepancy-details/psc-person', function (req, res, next) {
  var errors = []
  var myCheckboxes = req.body.pscname
  if (typeof req.body.pscname === 'undefined') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#pscname'
    })
    res.render('discrepancy-details/psc-person', {
      errorPSC: true,
      errorList: errors
    })
    return
  } if (myCheckboxes.includes('noc')) {
    res.redirect('psc-noc-input')
    return
  } if (myCheckboxes.includes('address')) {
    res.redirect('psc-address-input')
    return
  } if (myCheckboxes.includes('name')) {
    res.redirect('psc-name-input')
    return
  } if (myCheckboxes.includes('dob')) {
    res.redirect('psc-dob-input')
    return
  } if (myCheckboxes.includes('nationality')) {
    res.redirect('psc-nationality-input')
    return
  } else {
    res.redirect('psc-appointed-on-input')
    return
  }
})

// PSC Person Nature of Control
router.get('/discrepeancy-details/psc-noc-input', function (req, res, next) {
  res.render('/discrepeancy-details/psc-noc-input', {
  })
})

router.post('/discrepancy-details/psc-noc-input', function (req, res, next) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']

  if (req.session.data['pscnoc'] === ' ') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#pscname'
    })
    res.render('discrepancy-details/psc-noc-input', {
      errorPSC: true,
      errorList: errors
    })
    return
  } if (myCheckboxes.includes('address')) {
    res.redirect('psc-address-input')
    return
  } if (myCheckboxes.includes('name')) {
    res.redirect('psc-name-input')
    return
  } if (myCheckboxes.includes('dob')) {
    res.redirect('psc-dob-input')
    return
  } if (myCheckboxes.includes('nationality')) {
    res.redirect('psc-nationality-input')
    return
  } if (myCheckboxes.includes('nd')) {
    res.redirect('psc-appointed-on-input')
    return
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// PSC Person Address
router.get('/discrepeancy-details/psc-address-input', function (req, res, next) {
  res.render('/discrepeancy-details/psc-address-input', {
  })
})

router.post('/discrepancy-details/psc-address-input', function (req, res, next) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']

  if (req.session.data['pscnoc'] === ' ') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#pscname'
    })
    res.render('discrepancy-details/psc-address-input', {
      errorPSC: true,
      errorList: errors
    })
    return
  } if (myCheckboxes.includes('name')) {
    res.redirect('psc-name-input')
    return
  } if (myCheckboxes.includes('dob')) {
    res.redirect('psc-dob-input')
    return
  } if (myCheckboxes.includes('nationality')) {
    res.redirect('psc-nationality-input')
    return
  } if (myCheckboxes.includes('nd')) {
    res.redirect('psc-appointed-on-input')
    return
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// PSC Person Name
router.get('/discrepeancy-details/psc-name-input', function (req, res) {
  res.render('/discrepeancy-details/psc-name-input', {
  })
})

router.post('/discrepancy-details/psc-name-input', function (req, res) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']
  if (req.session.data['psc-name-input'] === '') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#psc-name-input'
    })
    res.render('discrepancy-details/psc-name-input', {
      errorPSC: true,
      errorList: errors
    })
  } if (myCheckboxes.includes('dob')) {
    res.redirect('psc-dob-input')
    return
  } if (myCheckboxes.includes('nationality')) {
    res.redirect('psc-nationality-input')
    return
  } if (myCheckboxes.includes('nd')) {
    res.redirect('psc-appointed-on-input')
    return
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// PSC DOB
router.get('/discrepeancy-details/psc-dob-input', function (req, res) {
  res.render('/discrepeancy-details/psc-dob-input', {
  })
})

router.post('/discrepancy-details/psc-dob-input', function (req, res) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']
  if (req.session.data['psc-dob-input'] === '') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#psc-dob-input'
    })
    res.render('discrepancy-details/psc-dob-input', {
      errorPSC: true,
      errorList: errors
    })
  } if (myCheckboxes.includes('nationality')) {
    res.redirect('psc-nationality-input')
    return
  } if (myCheckboxes.includes('nd')) {
    res.redirect('psc-appointed-on-input')
    return
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// PSC Nationality
router.get('/discrepeancy-details/psc-nationality-input', function (req, res) {
  res.render('/discrepeancy-details/psc-nationality-input', {
  })
})

router.post('/discrepancy-details/psc-nationality-input', function (req, res) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']
  if (req.session.data['psc-nationality-input'] === '') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#psc-nationality-input'
    })
    res.render('discrepancy-details/psc-nationality-input', {
      errorPSC: true,
      errorList: errors
    })
  } if (myCheckboxes.includes('nd')) {
    res.redirect('psc-appointed-on-input')
    return
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// PSC Appointed on
router.get('/discrepeancy-details/psc-appointed-on-input', function (req, res) {
  res.render('/discrepeancy-details/psc-appointed-on-input', {
  })
})

router.post('/discrepancy-details/psc-appointed-on-input', function (req, res) {
  var errors = []
  var myCheckboxes = req.session.data['pscname']
  if (req.session.data['psc-appointed-on-input'] === '') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#psc-appointed-on-input'
    })
    res.render('discrepancy-details/psc-appointed-on-input', {
      errorPSC: true,
      errorList: errors
    })
  } else {
    res.redirect('../check-your-answers')
    return
  }
})

// Do you want to add other information (not in the prototype at the moment)
router.get('/discrepeancy-details/other-info-question', function (req, res) {
  res.render('/discrepeancy-details/other-info-question', {
  })
})

router.post('/discrepancy-details/other-info-question', function (req, res) {
  var errors = []
  if (typeof req.session.data['other-info-question'] === 'undefined') {
    errors.push({
      text: 'Select the PSC with the incorrect information',
      href: '#other-info-question'
    })
    res.render('discrepancy-details/other-info-question', {
      errorPSC: true,
      errorList: errors
    })
  } if (req.session.data['other-info-question'] === 'no') {
    res.redirect('../check-your-answers')
  } else {
    res.redirect('/discrepancy-details/other-info')
  }
})

// PSC Missing Information
router.get('/discrepeancy-details/psc-missing', function (req, res) {
  res.render('/discrepeancy-details/psc-missing', {
  })
})

router.post('/discrepancy-details/psc-missing', function (req, res) {
  var errors = []
  if (req.session.data['more-detail'] === '') {
    errors.push({
      text: 'Enter the information that is incorrect for the PSC',
      href: '#more-detail'
    })
    res.render('discrepancy-details/psc-missing', {
      errorOther: true,
      errorList: errors
    })
  } else {
    res.redirect('/check-your-answers')
  }
})

// Other information about the report (not in the prototype at the moment)
router.get('/discrepeancy-details/other-info', function (req, res) {
  res.render('/discrepeancy-details/other-info', {
  })
})

router.post('/discrepancy-details/other-info', function (req, res) {
  var errors = []
  if (req.session.data['more-detail'] === '') {
    errors.push({
      text: 'Enter the information that is incorrect for the PSC',
      href: '#more-detail'
    })
    res.render('discrepancy-details/other-info', {
      errorOther: true,
      errorList: errors
    })
  } else {
    res.redirect('/check-your-answers')
  }
})

// Check your answers page
router.post('/check-your-answers', function (req, res) {
  notify.sendEmail(
    'd630c289-6b62-47d4-846b-86e13ecd8650',
    req.session.data['email']
  )
  res.redirect('confirmation')
})

router.get('/confirmation', function (req, res) {
  res.render('confirmation', {
  })
})

module.exports = router
