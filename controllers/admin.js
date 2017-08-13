const appendFile = require('fs').appendFile;
// import whilst from 'async/whilst';
const async = require('async');

const Pack = require("../models/pack");
const Question = require("../models/question");
const NewsItem = require("../models/news");

const User = require("../models/user");
const Institution = require("../models/institution");

const Token = require("../models/token");
const Serial = require("../models/serial");

const helpers = require("../utils/helpers");


function getUsers (req, res) {
  User.count({}, function(err, users) {
    if (err) {
      console.log(err);
      req.flash("failure", "error fetching users");
      res.render("admin/admin");
    } else {
      res.render("users-list", { users });
    }
  })
}


function getUserCount (req, res) {
  let institution = req.params.institution;
  if (institution) {
    User.count({institution}, function (err, count) {
      if (err) {
        req.flash("failure", "error fetching users");
        res.render("admin/admin");
      } else {
        res.render("users", { count, institution });
      }
    })
  } else {
    User.count({}, function (err, count) {
      if (err) {
        req.flash("failure", "error fetching users");
        res.render("admin/admin");
      } else {
        res.render("users", { count });
      }
    })
  }
}


function getAdmin (req, res, next) {
  User.count({}).exec().then((userCount) => {
    Institution.find({}).then((institutions) => {
      res.render("admin/admin", { userCount, institutions });
    })
  }).catch((err)=> next(err));
}


function makeStaff (req, res) {
  let username = req.body.username;
  req.checkBody("username", "cannot create staff without username").notEmpty();
  req.sanitizeBody("username").trim();
  req.sanitizeBody("username").escape();
  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors[0].msg);
    res.redirect("/admin");
    return;
  }
  User.findOneAndUpdate({username}, {isStaff: true}).then((user) => {
    req.flash("message", "Staff user created");
    res.redirect("/admin");
  }).catch((err) => {
    req.flash("error", "Unable to create staff user");
    res.redirect("/admin");
  })
}


// Institution

function addInstitution (req, res) {
  const institution = req.body.institution;
  req.checkBody("institution", "Please provide institution name").notEmpty().isAlpha();
  req.sanitizeBody("institution").trim();
  req.sanitizeBody("institution").escape();

  const errors = req.validationErrors();
  if (errors) {
    res.render("admin/admin", { errors });
    return;
  }

  const newInstitution = new Institution({ institution });
  newInstitution.save(function (err) {
    if (err) {
      console.log(err);
      req.flash("failure", "Unable to add institution");
    } else {
      req.flash("success", "new institution added to database");
    }
    res.redirect("/admin/institution");
  });
}


function getInstitutions (req, res) {
  Institution.find({}, function (err, institutions) {
    if (err) {
      console.log(err);
      req.flash("failure", "unable to fetch institutions");
      res.render("admin/admin");
    }
    res.render("admin/institution", { institutions });
  })
};

function getEditInstitution (req, res) {
  const _id = req.params.id;
  Institution.findOne({ _id }, function (err, institution) {
    if (err) console.log(err);
    else
      res.render("admin/editInstitution", { institution });
  });
}


function editInstitution (req, res) {
  const _id = req.params.id;
  const institution = req.body.institution;
  req.checkBody("institution", "Please provide institution name").notEmpty().isAlpha();
  req.sanitizeBody("institution").trim();
  req.sanitizeBody("institution").escape();

  const errors = req.validationErrors();
  if (errors) {
    req.flash("failure", errors[0].msg);
    res.redirect("/admin/institution");
    return;
  }
  Institution.findOneAndUpdate({ _id }, { institution }, function (err, institution) {
    if (err) {
      console.log(err);
      req.flash("failure", "Could not rename institution");
      res.redirect("/admin/institution");
    }
    else {
      req.flash("success", "Institution renamed");
      res.redirect("/admin/institution");
    }
  });
}


