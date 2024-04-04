const path = require('path');
var fs = require('fs');
var url = require('url');
const studentform = (req, res) => {
    res.render('form');
};
const writefile = (req, res) => {
    try {
        data = JSON.parse(fs.readFileSync('data.json'));
    }
    catch {
        data = [];
    }
    data.push(req.body);
    // console.log(data);
    fs.writeFile('data.json', JSON.stringify(data), function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    res.render('details', { data: data });

};
const readfile = (req, res) => {
    var sp = url.parse(req.url, true).query;
    try {
        data = JSON.parse(fs.readFileSync('data.json'));
    }
    catch {
        console.log("error");
    }
    const md = data[sp.id];
    console.log(md);
    res.render('md', { md: md });
};

const showdata1 = (req, res) => {
    data = JSON.parse(fs.readFileSync('data.json'));
    res.render('details', { data: data });
};
module.exports = {
    showdata1,
    readfile,
    studentform,
    writefile,
}