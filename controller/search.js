var express=require('express');
var app=express();
var mysql=require('mysql');
var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26',multipleStatements:true});
let url=require('url');


// For parsing application/json
app.use(express.json());
 
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));
con.connect(function(err){
    if (err) {
        Console.log(err);
    }
    else{
        console.log('connect');
    }
});

app.use(express.static('views'));

var result,pageno,tp,tr,msg;
app.set('view engine','ejs');
const search=(req,res)=>{
    let sp=url.parse(req.url,true).query;
    if(sp.pageno==undefined){
        pageno=1;
    }
    else
    {
        pageno=sp.pageno;
    }
    if(req.method=='POST')
    {
        var sp1=req.body;
        if(typeof sp1.search!=undefined && sp1.search.trim()!=='')
        {
            var q=`select * from studentmaster where id=${sp1.search}`;
        }
        else
        {
            var q=`select * from studentmaster where firstname like '%${sp1.firstname}%' AND city like '%${sp1.city}%' AND contactno like '%${sp1.mobileno}%';`;
        }      
            pageno=1;
            let o=(pageno-1)*15;
            con.query(q,function(err,result){
                if(err) throw err;
            tr=result.length;
            tp=Math.ceil(tr/15);
            console.log(q);
            console.log(tr);
            console.log(tp);
            if(tr>0)
            {
                res.render('page',{data:result,pn:pageno,tp:tp,tr:tr,c:sp1.count});
            }
            else
            {
                res.render('error');
            }
        });
    }
    else{
        // var q=`select * from studentmaster`;
        var q=`SELECT id,firstname,lastname,middlename,date_format(dob, '%Y/%m/%d') as dob,contactno,address,city FROM db26.studentmaster`;
        let o=(pageno-1)*15;
        con.query(`${q};${q} limit ?,15`,[o],function(err,results){
            if(err) throw err;
        tr=results[0].length;
        tp=Math.ceil(tr/15);
        if(tr>0)
        {
            res.render('page',{data:results[1],pn:pageno,tp:tp,tr:tr,c:0});
        }
        else
        {
            res.render('error');
        }
        });
    }
};
module.exports={
    search,
}
