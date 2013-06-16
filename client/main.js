Session.set("uploadStatus", "void");

Template.uploadForm.events( {
  'change input': function(ev) {
    _.each(ev.target.files, function(file) {
      App.saveFile(file, file.name);
    });
  }
});

Template.uploadForm.uploadStatus = function () {
  return Session.get("uploadStatus");
};

var App = {
	saveFile: function(blob, name, path, type, callback) {
		var fileReader = new FileReader(),
		method, encoding = 'binary', type = type || 'binary';

		switch (type) {
			case 'text':
				// TODO Is this needed? If we're uploading content from file, yes, but if it's from an input/textarea I think not...
				method = 'readAsText';
				encoding = 'utf8';
				break;
			case 'binary':
				method = 'readAsBinaryString';
				encoding = 'binary';
				break;
			default:
				method = 'readAsBinaryString';
				encoding = 'binary';
				break;
		}
		fileReader.onload = function(file) {
			Meteor.call('saveFile', file.target.result, name, path, encoding, callback);
		}
		fileReader[method](blob);
	},
        uploadForm: function(data) {
		Template.uploadForm.apply(data);
        }
}
