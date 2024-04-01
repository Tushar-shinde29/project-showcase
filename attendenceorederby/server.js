var mysql=require('mysql');
var express=require('express');
var app=express();
let url=require('url');
var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26',multipleStatements:true});
var data=[];
app.use(express.static(__dirname + "/public"));

con.connect(function(err){
    if (err) {
        Console.log(err);
    }
    else{
        console.log('connect');
    }
});

app.use(express.static('views'));

var result,pageno,tp,tr,oby,order;
app.set('view engine','ejs');
const attendenceorderby=(req,res)=>{
    let sp=url.parse(req.url,true).query;
    if(sp.pageno==undefined){
        pageno=1;
    }
    else
    {
        pageno=sp.pageno;
    }
    if(sp.month==undefined){
        month=12;
    }
    else
    {
        month=sp.month;
    }
    if(sp.oby==undefined)
    {
        sp.oby='id';
    }
    else
    {
        sp.oby=sp.oby;
    }
    if(sp.order==undefined)
    {
        sp.order='ASC';
    }
    else
    {
        sp.order=sp.order;
    }
    console.log(oby);
    let o=(pageno-1)*15;
    var q=`select attendencemaster.id,studentmaster.firstname,count(attendencemaster.id) as present,ROUND((count(attendencemaster.id)/31)*100,2) as pr from studentmaster left join attendencemaster on studentmaster.id=attendencemaster.id where attendencemaster.present_absent='P' AND Month(attendencemaster.pdate)=? group by attendencemaster.id Order by ${sp.oby} ${sp.order}`
    con.query(`${q};${q} limit ?,15`,[month,month,o],function(err,results){
        if(err) throw err;
    tr=results[0].length;
    tp=Math.ceil(tr/15);
    console.log(tr);
    console.log(tp);
    console.log(results[1][0]);
    res.render('page1',{data:results[1],pn:pageno,tp:tp,tr:tr,month:month,oby:sp.oby,order:sp.order});
});
};
module.exports={
    attendenceorderby,
}
