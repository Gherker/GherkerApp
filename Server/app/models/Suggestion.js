var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SuggestionSchema   = new Schema({
    featureName: String
},{ collection: 'Suggestions' });

module.exports = mongoose.model('Suggestion', SuggestionSchema);