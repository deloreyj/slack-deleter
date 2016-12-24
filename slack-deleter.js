var http = require("https");

var token = '';//Add token here

var today = new Date();
var thirtyDaysAgo = Math.floor(today.setDate(today.getDate()-150) / 1000);

var host = 'slack.com';
var getPath = '/api/files.list?token=' + token + '&ts_to=' + thirtyDaysAgo + '&count=1000';

var fileIDs = []

var options = {
  "method": "GET",
  "hostname": host,
  "port": null,
  "path": getPath,
  "headers": {
    "cache-control": "no-cache"
  },
  "timeout": 50000
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = JSON.parse(Buffer.concat(chunks));
    var files = body.files;
    for (var i = 0; i < files.length; i++) {
      fileIDs.push(files[i].id);
    }
    console.log(fileIDs.length);
    deleteFiles(fileIDs);
  });
});

req.end();

function deleteFiles(ids) {
  var totalFiles = ids.length;
  for (var i = 0; i < ids.length; i++) {
    deleteRequest(ids[i], i, totalFiles);
  }
}

function deleteRequest(id, count, totalFiles) {
  var options = {
    "method": "GET",
    "hostname": "slack.com",
    "port": null,
    "path": "/api/files.delete?token=" + token + "&file=" + id,
    "headers": {
      "cache-control": "no-cache",
      "postman-token": "85a6dc06-7c93-02c9-e107-9c15494178c5"
    },
    "timeout": 50000
  };

  var req = http.request(options, function (res) {
    var chunks = [];
    
    res.on("data", function (chunk) {
      var response = JSON.parse(chunk.toString())['ok'];
      console.log(count + ' of ' + totalFiles + ' - ' + id + ' ' + response);
    });

  });

  req.end();
}