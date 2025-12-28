const Log = require("../models/Log");

module.exports = async function (admin, action, target) {
  await Log.create({
    admin,
    action,
    target
  });
}
