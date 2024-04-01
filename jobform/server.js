var mysql=require('mysql');
var url=require('url');
// const cors = require('cors');
var express=require('express');
const bodyparser = require('body-parser')
var app=express();
app.set('view engine','ejs');
app.use(express.static(__dirname + "/public"));
// app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'job_app',multipleStatements:true});
con.connect(function(err){
    if (err) throw err;
    console.log('connect');
});
function execute(q)
{
    return new Promise((resolve,reject)=>{
        con.query(q,function(err,result){
            if (err) return reject(err);
            resolve (result);
        });
    })
}

const data=async (req,res)=>{
        var q=`select name from states order by name`;
        result=await execute(q);
        res.setHeader('content-Type','application/json');
        res.json(result);
};


const citydata=async (req,res)=>{
    var sp=url.parse(req.url,true).query;
    var q=`select city from cities where state_id=(select id from states where name='${sp.cn}') `;
    result=await execute(q);
    res.setHeader('content-Type','application/json');
    res.json(result);
};


const jobform=(req,res)=>{
    res.render('job');
};




const showdata=async (req,res)=>{
    var q="select eno,fname,lname from detail where eno>25";
    await execute(q).then((result)=>{
        empdetails=result;
    });
    res.json(empdetails);
};



const emp=async (req,res)=>{
    console.log("emp no",req.body.id);
    var eno=req.body.id;
    var sq=`select eno,fname,lname,designation,gender,relation_status,mobile,email,DATE_FORMAT(dob, "%Y-%m-%d") as dob,address,city,state,pin from detail where eno=${eno}`;

    await execute(sq).then((result)=>{
        basicdetail=result[0];
    });
    if(!(basicdetail==[]))
    {
    var sq2=`select oname as course,boardoruniversity_name as boarduname,passing_year as passyear,percentage from education1 left join opt on opt.opid=education1.opid where eno=${eno}`;
    await execute(sq2).then((result)=>{
        education=result;
    });

    var sq3=`select comapanyname,padesignation,DATE_FORMAT(doj, "%Y-%m-%d") as doj,DATE_FORMAT(doe, "%Y-%m-%d") as doe from workexp where eno=${eno} `;
    await execute(sq3).then((result)=>{
        workexp=result;
    });
    var sq4=`select name,contact,relation from ref  where eno=${eno}`;
    await execute(sq4).then((result)=>{
        reference=result;
    });
    var sq5=`select plocation,notice,expectedctc,currentctc,department from prefer  where eno=${eno}`;
    await execute(sq5).then((result)=>{
        preference=result[0];
    });
    var sq6=`select opt.oname as language,lread,lwrite,speak from knownlanguages left join opt on opt.opid=knownlanguages.opid where eno=${eno}`;
    await execute(sq6).then((result)=>{
        language=result;
    });
    var sq7=`select opt.oname,expertise from knowntechnology left join opt on opt.opid=knowntechnology.opid where eno=${eno}`;
    await execute(sq7).then((result)=>{
        technology=result;
    });
    }
    console.log(language);
    var details={};
    details['basicdetail']=basicdetail;
    details['education']=education;
    details['experience']=workexp;
    details['language']=language;
    details['technology']=technology;
    details['reference']=reference;
    details['preference']=preference;





    // console.log(details);
    res.setHeader('Content-Type','application/json');
    res.status(200).json(details);
};


