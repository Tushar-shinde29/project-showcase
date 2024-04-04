const { execute } = require("./dbconnection");

async function totalrecord() {
    var q = "select count(*) as record from studentmaster";
    var result = await execute(q);
    return result;
}

async function allstudentresult(offset) {
    var q = `select studentmaster.id,studentmaster.firstname,
        sum(case when exammaster.eid=1 then practicalmarks end) prelimpra,
        sum(case when exammaster.eid=1 then theorymarks end) prelimth,
        sum(case when exammaster.eid=2 then practicalmarks end) terminalpra,
        sum(case when exammaster.eid=2 then theorymarks end) terminalth,
        sum(case when exammaster.eid=3 then practicalmarks end) finalpra,
        sum(case when exammaster.eid=3 then theorymarks end) finalth,
        sum(practicalmarks) as totalp,sum(theorymarks) as totalt,(sum(practicalmarks)+sum(theorymarks)) as total
        FROM studentmaster left join exammaster on studentmaster.id=exammaster.id group by id limit ?,15`;
    var result = await execute(q, [offset]);
    return result;
}
async function individualresultdata(rollno) {
    var q = `select studentmaster.id,concat(studentmaster.firstname," ",studentmaster.middlename," ",studentmaster.lastname) as NAME,exammaster.sid,subject.sname,
        sum(case when exammaster.eid=1 then practicalmarks end) prelimpractical,
        sum(case when exammaster.eid=1 then theorymarks end) prelimtheory,
        sum(case when exammaster.eid=2 then practicalmarks end) terminalpractical,
        sum(case when exammaster.eid=2 then theorymarks end) terminaltheory,
        sum(case when exammaster.eid=3 then practicalmarks end) finalpractical,
        sum(case when exammaster.eid=3 then theorymarks end) finaltheory,
        (select ROUND((count(attendencemaster.id)/90)*100,2) as pr from attendencemaster  where attendencemaster.present_absent='P' group by attendencemaster.id having id=?) as atpr
        FROM studentmaster left join exammaster on studentmaster.id=exammaster.id left join subject on exammaster.sid=subject.sid group by sid,id having id=? order by sid;`
    // con.query(q,[sp.rollno,sp.rollno],function(err,result){
    var result = await execute(q, [rollno, rollno]);
    return result;
}
module.exports = { allstudentresult, individualresultdata, totalrecord };