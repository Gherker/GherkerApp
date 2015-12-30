var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var FeatureSchema   = new Schema({
    featureName: String
},{ collection: 'Features' });

module.exports = mongoose.model('Feature', FeatureSchema);