const insert=async (req,res)=>{
    //console.log(data);
    var data=req.body;

    //basic details
    var q=`insert into detail (fname,lname,designation,gender,relation_status,mobile,email,dob,address,city,state,pin) values ("${data.fname}",'${data.lname}','${data.Designation}','${data.Gender}','${data.relstatus}','${data.Phone}','${data.Email}','${data.dob}','${data.Address1},${data.Address2}','${data.city}','${data.state}','${data.pincode}')`;
    var eno;
    await execute(q).then((result)=>{
        eno=result.insertId;
        console.log("basic details");
    }).catch(err =>{
        console.log(err);
    });;

    console.log(eno);

    var companyname=data.comname;
    var designation=data.cdesignation;
    var from=data.cdfrom;
    var to=data.ctodate;
    var refname=data.rname;
    var refcontact=data.rcontact;
    var refrelation=data.rrelation;
    var course=data.course;
    var passyear=data.passyear;
    var boarduname=data.boarduname;
    var percentage=data.percentage;

    //eduction-------------------------------
    for(i=0;i<course.length;i++)
    {
        if(!(course[i].trim()=='' && passyear[i].trim()=="" && boarduname[i].trim()=="" && percentage[i].trim()==""))
        {
            var q7=`insert into education1 (eno,sid,opid,boardoruniversity_name,passing_year,percentage) values (${eno},(select sid from opt where oname='${course[i]}'),(select opid from opt where oname='${course[i]}'),'${data.boarduname[i]}',${data.passyear[i]},${data.percentage[i]})`;
            await execute(q7).then((result)=>{
                console.log("education details");
            }).catch(err =>{
                console.log(err);
            });
        }
    }
    //work experience-------------------
    for(i=0;i<companyname.length;i++)
    {
        if(!(companyname[i].trim()=='' && designation[i].trim()=="" && from[i].trim()=="" && to[i].trim()==""))
        {
            var q3=`insert into workexp (eno,comapanyname,padesignation,doj,doe) value (${eno},'${companyname[i]}','${designation[i]}','${from[i]}','${to[i]}')`;
            await execute(q3).then(()=>{
                console.log("work details");
            }).catch(err =>{
                console.log(err);
            });
        }
    }


    //languages----------------
    let language=data.lang;
    let newlan=[];
    console.log(language);
    for (let i = 0; i < language.length; i++) {
        newlan[language[i]]=data[language[i]];    
    }
    console.log(typeof newlan);
    for (let i = 0; i < language.length; i++) {
        var read=0;
        var write=0;
        var speak=0;
        if(newlan[language[i]].includes("read"))
        {
            read=1;
        }
        if(newlan[language[i]].includes("write"))
        {
            write=1;
        }
        if(newlan[language[i]].includes("speak"))
        {
            speak=1;
        }
        var q4=`insert into  knownlanguages values (${eno},(select opid from opt where oname='${language[i]}'),${read},${write},${speak},(select sid from opt where oname='${language[i]}'))`;
        await execute(q4).then(()=>{
            console.log("language data");
        }).catch(err =>{
            console.log(err);
        });
    }
    //technology----------------------------
    var tech=data.tech;
    for (let i = 0; i < tech.length; i++) {
        var q5=`insert into  knowntechnology (eno,opid,sid,expertise) value (${eno},(select opid from opt where oname='${tech[i]}'),(select sid from opt where oname='${tech[i]}'),'${eval('data.ex'+(i+1))}')`;
        await execute(q5).then(()=>{
            console.log("tech data");
        }).catch(err =>{
            console.log(err);
        });
    }

    //reference-----------------------
    for(i=0;i<refname.length;i++)
            {
                if(!(refname[i].trim()=='' && refcontact[i].trim()=="" && refrelation[i].trim()==""))
                {
                    var q6=`insert into ref (eno,name,contact,relation) value (${eno},'${refname[i]}','${refcontact[i]}','${refrelation[i]}')`;
                    await execute(q6).then(()=>{
                        console.log("reference data");
                    }).catch(err =>{
                        console.log(err);
                    });
                }
            }

    //prefernce----------------------
    var location=data.ploc.join();
    var notice=data.notice;
    var department=data.dep;
    var expectedctc=data.exctc;
    var currentctc=data.cuctc;
    console.log(location);
    var q7=`insert into prefer (eno,plocation,notice,expectedctc,currentctc,department) value (${eno},'${location}',${notice},${expectedctc},${currentctc},'${department}')`;
    await execute(q7).then(()=>{
        console.log("preference data");
    }).catch(err =>{
        console.log(err);
    });

    // console.log(req.body);
    res.setHeader('content-Type','application/json');
    res.json({"msg":"data inserted succesfully"});
};

