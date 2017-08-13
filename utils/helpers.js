function deleteFromDb (model, options, cb) {
  model.remove(options, function (err, removed) {
    if (err) cb(err);
    else {
      cb(null, removed);
    }
  })
}


module.exports = {
  deleteFromDb,
};
