var express=require('express');
var app=express();
let url=require('url');
const { querydata } = require('../model/attendenceorederbyquery');
app.use(express.static(__dirname + "/public"));

app.use(express.static('views'));

var pageno,tp,tr;
app.set('view engine','ejs');
const attendenceorderby=async (req,res)=>{
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
    let o=(pageno-1)*15;
    const results=await querydata(month,o,sp.oby,sp.order);
    if(!(results==null))
    {
            tr=results[0].length;
            tp=Math.ceil(tr/15);
            if(tr>0 && (pageno>0 && pageno<=tr))
            {
                res.render('page1',{data:results[1],pn:pageno,tp:tp,tr:tr,month:month,oby:sp.oby,order:sp.order});
            }
            else
            {
                res.send("pls enter valid data");
            }
    }
    else
    {
        res.send("pls enter valid data");
    }
};
module.exports={
    attendenceorderby,
}