const updateemp=async (req,res)=>{

        console.log("eno is ",req.body);
        res.setHeader('Content-Type','application/json');
    
        // //basic details
        var data=req.body;
        var companyname=data.comname;
        var designation=data.cdesignation;
        var from=data.cdfrom;
        var to=data.ctodate;
        var refname=data.rname;
        var refcontact=data.rcontact;
        var refrelation=data.rrelation;
        var course=data.course;
        var passyear=data.passyear;
        var boarduname=data.boarduname;
        var percentage=data.percentage;
    
        var u=` update detail set fname='${data.fname}',lname='${data.lname}',designation='${data.Designation}',gender='${data.Gender}',relation_status='${data.relstatus}',mobile='${data.Phone}',email='${data.Email}',dob='${data.dob}',address='${data.Address1},${data.Address2}',city='${data.city}',state='${data.state}',pin='${data.pincode}' where eno=${data.eno}`;
        var eno;
        await execute(u).then((result)=>{
            console.log("basic details updated");
        }).catch(err =>{
            console.log(err);
        });
        // console.log(eno);
    
        //education
    
        for(i=0;i<course.length;i++)
        {
            if(!(course[i].trim()=='' && passyear[i].trim()=="" && boarduname[i].trim()=="" && percentage[i].trim()==""))
            {
                var u2=`update education1 set sid=(select sid from opt where oname='${course[i]}'),opid=(select opid from opt where oname='${course[i]}'),boardoruniversity_name='${data.boarduname[i]}',passing_year=${data.passyear[i]},percentage=${data.percentage[i]} where eno=${data.eno} and opid=(select opid from opt where oname='${course[i]}')`;
                await execute(u2).then(()=>{
                    console.log("update education details");
                }).catch(err =>{
                    console.log(err);
                });
            }
        }
    
        //exp
        for(i=0;i<companyname.length;i++)
                {
                    if(!(companyname[i].trim()=='' && designation[i].trim()=="" && from[i].trim()=="" && to[i].trim()==""))
                    {
                        // var q3=`insert into workexp (eno,comapanyname,padesignation,doj,doe) value (${eno},'${companyname[i]}','${designation[i]}','${from[i]}','${to[i]}')`;
                        var u3=`update workexp set comapanyname='${companyname[i]}',padesignation='${designation[i]}',doj='${from[i]}',doe='${to[i]}' where eno=${data.eno}`; 
                        await execute(u3).then(()=>{
                            console.log("work details updated");
                        }).catch(err =>{
                            console.log(err);
                        });
                    }
                }
    
        //languages----------------
        let language=data.lang;
        let newlan=[];
    
        for (let i = 0; i < language.length; i++) {
            newlan[language[i]]=data[language[i]];    
        }
    
        for (let i = 0; i < language.length; i++) {
            var read=0;
            var write=0;
            var speak=0;
            if(newlan[language[i]].includes("read"))
            {
                read=1;
            }
            if(newlan[language[i]].includes("write"))
            {
                write=1;
            }
            if(newlan[language[i]].includes("speak"))
            {
                speak=1;
            }
            var u4=`update knownlanguages set opid=(select opid from opt where oname='${language[i]}'),lread=${read},lwrite=${write},speak=${speak},sid=(select sid from opt where oname='${language[i]}') where eno=${data.eno} and opid=(select opid from opt where oname='${language[i]}')`;
            await execute(u4).then(()=>{
                console.log("language data updated");
            }).catch(err =>{
                console.log(err);
            });
        }
    
    
        //technology----------------------------
        var tech=data.tech;
        for (let i = 0; i < tech.length; i++) {
            var u5=`update knowntechnology set opid=(select opid from opt where oname='${tech[i]}'),sid=(select sid from opt where oname='${tech[i]}'),expertise='${eval('data.ex'+(i+1))}' where eno=${data.eno} and opid=(select opid from opt where oname='${tech[i]}')`;
            await execute(u5).then(()=>{
                console.log("tech data updated");
            }).catch(err =>{
                console.log(err);
            });
        }
    
        //reference-----------------------
        for(i=0;i<refname.length;i++)
        {
            if(!(refname[i].trim()=='' && refcontact[i].trim()=="" && refrelation[i].trim()==""))
            {
                var u6=`update ref set name='${refname[i]}',contact='${refcontact[i]}',relation='${refrelation[i]}' where eno=${data.eno}`;
                await execute(u6).then(()=>{
                    console.log("reference data updated");
                }).catch(err =>{
                    console.log(err);
                });
            }
        }
    
        //prefernce----------------------
        var location=data.ploc.join();
        var notice=data.notice;
        var department=data.dep;
        var expectedctc=data.exctc;
        var currentctc=data.cuctc;
        console.log(location);
        var u7=`update prefer set plocation='${location}',notice=${notice},expectedctc=${expectedctc},currentctc=${currentctc},department='${department}' where eno=${data.eno}`;
        await execute(u7).then(()=>{
        console.log("preference data updated");
        }).catch(err =>{
            console.log(err);
        });
            
        res.status(200).json({"msg":"data updated succesfully"});
        };

// app.listen(9900);
module.exports={
    data,
    updateemp,
    insert,
    emp,
    jobform,
    citydata,
    showdata,
}