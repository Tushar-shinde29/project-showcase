var mysql=require('mysql');
const express=require('express');
const ejs=require('ejs');
const app=express();
let url=require('url');

app.set('view engine','ejs');

const attendencegrid=(req,res)=>{
    var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26'});
    let data=[];
    var sp=url.parse(req.url,true).query;
    if (typeof sp.month=='undefined') {
        sp.pageno=1;
    }
    else
    {
        sp.pageno=sp.pageno;
    }
    con.connect(function(err) {
        if(err) throw err;
            // console.log("connet");
    var o=(sp.pageno-1)*15;
    console.log(sp.month);
    if (typeof sp.month=='undefined') {
        sp.month=12;
    }
    else
    {
        sp.month=sp.month;
    }
    var q="select attendencemaster.id,studentmaster.firstname,count(attendencemaster.id) as present,ROUND((count(attendencemaster.id)/31)*100,2) as pr from studentmaster left join attendencemaster on studentmaster.id=attendencemaster.id where attendencemaster.present_absent='P' AND Month(attendencemaster.pdate)=? group by attendencemaster.id limit ?,15";
    con.query(q,[sp.month,o],function(err,result){
        if(err) throw err;
        // console.log(result[3].pr);
        res.render('attendence',{data:result,pn:sp.pageno,month:sp.month});
        // console.log('------');
    });
    });
};
module.exports={
    attendencegrid
}











