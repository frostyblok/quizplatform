const router = require('express').Router();

// import route controllers
const admin = require('../controllers/admin');


// pack routes
router.post('/create-pack', admin.createPack);
router.get('/pack/:name', admin.getPack);
router.post('/pack/:name', admin.addQuestionToPack);
router.delete('/pack/:name', admin.deletePack);
router.get('/pack', admin.getPackList);

// news routes
router.get('/news', admin.listNews);
router.post('/news', admin.addNews);
router.get('/news/:id/edit', admin.getEditNews);
router.post('/news/:id/edit', admin.editNews);
router.delete('/news/:id', admin.deleteNews);

router.get('/institution', admin.getInstitutions);
router.post('/institution', admin.addInstitution);
router.get('/institution/:id/edit', admin.getEditInstitution);
router.post('/institution/:id/edit', admin.editInstitution);
router.delete('/institution/:id', admin.deleteInstitution);

// root admin route
router.get('/', admin.getAdmin);

module.exports = router;
