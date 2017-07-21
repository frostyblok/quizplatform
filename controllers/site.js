const Institution = require("../models/institution");
const NewsItem = require("../models/news");
const Pack = require("../models/pack");
const Question = require("../models/question");

const User = require("../models/user");

const helpers = require("../utils/helpers");


const getDashBoard = function (req, res) {
  Institution.findById({ _id: req.user.institution },
    function (err, institution) {
      if (err) {
        req.flash("error", "Unable to fetch Institution name");
      }
      let registrationEndpoint = '/accounts/token-auth';
      console.log("sending dashboard");
      res.render("dashboard", { institution, endpoint: registrationEndpoint });
    }
  )
}



const newsList = function (req, res) {
  NewsItem.find({}).sort({ _id: -1 }).exec(function (err, news) {
    if (err) {
      req.flash("failure", "Unable to fetch news feed");
      res.render("news");
    } else {
      res.render("news", { news });
    }
  })
};

// TODO:
const getQuizAuth = function (req, res) {
  let redirectTo = req.session.redirectTo;
  switch (redirectTo) {
    case "/virtual-quiz":

      break;
    case "/scholars-cup":

      break;
    case "/scholars-bowl":

      break;
    case "/grants":

      break;
    default:

  }
  res.render("includes/tokenAuthenticationForm")
}

// TODO:
const handleQuizAuth = function (req, res) {

}


const getQuiz = function (req, res) {
  Pack.count().exec(function (err, count) {
    var random = Math.floor(Math.random() * count);
    Pack.findOne().skip(random).populate("questions").exec(
      function (err, pack) {
        if (err) {
          console.log(err);
          req.flash("failure", "Unable to fetch quiz");
          res.render("index");
        } else {
          // increment User.token use count here and save
          req.session["startTime"] = Date.now();
          req.session["pack"] = pack.name;
          res.render("quiz", { pack });
        }
      }
    );
  })
}


const evaluateQuiz = function (req, res) {
  // if user token count >= maxTokenUse take care of things
  // time allowed is 6.5mins + 10secs extra for latency.
  const TIME_ALLOWED = 6.5 * 60 * 1000 + 10 * 1000;
  const finishTime = Date.now();
  const startTime = req.session.startTime;
  const timeTaken = finishTime - startTime;
  const packName = req.session.pack;
  delete req.session.startTime;
  // delete req.session.pack;
  if (timeTaken > TIME_ALLOWED) {
    req.flash("failure", "Invalid submission. You submitted too late");
    res.redirect("/");
  } else {
    Question.find(
      {pack: packName},
      {"correctAnswer": 1, _id: 0},
      (err, questions) => {
        if (err) {
          console.log(err);
          req.flash("error", "Something went wrong");
          res.redirect("/");
          return;
        } else {
          let score = 0;
          let correct = 0;
          let wrong = 0;
          for (var i in req.body) {
            if (req.body[i] === questions[i].correctAnswer) {
              ++score;
              ++correct;
            } else {
              score -= 0.4;
              ++wrong;
            }
          }
          let unAnswered = questions.length - (correct + wrong);
          score = score.toFixed(1);
          saveScore(req.user, score, timeTaken);
          res.render("result", { score, correct, wrong, unAnswered })
        }
      }
    )
  }
}


const saveScore = (user, score, time) => {
  console.log("saving");
  if (user) {
    if (user.score && user.score > score)
      return;
    if (user.score && user.score < score) {
      user.score = score;
    }
    if (user.score && user.score === score) {
      if (time < user.time){
        user.time = time;
        user.score = score;
      }
    }
    user.save((err, user)=> {
      if (err) {
        console.log(err);
      }
    })
  }
  return;
}


const getRanking = function (req, res) {
  User.find({institution: req.user.institution})
      .sort({score: -1, time: 1})
      .limit(50)
      .exec(function (err, users) {
        if (err) {
          console.log(err);
        } else {
          res.render('ranking', {users});
        }
      });
}


module.exports = {
  getDashBoard,
  newsList,
  getRanking,
  getQuizAuth,
  handleQuizAuth,
  getQuiz,
  evaluateQuiz,
};
