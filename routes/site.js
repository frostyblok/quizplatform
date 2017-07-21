const router = require('express').Router();

const siteController = require('../controllers/site');

const {ensureLogin, checkToken, isRegistered} = require('../utils/middlewares');

router.get('/dashboard', ensureLogin, siteController.getDashBoard);
router.get('/news', siteController.newsList);

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


module.exports = router;
