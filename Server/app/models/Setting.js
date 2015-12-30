var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SettingSchema   = new Schema({
    appid: String,
    appname: String,
    sourceType: String,
    sourceUrl: String,
    sourcePath: String,
    username: String,
    password: String,
    userdomain: String,
    created:String
},{ collection: 'Settings' });

module.exports = mongoose.model('Setting', SettingSchema);