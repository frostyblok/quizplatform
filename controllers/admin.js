const Question = require('../models/question');

const Pack = require('../models/pack');

const User = require('../models/user');


const getUsers = function (req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
      res.end('error fetching users');
    }
    res.render('users-list', { users });
  })
}

const createPack = function (req, res) {
  let name = req.body.name;
  req.checkBody('name', 'A question pack must have an alphanumeric name')
            .notEmpty().isAlpha();
  req.sanitizeBody('name').trim();
  req.sanitizeBody('name').escape();

  const errors = req.validationErrors();
  if (errors) {
    res.render('admin', {errors})
  }

  pack = new Pack({ name: name });
  pck.save(function (err, pack) {
    if (err) {
      console.log(err);
      res.end("Unable to create Question Pack");
    }
    res.redirect('./add-questions');
  })
}

const getPack = function (req, res) {
  res.render('pack');
}

const addQuestion = function (req, res) {
  let question = req.body.question;
  let optionA = req.body.optionA;
  let optionB = req.body.optionB;
  let optionC = req.body.optiionC;
  let optionD = req.body.optionD;
  let correctAnswer = req.body.correctAnswer;

  req.checkBody('question', 'Question cannot be empty').notEmpty();
  req.checkBody('optionA', 'Please provide option A').notEmpty();
  req.checkBody('optionB', 'Please provide option B').notEmpty();
  req.checkBody('optionC', 'Please provide option C').notEmpty();
  req.checkBody('optionD', 'Please provide option D').notEmpty();
  req.checkBody('correctAnswer', 'Specify the correct Answer').notEmpty();

  req.sanitizeBody('question').trim();
  req.sanitizeBody('question').escape();
  req.sanitizeBody('optionA').trim();
  req.sanitizeBody('optionA').escape();
  req.sanitizeBody('optionB').trim();
  req.sanitizeBody('optionB').escape();
  req.sanitizeBody('optionC').trim();
  req.sanitizeBody('optionC').escape();
  req.sanitizeBody('optionD').trim();
  req.sanitizeBody('optionD').escape();
  req.sanitizeBody('correctAnswer').trim();
  req.sanitizeBody('correctAnswer').escape();

  const pack = req.params('pack');

  const newQuestion = new Question({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    pack,
  });

  Pack.findOneAndUpdate({ name: pack },
                        {$push: { questions: newQuestion }},
                        function(err, pack) {
    if (err) {
      console.log(err);
      res.end("Couldn't add question to Pack. Ensure Pack exists first");
    }
  })

}


module.exports = { getUsers, getPack, createPack, addQuestion}
