const { execute } = require('../config/dbconnection');
async function attendencedata(month,offset,pageno){
    const m=[12,1,2];
    var result=null;
    var q1="select count(*) as record from studentmaster";
    const count=await execute(q1);
    if((m.includes(month)) && (pageno>0 && pageno<=Math.ceil(count[0].record/15)))
    {
        var q="select attendencemaster.id,studentmaster.firstname,count(attendencemaster.id) as present,ROUND((count(attendencemaster.id)/31)*100,2) as pr from studentmaster left join attendencemaster on studentmaster.id=attendencemaster.id where attendencemaster.present_absent='P' AND Month(attendencemaster.pdate)=? group by attendencemaster.id limit ?,15";
        var result= await execute(q,[month,offset]);
        return result;
    }
    else{
        return result;
    }
}
module.exports={attendencedata};