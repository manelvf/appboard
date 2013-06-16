
Meteor.require("node-uuid");

Images = new Meteor.Collection("Images");
Comments = new Meteor.Collection("Comments");

Session.setDefault("uploadStatus", "loading");

Meteor.methods({
  saveFile: function(blob, name, path, encoding) {
    var path = cleanPath(path), fs = Npm.require('fs'),
      name = cleanName(name || 'file'), encoding = encoding || 'binary',
      chroot = Meteor.chroot || 'public';
    // Clean up the path. Remove any initial and final '/' -we prefix them-,
    // any sort of attempt to go to the parent directory '..' and any empty directories in
    // between '/////' - which may happen after removing '..'
    path = chroot + (path ? '/' + path + '/' : '/');

    Session.set("uploadStatus", "loading");

    var u = uuid.v4();
    console.log(u);
    
    // TODO Add file existance checks, etc...
    fs.writeFile(path + u, blob, encoding, function(err) {
      if (err) {
        Session.set("uploadStatus", "error");
        throw (new Meteor.Error(500, 'Failed to save file.', err));
      } else {
        Session.set("uploadStatus", "uploaded");
        Images.insert({'image': u});
        console.log('The file ' + name + ' (' + encoding + ') was saved to ' + path);
      }
    }); 

    function cleanPath(str) {
      if (str) {
        return str.replace(/\.\./g,'').replace(/\/+/g,'').
          replace(/^\/+/,'').replace(/\/+$/,'');
      }
    }
    function cleanName(str) {
      return str.replace(/\.\./g,'').replace(/\//g,'');
    }
  }
});


