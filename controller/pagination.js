const express = require('express');
const ejs = require('ejs');
const app = express();
let url = require('url');
const { allstudentdata, orderdata } = require('../model/paginationquery');
app.set('view engine', 'ejs');

var totalrecord = null;
var columnname = ['rollno', 'sname', 'sem', 'mobileno', 'address'];
const pagination = async (req, res) => {
    var sp = url.parse(req.url, true).query;
    var page = sp.pageno;
    if (page == undefined || sp.oby == undefined) {
        page = 1;
        var result = await allstudentdata(parseInt(page));
        if (!(result == null)) {
            totalrecord = result[0].length;
            res.render('com1', { pn: 1, data: result[1], oby: 'rollno' });
        }
        else {
            res.send("pls enter valid data");
        }
    }
    else {
        page = sp.pageno;
        if ((page > 0 && page <= Math.ceil(totalrecord / 200)) && columnname.includes(sp.oby)) {
            var o = (page - 1) * 200;
            var result = await orderdata(sp.oby, parseInt(o));
            if (!(result == null)) {
                res.render('com1', { pn: page, data: result, oby: sp.oby });
            }
            else {
                res.send("pls enter valid data");
            }
        }
        else {
            res.send("pls enter valid data");
        }
    }
};
module.exports = { pagination };