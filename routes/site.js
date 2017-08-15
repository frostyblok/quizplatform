const router = require('express').Router();

const siteController = require('../controllers/site');

const {ensureLogin, checkToken, isRegistered} = require('../utils/middlewares');

router.get('/dashboard', ensureLogin, siteController.getDashBoard);
router.post('/dashboard', ensureLogin, siteController.tokenRegistration);

router.get('/news', siteController.newsList);
router.get('/faqs', siteController.faqs);

router.get('/virtual-quiz',
            ensureLogin,
            isRegistered,
            checkToken,
            siteController.getQuiz
          );
router.post('/virtual-quiz', siteController.evaluateQuiz);

router.get('/scholars-cup',
            ensureLogin,
            isRegistered,
            checkToken,
            siteController.getQuiz
          );
router.post('/scholars-cup', siteController.evaluateQuiz);

router.get('/scholars-bowl',
            ensureLogin,
            isRegistered,
            checkToken,
            siteController.getQuiz
          );
router.post('/scholars-bowl', siteController.evaluateQuiz);

router.get('/grants',
            ensureLogin,
            isRegistered,
            checkToken,
            siteController.getQuiz
          );
router.post('/grants', siteController.evaluateQuiz);

router.get('/quiz-auth', siteController.getQuizAuth);
router.post('/quiz-auth', siteController.handleQuizAuth);



router.post('/verify-token', siteController.verifyToken);

router.get('/get-token', ensureLogin, siteController.getToken);
router.post('/get-token', ensureLogin, siteController.getToken);

router.get('/ranking', ensureLogin, siteController.ranking);
router.post('/ranking', ensureLogin, siteController.institutionRanking);

router.get('/top-applicants', ensureLogin, siteController.ranking);
router.post('/top-applicants', ensureLogin, siteController.topApplicants);

module.exports = router;
