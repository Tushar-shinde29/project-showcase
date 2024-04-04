const { execute } = require("./dbconnection");

async function allstudentdata(pageno) {
    var q = "select * from student1 ";
    // con.query(sq,[[page-1]],function(err,result){
    var result = await execute(`${q};${q}limit ?,200`, [pageno - 1]);
    return result;
}
async function orderdata(orderby, offset) {
    var q = `select * from student1  order by ${orderby} limit ?,200`;
    // con.query(sq,[[page-1]],function(err,result){
    var result = await execute(q, [offset]);
    return result;
}
module.exports = { allstudentdata, orderdata };