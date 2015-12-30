var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
    userid: String,
    password: String,
    username: String,
    isadmin: String,
    oAuthkey:String,
    files: [String],
    created:String
},{ collection: 'User' });

module.exports = mongoose.model('User', UserSchema);