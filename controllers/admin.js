const Pack = require("../models/pack");
const Question = require("../models/question");
const NewsItem = require("../models/news");

const User = require("../models/user");
const Institution = require("../models/institution");

const Token = require("../models/token");
const Serial = require("../models/serial");

const helpers = require("../utils/helpers");


const getUsers = function (req, res) {
  User.find({}, function(err, users) {
    if (err) {
      console.log(err);
      req.flash("failure", "error fetching users");
      res.render("admin/admin");
    } else {
      res.render("users-list", { users });
    }
  })
}


const getAdmin = function (req, res) {
  res.render("admin/admin");
}


// Institution

const addInstitution = function (req, res) {
  console.log(req.body);
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

const getEditInstitution = function (req, res) {
  const _id = req.params.id;
  Institution.findOne({ _id }, function (err, institution) {
    if (err) console.log(err);
    else
      res.render("admin/editInstitution", { institution });
  });
}


const editInstitution = function (req, res) {
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


const deleteInstitution = function (req, res) {
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

const createPack = function (req, res) {
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


const getPack = function (req, res) {
  let name = req.params.name;
  Pack.findOne({ name }).populate('questions').exec(function (err, pack) {
    if (err) {
      console.log(err);
      req.flash("failure", "unable to fetch question pack");
      res.redirect("/admin");
    } else {
      res.render("admin/pack", {pack});
    }
  })
};


const addQuestionToPack = function (req, res) {
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
// const editQuestion = function (req, res) {
//
// }


const getPackList = function (req, res) {
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

const deletePack = function (req, res) {
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
const listNews = function (req, res) {
  NewsItem.find({}).sort({ _id: -1 }).exec(function (err, news) {
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

  req.checkBody("title", "Please provide title for news").notEmpty().isAlpha();
  req.checkBody("body", "Please provide news body").notEmpty().isAlpha();

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
      console.log("UNABLE TO SAVE NEWS ITEM TO DB", err);
      req.flash("failure","Unable to save news item");
      res.redirect("/admin/news");
      return;
    }
    req.flash("success", "News item saved");
    res.redirect("/admin/news");
  })
}

const deleteNews = function (req, res) {
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


const getEditNews = function (req, res) {
  const _id = req.params.id;
  NewsItem.findOne({ _id }, function (err, newsItem) {
    if (err) {
      req.flash("failure", "Failed to fetch News Item");
    }
    else
      res.render("admin/editNews", { newsItem });
  });
}

const editNews = function (req, res, next) {
  const _id = req.params.id;
  let title = req.body.title;
  let body = req.body.body;

  req.checkBody("title", "Title cannot be empty").notEmpty().isAlpha();
  req.sanitizeBody("title").trim();
  req.sanitizeBody("title").escape();
  req.checkBody("body", "News content cannot be empty").notEmpty().isAlpha();
  req.sanitizeBody("body").trim();
  req.sanitizeBody("body").escape();

  const errors = req.validationErrors();
  console.log(errors);
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

const generateToken = function (number) {
  // 12 digit token numbers
  const min = 100000000000;
  const max = 999999999999;
  const token =  Math.floor(Math.random() * (max -min) + min);
  // ensure token doesn't exit exist in db before saving
  Token.count({ token }, function (err, count) {
    if (count > 0) {
      generateToken() ;
    } else {
      let newToken = new Token({ token });
      newToken.save(function (err, savedToken) {
        if (err) {
          console.log(err);
          return;
        } else {
          generateSerial(savedToken._id);
        }
      })
    }
  })
}


const generateSerial = function (tokenId) {
  // 16 digit serial numbers
  const min = 1000000000000000;
  const max = 9999999999999999;
  let serial =  Math.floor(Math.random() * (max - min) + min);
  // check for existence of serial without retrieving it
  Serial.count({ serial }, function (err, count) {
    if (count > 0) {
      generateSerial(tokenId);
    } else {
      let newSerial = new Serial({ serial });
      newSerial.token = tokenId;
      newSerial.save(function (err, savedSerial) {
        if (err) {
          console.log(err);
          return;
        }
      })
    }
  })
}


module.exports = {
  getAdmin,
  getUsers,
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
  listNews,
  addNews,
  getEditNews,
  editNews,
  deleteNews,
  generateToken,
  generateSerial,
};
