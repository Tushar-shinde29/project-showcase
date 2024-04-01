var mysql=require('mysql');
const express=require('express');
const ejs=require('ejs');
const app=express();
let url=require('url');


let os=0;
let tpage=Math.floor(50585/15);
let page=1;
app.set('view engine','ejs');

const pagination=(req,res)=>{
    var con=mysql.createConnection({host:"localhost",user:"root",password:"root"});
    let data=[];
    con.connect(function(err) {
        if(err) throw err;
            console.log("connet");

             //create db
            // con.query("create database db26",function (err,result){
            //     if(err) throw err;
            //     console.log("db created");
            // });

            //use db;
            var q="use indextrail";
            con.query(q,function(err) {
                if(err) throw err;
                    // console.log("use indextrail");
            });

            var sp=url.parse(req.url,true).query;
            console.log(sp);
            var page=sp.pageno;
            if(page==undefined || sp.oby==undefined ){
                page=1;
                console.log("page no is"+page);
                console.log("order by"+sp.oby);
                var sq="select * from student1 limit ?,200";
                con.query(sq,[[page-1]],function(err,result){
                if(err) throw err;
                res.render('com1',{pn:1,data:result,oby:'rollno'});
            });
            }
            else{
            // console.log("order by"+sp.oby);
            // console.log("page on 2nd" + sp.pageno);
            page=sp.pageno;
            var o=(page-1)*200;
            var sq=`select * from student1  order by ${sp.oby} limit ?,200`;
            // console.log(o);
            con.query(sq,[[o]],function(err,result){
                if(err) throw err;
                res.render('com1',{pn:page,data:result,oby:sp.oby});
                // console.log('------');
            });
            }
        });
};
module.exports={
    pagination,
}


   


     