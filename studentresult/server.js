var mysql=require('mysql');
const express=require('express');
const ejs=require('ejs');
const app=express();
let url=require('url');

app.set('view engine','ejs');

const result=(req,res)=>{
    var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26'});
    let data=[];
    var sp=url.parse(req.url,true).query;
    if(typeof sp.pageno=='undefined')
    {
        sp.pageno=1;
    }
    else
    {
        sp.pageno=sp.pageno;
    }

    var o=(sp.pageno-1)*15;
    con.connect(function(err) {
        if(err) throw err;
            console.log("connet");

        // var q="select * from exammaster";
        var q=`select studentmaster.id,studentmaster.firstname,
        sum(case when exammaster.eid=1 then practicalmarks end) prelimpra,
        sum(case when exammaster.eid=1 then theorymarks end) prelimth,
        sum(case when exammaster.eid=2 then practicalmarks end) terminalpra,
        sum(case when exammaster.eid=2 then theorymarks end) terminalth,
        sum(case when exammaster.eid=3 then practicalmarks end) finalpra,
        sum(case when exammaster.eid=3 then theorymarks end) finalth,
        sum(practicalmarks) as totalp,sum(theorymarks) as totalt,(sum(practicalmarks)+sum(theorymarks)) as total
        FROM studentmaster left join exammaster on studentmaster.id=exammaster.id group by id limit ?,15;`
        con.query(q,[[o]],function(err,result){
        if(err) throw err;
        // console.log(result[3].pr);
        // console.log(result[1]);
        res.render('result',{data:result,pn:sp.pageno});
        console.log('------');
    });
    });
};

const individualresult=(req,res)=>{
    var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26'});
    let data=[];
    var sp=url.parse(req.url,true).query;
    con.connect(function(err) {
        if(err) throw err;
            console.log("connet");
        // var q="select * from exammaster";
        var q=`select studentmaster.id,concat(studentmaster.firstname," ",studentmaster.middlename," ",studentmaster.lastname) as NAME,exammaster.sid,subject.sname,
        sum(case when exammaster.eid=1 then practicalmarks end) prelimpractical,
        sum(case when exammaster.eid=1 then theorymarks end) prelimtheory,
        sum(case when exammaster.eid=2 then practicalmarks end) terminalpractical,
        sum(case when exammaster.eid=2 then theorymarks end) terminaltheory,
        sum(case when exammaster.eid=3 then practicalmarks end) finalpractical,
        sum(case when exammaster.eid=3 then theorymarks end) finaltheory,
        (select ROUND((count(attendencemaster.id)/90)*100,2) as pr from attendencemaster  where attendencemaster.present_absent='P' group by attendencemaster.id having id=?) as atpr
        FROM studentmaster left join exammaster on studentmaster.id=exammaster.id left join subject on exammaster.sid=subject.sid group by sid,id having id=? order by sid;`
        con.query(q,[sp.rollno,sp.rollno],function(err,result){
        if(err) throw err;
        // console.log(result[3].pr);
        console.log(result);
        res.render('sresult',{data:result});
        console.log('------');
    });
    });
};
module.exports={
    result,
    individualresult,
}

// app.get('/',(req,res)=>{
//     var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26'});
//     let data=[];
//     var sp=url.parse(req.url,true).query;


//     var o=(sp.pageno-1)*15;
//     con.connect(function(err) {
//         if(err) throw err;
//             console.log("connet");

//         // var q="select * from exammaster";
//         var q=`select studentmaster.id,studentmaster.firstname,
//         sum(case when exammaster.eid=1 then practicalmarks end) prelimpra,
//         sum(case when exammaster.eid=1 then theorymarks end) prelimth,
//         sum(case when exammaster.eid=2 then practicalmarks end) terminalpra,
//         sum(case when exammaster.eid=2 then theorymarks end) terminalth,
//         sum(case when exammaster.eid=3 then practicalmarks end) finalpra,
//         sum(case when exammaster.eid=3 then theorymarks end) finalth,
//         sum(practicalmarks) as totalp,sum(theorymarks) as totalt,(sum(practicalmarks)+sum(theorymarks)) as total
//         FROM studentmaster left join exammaster on studentmaster.id=exammaster.id group by id limit ?,15;`
//         con.query(q,[[o]],function(err,result){
//         if(err) throw err;
//         // console.log(result[3].pr);
//         // console.log(result[1]);
//         res.render('result',{data:result,pn:sp.pageno});
//         console.log('------');
//     });
//     });
// });
// app.get('/result',(req,res)=>{
//     var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'db26'});
//     let data=[];
//     var sp=url.parse(req.url,true).query;
//     con.connect(function(err) {
//         if(err) throw err;
//             console.log("connet");
//         // var q="select * from exammaster";
//         var q=`select studentmaster.id,concat(studentmaster.firstname," ",studentmaster.middlename," ",studentmaster.lastname) as NAME,exammaster.sid,subject.sname,
//         sum(case when exammaster.eid=1 then practicalmarks end) prelimpractical,
//         sum(case when exammaster.eid=1 then theorymarks end) prelimtheory,
//         sum(case when exammaster.eid=2 then practicalmarks end) terminalpractical,
//         sum(case when exammaster.eid=2 then theorymarks end) terminaltheory,
//         sum(case when exammaster.eid=3 then practicalmarks end) finalpractical,
//         sum(case when exammaster.eid=3 then theorymarks end) finaltheory,
//         (select ROUND((count(attendencemaster.id)/90)*100,2) as pr from attendencemaster  where attendencemaster.present_absent='P' group by attendencemaster.id having id=?) as atpr
//         FROM studentmaster left join exammaster on studentmaster.id=exammaster.id left join subject on exammaster.sid=subject.sid group by sid,id having id=? order by sid;`
//         con.query(q,[sp.rollno,sp.rollno],function(err,result){
//         if(err) throw err;
//         // console.log(result[3].pr);
//         console.log(result);
//         res.render('sresult',{data:result});
//         console.log('------');
//     });
//     });
// });
// app.listen(8080);