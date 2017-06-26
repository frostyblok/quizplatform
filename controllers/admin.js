const Question = require("../models/question");
const Pack = require("../models/pack");
const NewsItem = require("../models/news");

const User = require("../models/user");
const Institution = require("../models/institution");


const getUsers = function (req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
      req.flash("failure", "error fetching users");
      res.render("admin");
    } else {
      res.render("users-list", { users });
    }
  })
}

const getAdmin = function (req, res) {
  res.render("admin/admin");
}

const addInstitution = function (req, res) {
  const name = req.body.name;
  req.checkBody("name", "Please provide institution name").notEmpty().isAlpha();
  req.sanitizeBody("name").trim();
  req.sanitizeBody("name").escape();

  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/admin", { errors });
    return;
  }

  const institution = new Institution({ name });
  institution.save(function (err) {
    if (err) {
      req.flash("failure", "Unable to add institution");
    } else {
      req.flash("success", "new institution added to database");
    }
    res.render("admin/institution");
  });
}

const getInstitutions = function (req, res) {
  Institution.find({}, function (err, institutions) {
    if (err) {
      console.log(err);
      req.flash("failure", "unable to fetch institutions");
      res.render("admin/admin");
    }
    res.render("admin/institution", { institutions });
  })
};


const deleteInstitution = function (req, res) {
  const _id = req.params.id;
  Institution.remove({ _id }, function (err, removed) {
    if (err) {
      req.flash("failure", "Could not delete institution");
      res.redirect('admin/institution'); // TODO: review this
    } else {
      res.send("Institution deleted");
    }
  })
}

// Pack Section

const createPack = function (req, res) {
  console.log("createPack controller called");
  console.log("createPack controller called");
  let name = req.body.name;
  req.checkBody("name", "A question pack must have an alphanumeric name")
            .notEmpty().isAlpha();
  req.sanitizeBody("name").trim();
  req.sanitizeBody("name").escape();

  const errors = req.validationErrors();
  if (errors) {
    console.log(errors);
    res.render("admin/admin", { errors })
    return;
  }

  const pack = new Pack({ name: name });
  pack.save(function (err, pack) {
    if (err) {
      console.log(err);
      res.end("Unable to create Question Pack");
      return;
    }
    res.redirect("./:pack/add-questions");
  })
}

// TODO: identify pack
const getPack = function (req, res) {
  let pack = req.params("pack");
  res.render("pack", { pack });
}

const addQuestionToPack = function (req, res) {
  let question = req.body.question;
  let optionA = req.body.optionA;
  let optionB = req.body.optionB;
  let optionC = req.body.optiionC;
  let optionD = req.body.optionD;
  let correctAnswer = req.body.correctAnswer;

  req.checkBody("question", "Question cannot be empty").notEmpty();
  req.checkBody("optionA", "Please provide option A").notEmpty();
  req.checkBody("optionB", "Please provide option B").notEmpty();
  req.checkBody("optionC", "Please provide option C").notEmpty();
  req.checkBody("optionD", "Please provide option D").notEmpty();
  req.checkBody("correctAnswer", "Specify the correct Answer").notEmpty();

  req.sanitizeBody("question").trim();
  req.sanitizeBody("question").escape();
  req.sanitizeBody("optionA").trim();
  req.sanitizeBody("optionA").escape();
  req.sanitizeBody("optionB").trim();
  req.sanitizeBody("optionB").escape();
  req.sanitizeBody("optionC").trim();
  req.sanitizeBody("optionC").escape();
  req.sanitizeBody("optionD").trim();
  req.sanitizeBody("optionD").escape();
  req.sanitizeBody("correctAnswer").trim();
  req.sanitizeBody("correctAnswer").escape();

  const pack = req.params("pack");

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
      req.flash(
        "failure",
        "Couldn't add question to Pack. Ensure Pack exists first"
      );
      res.render("pack");
      return;
    }
    res.flash("success", "Question added to pack");
    res.render("pack");
  })
}

// News Section
const listNews = function (req, res) {
  NewsItem.find({}, function (err, news) {
    if (err) {
      req.flash("failure", "Unable to fetch list items");
      res.render("/admin");
    } else {
      res.render("admin/news", { news });
    }
  })
};

const addNews = function (req, res) {
  const title = req.body.title;
  const body = req.body.body;

  req.checkBody("title", "Please provide title for news").notEmpty();
  req.checkBody("body", "Please provide news body").notEmpty();

  req.sanitizeBody("title").trim();
  req.sanitizeBody("title").escape();
  req.sanitizeBody("body").trim();
  req.sanitizeBody("body").escape();

  let news = new NewsItem({ title, body });
  news.save(function(err, news) {
    if (err) {
      console.log("UNABLE TO SAVE NEWS ITEM TO DB", err);
      req.flash("failure","Unable to save news item");
      res.render("/admin/news");
      return;
    }
    req.flash("success", "News item saved");
    res.render("/admin/news");
  })
}

const deleteNews = function (req, res) {
  const newsId = req.params.id;
  const newsItem = NewsItem.findByIdAndRemove(newsId, function (err, done) {
    if (err){
      req.flash("failure", "Unable to delete news Item")
      res.render("/admin");
      return;
    }
    req.flash("success", "News item deleted")
    res.render("admin");
  });
}


module.exports = {
  getAdmin,
  getUsers,
  addInstitution,
  getInstitutions,
  deleteInstitution,
  getPack,
  createPack,
  addQuestionToPack,
  listNews,
  addNews,
  deleteNews,
};
