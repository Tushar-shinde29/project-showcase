const { execute } = require('./dbconnection');
async function querydata(month,offset,orderby,order) {
    var columnname=['id','firstname','present','pr'];
    var sequence=['asc','desc'];
    var order=order.toLowerCase();
    var result=null;
    if(columnname.includes(orderby) && sequence.includes(order))
    {
        var q=`select attendencemaster.id,studentmaster.firstname,count(attendencemaster.id) as present,ROUND((count(attendencemaster.id)/31)*100,2) as pr from studentmaster left join attendencemaster on studentmaster.id=attendencemaster.id where attendencemaster.present_absent='P' AND Month(attendencemaster.pdate)=? group by attendencemaster.id Order by ${orderby} ${order}`;
        var result=await execute(`${q};${q} limit ?,15`,[month,month,offset]);
        return result;
    }
    else
    {
        
        return result;
    }
}
module.exports={querydata};