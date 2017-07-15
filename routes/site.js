const router = require('express').Router();

const siteController = require('../controllers/site');

router.get('/news', siteController.newsList);

// router.get('/virtual-quiz', siteController.getVirtualQuiz);
router.get('/virtual-quiz', siteController.getQuiz);
router.post('/virtual-quiz', siteController.evaluateQuiz);

// router.post('/virtual-quiz', siteController.postVirtualQuiz);
// router.get('/result', siteController.)


module.exports = router;
