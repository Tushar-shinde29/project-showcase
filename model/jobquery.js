const { execute } = require('./dbconnection');
async function statedata() {
    var q = `select name from states order by name`;
    result = await execute(q);
    return result;
}
async function city(state) {
    var q = `select city from cities where state_id=(select id from states where name='${state}')`;
    result = await execute(q);
    return result;
}
async function alldata() {
    var q = "select eno,fname,lname from detail";
    result = await execute(q);
    return result;
}
async function showempdata(empno) {
    var details = {};
    var q1 = `select eno,fname,lname,designation,gender,relation_status,mobile,email,DATE_FORMAT(dob, "%Y-%m-%d") as dob,address,city,state,pin from detail where eno=${empno}`;
    var basicdetail = await execute(q1, [empno]);
    details['basicdetail'] = basicdetail[0];

    if (!(basicdetail == [])) {
        var q2 = `select oname as course,boardoruniversity_name as boarduname,passing_year as passyear,percentage from education1 left join opt on opt.opid=education1.opid where eno=${empno}`;
        details['education'] = await execute(q2, [empno]);

        var q3 = `select comapanyname,padesignation,DATE_FORMAT(doj, "%Y-%m-%d") as doj,DATE_FORMAT(doe, "%Y-%m-%d") as doe from workexp where eno=${empno} `;
        details['experience'] = await execute(q3, [empno]);

        var q4 = `select name,contact,relation from ref  where eno=${empno}`;
        details['reference'] = await execute(q4, [empno]);


        var q5 = `select plocation,notice,expectedctc,currentctc,department from prefer  where eno=${empno}`;
        details['preference'] = await execute(q5, [empno]);

        var q6 = `select opt.oname as language,lread,lwrite,speak from knownlanguages left join opt on opt.opid=knownlanguages.opid where eno=${empno}`;
        details['language'] = await execute(q6, [empno]);

        var q7 = `select opt.oname,expertise from knowntechnology left join opt on opt.opid=knowntechnology.opid where eno=${empno}`;
        details['technology'] = await execute(q7, [empno]);

        return details;
    }

}
async function insertdata(data) {
    var companyname = data.comname;
    var designation = data.cdesignation;
    var from = data.cdfrom;
    var to = data.ctodate;
    var refname = data.rname;
    var refcontact = data.rcontact;
    var refrelation = data.rrelation;
    var course = data.course;
    var passyear = data.passyear;
    var boarduname = data.boarduname;
    var percentage = data.percentage;
    //basicdata
    var q1 = `insert into detail (fname,lname,designation,gender,relation_status,mobile,email,dob,address,city,state,pin) values ("${data.fname}",'${data.lname}','${data.Designation}','${data.Gender}','${data.relstatus}','${data.Phone}','${data.Email}','${data.dob}','${data.Address1},${data.Address2}','${data.city}','${data.state}','${data.pincode}')`;
    var basicdetail = await execute(q1);
    var eno = basicdetail.insertId;

    //eduction-------------------------------
    for (i = 0; i < course.length; i++) {
        if (!(course[i].trim() == '' && passyear[i].trim() == "" && boarduname[i].trim() == "" && percentage[i].trim() == "")) {
            var q2 = `insert into education1 (eno,sid,opid,boardoruniversity_name,passing_year,percentage) values (${eno},(select sid from opt where oname='${course[i]}'),(select opid from opt where oname='${course[i]}'),'${data.boarduname[i]}',${data.passyear[i]},${data.percentage[i]})`;
            await execute(q2);
        }
    }

    //workexp
    for (i = 0; i < companyname.length; i++) {
        if (!(companyname[i].trim() == '' && designation[i].trim() == "" && from[i].trim() == "" && to[i].trim() == "")) {
            var q3 = `insert into workexp (eno,comapanyname,padesignation,doj,doe) value (${eno},'${companyname[i]}','${designation[i]}','${from[i]}','${to[i]}')`;
            await execute(q3);
        }
    }

    //languages----------------
    let language = data.lang;
    let newlan = [];
    for (let i = 0; i < language.length; i++) {
        newlan[language[i]] = data[language[i]];
    }
    for (let i = 0; i < language.length; i++) {
        var read = 0;
        var write = 0;
        var speak = 0;
        if (newlan[language[i]].includes("read")) {
            read = 1;
        }
        if (newlan[language[i]].includes("write")) {
            write = 1;
        }
        if (newlan[language[i]].includes("speak")) {
            speak = 1;
        }
        var q4 = `insert into  knownlanguages values (${eno},(select opid from opt where oname='${language[i]}'),${read},${write},${speak},(select sid from opt where oname='${language[i]}'))`;
        await execute(q4);
    }

    //technology----------------------------
    var tech = data.tech;
    for (let i = 0; i < tech.length; i++) {
        var q5 = `insert into  knowntechnology (eno,opid,sid,expertise) value (${eno},(select opid from opt where oname='${tech[i]}'),(select sid from opt where oname='${tech[i]}'),'${eval('data.ex' + (i + 1))}')`;
        await execute(q5);
    }

    //reference-----------------------
    for (i = 0; i < refname.length; i++) {
        if (!(refname[i].trim() == '' && refcontact[i].trim() == "" && refrelation[i].trim() == "")) {
            var q6 = `insert into ref (eno,name,contact,relation) value (${eno},'${refname[i]}','${refcontact[i]}','${refrelation[i]}')`;
            await execute(q6);
        }
    }

    //prefernce----------------------
    var location = data.ploc.join();
    var notice = data.notice;
    var department = data.dep;
    var expectedctc = data.exctc;
    var currentctc = data.cuctc;
    var q7 = `insert into prefer (eno,plocation,notice,expectedctc,currentctc,department) value (${eno},'${location}',${notice},${expectedctc},${currentctc},'${department}')`;
    await execute(q7);

}
async function updatedata(data) {

    // //basic details
    var companyname = data.comname;
    var designation = data.cdesignation;
    var from = data.cdfrom;
    var to = data.ctodate;
    var refname = data.rname;
    var refcontact = data.rcontact;
    var refrelation = data.rrelation;
    var course = data.course;
    var passyear = data.passyear;
    var boarduname = data.boarduname;
    var percentage = data.percentage;

    var q1 = ` update detail set fname='${data.fname}',lname='${data.lname}',designation='${data.Designation}',gender='${data.Gender}',relation_status='${data.relstatus}',mobile='${data.Phone}',email='${data.Email}',dob='${data.dob}',address='${data.Address1},${data.Address2}',city='${data.city}',state='${data.state}',pin='${data.pincode}' where eno=${data.eno}`;
    await execute(q1);


    //education
    for (i = 0; i < course.length; i++) {
        if (!(course[i].trim() == '' && passyear[i].trim() == "" && boarduname[i].trim() == "" && percentage[i].trim() == "")) {
            var q2 = `update education1 set sid=(select sid from opt where oname='${course[i]}'),opid=(select opid from opt where oname='${course[i]}'),boardoruniversity_name='${data.boarduname[i]}',passing_year=${data.passyear[i]},percentage=${data.percentage[i]} where eno=${data.eno} and opid=(select opid from opt where oname='${course[i]}')`;
            await execute(q2);
        }
    }

    //exp
    for (i = 0; i < companyname.length; i++) {
        if (!(companyname[i].trim() == '' && designation[i].trim() == "" && from[i].trim() == "" && to[i].trim() == "")) {
            var q3 = `update workexp set comapanyname='${companyname[i]}',padesignation='${designation[i]}',doj='${from[i]}',doe='${to[i]}' where eno=${data.eno}`;
            await execute(q3);
        }
    }

    //languages----------------
    let language = data.lang;
    let newlan = [];

    for (let i = 0; i < language.length; i++) {
        newlan[language[i]] = data[language[i]];
    }

    for (let i = 0; i < language.length; i++) {
        var read = 0;
        var write = 0;
        var speak = 0;
        if (newlan[language[i]].includes("read")) {
            read = 1;
        }
        if (newlan[language[i]].includes("write")) {
            write = 1;
        }
        if (newlan[language[i]].includes("speak")) {
            speak = 1;
        }
        var q4 = `update knownlanguages set opid=(select opid from opt where oname='${language[i]}'),lread=${read},lwrite=${write},speak=${speak},sid=(select sid from opt where oname='${language[i]}') where eno=${data.eno} and opid=(select opid from opt where oname='${language[i]}')`;
        await execute(q4);
    }


    //technology----------------------------
    var tech = data.tech;
    for (let i = 0; i < tech.length; i++) {
        var q5 = `update knowntechnology set opid=(select opid from opt where oname='${tech[i]}'),sid=(select sid from opt where oname='${tech[i]}'),expertise='${eval('data.ex' + (i + 1))}' where eno=${data.eno} and opid=(select opid from opt where oname='${tech[i]}')`;
        await execute(q5);
    }

    //reference-----------------------
    for (i = 0; i < refname.length; i++) {
        if (!(refname[i].trim() == '' && refcontact[i].trim() == "" && refrelation[i].trim() == "")) {
            var q6 = `update ref set name='${refname[i]}',contact='${refcontact[i]}',relation='${refrelation[i]}' where eno=${data.eno}`;
            await execute(q6);
        }
    }

    //prefernce----------------------
    var location = data.ploc.join();
    var notice = data.notice;
    var department = data.dep;
    var expectedctc = data.exctc;
    var currentctc = data.cuctc;
    console.log(location);
    var q7 = `update prefer set plocation='${location}',notice=${notice},expectedctc=${expectedctc},currentctc=${currentctc},department='${department}' where eno=${data.eno}`;
    await execute(q7);
}
module.exports = {
    statedata,
    city,
    alldata,
    showempdata,
    insertdata,
    updatedata,
}