function deleteInstitution (req, res) {
  const _id = req.params.id;
  helpers.deleteFromDb(Institution, { _id }, function (err, removed) {
    if (err) {
        req.flash("failure", "Could not delete institution");
        res.redirect('admin/institution'); // TODO: review this
      } else {
        res.send("Institution deleted");
      }
  })
}



// Pack Section

function createPack (req, res) {
  let name = req.body.name;
  req.checkBody("name", "A question pack must have an alphanumeric name")
            .notEmpty().isAlpha();
  req.sanitizeBody("name").trim();
  req.sanitizeBody("name").escape();

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors[0].msg)
    res.render("admin/admin", { errors })
    return;
  }

  const pack = new Pack({ name });
  pack.save(function (err, pack) {
    if (err) {
      req.flash("error", `Unable to create Question Pack. Consider renaming Pack`);
      res.redirect("/admin");
      return;
    }
    res.redirect(`/admin/pack/${name}`);
  })
}


function getPack (req, res, next) {
  let name = req.params.name;
  Pack.findOne({ name }).populate('questions').exec(function (err, pack) {
    if (err) {
      req.flash("failure", "unable to fetch question pack");
      res.redirect("/admin");
    } else {
      if (pack) {
        let url =`/admin/pack/${pack.name}`
        res.render("admin/pack", { pack, url });
      } else {
        next()
      }
    }
  })
};


function addQuestionToPack (req, res) {
  let question = req.body.question;
  let optionA = req.body.optionA;
  let optionB = req.body.optionB;
  let optionC = req.body.optionC;
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

  req.checkParams("name", "pack name cannot be empty").notEmpty();
  req.sanitizeParams("name").trim();
  req.sanitizeParams("name").escape();
  const pack = req.params.name;

  const errors = req.validationErrors();
  if (errors) {
    req.flash("failure", errors[0].msg)
    res.redirect(`/admin/pack/${pack}`);
    return;
  }
  const newQuestion = new Question({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
    pack,
  });

  newQuestion.save(function (err, savedQuestion) {
    console.log(req.url);
    console.log("Starting save process");
    if (err) {
      req.flash("failure", "Unable to create question");
      res.redirect(`/admin${req.url}`);
    } else {
      console.log("question saved", "Updating Pack");
      Pack.findOneAndUpdate({ name: pack },
                            {$push: { questions: savedQuestion._id }},
                            function(err, pack) {
        if (err) {
          console.log("Error updating Pack");
          req.flash(
            "failure",
            "Couldn't add question to Pack. Ensure Pack exists first"
          );
          res.render("admin/pack");
        } else {
          req.flash("success", "Question added to pack");
          console.log("pack updated successfully");
          res.redirect(`/admin/pack/${pack.name}`);
        }
      })
    }
  })
};

// TODO:
function getEditQuestion (req, res) {
  let _id = req.params.id;
  Question.findOne({_id}).exec().then((question) => {
    let url =`/admin/question/${question._id}/edit`
    res.render("admin/editQuestion", { question, url })
  }).catch((err) => {
    req.flash("error", "unable to get question details");
    res.redirect("/admin/pack");
  })
}


function editQuestion (req, res) {
  let _id = req.params.id;
  let question = req.body.question;
  let optionA = req.body.optionA;
  let optionB = req.body.optionB;
  let optionC = req.body.optionC;
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

  const errors = req.validationErrors();
  if (errors) {
    req.flash("failure", errors[0].msg)
    res.redirect("/admin/pack");
    return;
  }

  Question.findOneAndUpdate({ _id }, {
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer,
  }).exec().then((question) => {
    req.flash("message", "Question successfully edited");
    res.redirect("/admin/pack");
  }).catch((err) => {
    req.flash("error", "unable to edit question");
    res.redirect("/admin/pack");
  })
}


function deleteQuestion (req, res) {
  const _id = req.params.id;
  Question.find({ _id }).exec(function (err, question) {
    if (err) {
      req.flash("error", "An error occured");
      res.redirect("/admin/pack");
      return;
    }
    let name = question[0].pack;
    Pack.update(
      { name },
      { $pull: { questions: _id } },
      function (err, pack) {
        if (err) {
          req.flash("error", "An error occured");
          res.redirect("/admin/pack");
          return;
        }
        Question.remove({ _id }).exec(function (err) {
          if (err) {
            req.flash("error", "An error occured");
            res.redirect("/admin/pack");
            return;
          }
          res.send("Question successfully deleted");
        })
      }
    )
  })
}


function getPackList (req, res) {
  Pack.find({}, {"name": 1}, function (err, packs) {
    if (err) {
      console.log(err);
      req.flash("failure", "unable to fetch question packs");
      res.render("admin/admin");
    } else {
      res.render("admin/packList", {packs});
    }
  })
}

function deletePack (req, res) {
  const name = req.params.name;
  helpers.deleteFromDb(Pack, { name }, function (err, removed) {
    if (err) {
        req.flash("failure", "Could not delete pack");
        res.redirect("admin/pack");
      } else {
        helpers.deleteFromDb(Question, { pack: name }, function (err, removed) {
          if (err) {
              req.flash("failure", "Could not delete question associated with pack");
              res.redirect("admin/pack");
            }
        })
        res.send("Pack deleted");
      }
  })
}



// News Section
function listNews (req, res) {
  NewsItem.find({}).sort({ _id: -1 }).exec(function (err, news) {
    if (err) {
      req.flash("failure", "Unable to fetch list items");
      res.render("/admin");
    } else {
      res.render("admin/news", { news });
    }
  })
};

function addNews (req, res) {
  const title = req.body.title;
  const body = req.body.body;

  req.checkBody("title", "Please provide title for news").notEmpty();
  req.checkBody("body", "Please provide news body").notEmpty();

  req.sanitizeBody("title").trim();
  req.sanitizeBody("title").escape();
  req.sanitizeBody("body").trim();
  req.sanitizeBody("body").escape();

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors[0].msg);
    res.redirect("/admin/news");
    return;
  }

  let news = new NewsItem({ title, body });
  news.save(function(err, news) {
    if (err) {
      req.flash("failure","Unable to save news item");
      res.redirect("/admin/news");
      return;
    }
    req.flash("success", "News item saved");
    res.redirect("/admin/news");
  })
}

function deleteNews (req, res) {
  const newsId = req.params.id;
  NewsItem.findByIdAndRemove(newsId, function (err, done) {
    if (err){
      req.flash("failure", "Unable to delete news Item")
      res.render("/admin");
      return;
    }
    res.send("news item deleted");
  });
}


function getEditNews (req, res) {
  const _id = req.params.id;
  NewsItem.findOne({ _id }, function (err, newsItem) {
    if (err) {
      req.flash("failure", "Failed to fetch News Item");
    }
    else
      res.render("admin/editNews", { newsItem });
  });
}

function editNews (req, res, next) {
  const _id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;

  req.checkBody("title", "Title cannot be empty").notEmpty();
  req.sanitizeBody("title").trim();
  req.sanitizeBody("title").escape();
  req.checkBody("body", "News content cannot be empty").notEmpty();
  req.sanitizeBody("body").trim();
  req.sanitizeBody("body").escape();

  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors[0].msg)
    res.redirect("/admin/news");
    return;
  }

  NewsItem.findOneAndUpdate({ _id },
    { title, body },
    function (err, newsItem) {
      if (err) {
        req.flash("failure", "Could not update News Item");
        res.redirect("/admin/news");
      }
      else {
        req.flash("success", "NewsItem successfully edited");
        res.redirect("/admin/news");
      }
    }
  );
}

// Authentication token section

function generateToken (maxUse, file, printToFile) {
  // 12 digit token numbers. 9e+11 possibilities
  const min = 100000000000;
  const max = 999999999999;
  const token =  Math.floor(Math.random() * (max -min) + min);
  return Token.count({ token }).then( count => {
    if ( count > 0 ) {
      generateToken(maxUse);
    }
    return Token.create({ token, maxUse });
  }).then(savedToken => {
    return generateSerial(savedToken._id)
  }).catch(err => {
    console.log(err.stack);
    return;
  })
}

function generateSerial (tokenId, file) {
  // 16 digit serial numbers. 9e+15 possibilities
  const min = 1000000000000000;
  const max = 9999999999999999;
  let serial =  Math.floor(Math.random() * (max - min) + min);
  // check for existence of serial without retrieving it
  return Token.count({ serial }).then( count => {
    if ( count > 0 ) {
      generateSerial(maxUse);
    }
    return Token.findOneAndUpdate(
      { _id: tokenId }, { $set: { serial } }
    ).exec(
      function (err, token) {
        if (err) {
          console.log(err.stack);
          return;
        }
        return token;
      }
    )
  })
}


function createToken (req, res) {
  console.log(req.body);
  let count = 0
  let total = req.body.total;
  let maxUse = req.body.maxUse;

  async.whilst(
    () => total > 0,
    (callback) => {
      generateToken(maxUse).then(token => {
        total--;
        count++;
        callback(null, token);
      }).catch(err => callback(err));
    },
    function callback (err) {
      if (err) throw err;
      if (count > 1) {
        returnTokenBatch(res, count);
        return;
      } else{
        // ONLY SINGLE TOKEN REQUEST FROM USER. Handle by Purchase
      }
      // console.log(token);
      // req.flash("message", "Tokens created");
      // res.redirect("/admin");
    }
  );
}


function returnTokenBatch(res, count) {
  let filename = Date.now().toString() + '.txt';
  let batch = Token.find({}, {token: 1, serial: 1, _id: 0})
              .sort({_id: -1})
              .limit(count)
              .exec();
  batch.then((tokens) => {
    async.each(
      tokens,
      function (token, callback) {
        let data = `token: ${token.token}, serial: ${token.serial}\n`;
        appendFile(filename, data, "utf8", function (err) {
          if (err) {
            callback(err);
          }
          callback();
        })
      },
      function (err) {
        if (err) {
          res.end("An error occured");
          return;
        }
        res.send(filename);
        return;
      }
    )
  })
}


function showToken(req, res) {
  let filename = req.params.filename;
  req.sanitizeParams("filename");
  const path = require('path');
  let options = { root: path.dirname(__dirname), }
  res.sendFile(`./${filename}`, options);
}


function resetSeason(req, res) {
  let institution = req.body.institution;
  req.checkBody("institution", "select an institution to reset season").notEmpty();
  req.sanitizeBody("institution").trim();
  req.sanitizeBody("institution").escape();
  const errors = req.validationErrors();
  if (errors) {
    req.flash("error", errors[0].msg);
    res.redirect("/admin");
    return;
  }
  Institution.findOne({institution}).exec().then((institution) => {
    User.find({institution: institution._id}).exec().then((users) => {
      async.each(
        users,
        function (user, callback) {
          user.virtualQuiz = { score: 0, time: 0, attempts: 0 };
          user.scholarsCup = { score: 0, time: 0, attempts: 0 };
          user.scholarsBowl = { score: 0, time: 0, attempts: 0 };
          user.educationGrant = { score: 0, time: 0, attempts: 0 };
          user.save()
          callback();
        },
        function (err) {
          if (err) {
            req.flash("error", "An error occured while resetting season");
            return;
          }
          req.flash("message", `Season successfully reset for ${institution.institution}`);
          res.redirect("/admin");
          return;
        }
      )
    })

  })
}



module.exports = {
  getAdmin,
  getUsers,
  makeStaff,
  addInstitution,
  getEditInstitution,
  editInstitution,
  getInstitutions,
  deleteInstitution,
  getPack,
  getPackList,
  deletePack,
  createPack,
  addQuestionToPack,
  getEditQuestion,
  editQuestion,
  deleteQuestion,
  listNews,
  addNews,
  getEditNews,
  editNews,
  deleteNews,
  generateToken,
  generateSerial,
  createToken,
  showToken,
  resetSeason,
};
