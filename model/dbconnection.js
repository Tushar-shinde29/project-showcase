var mysql=require('mysql');
function connect()
{
    var con=mysql.createConnection({host:"localhost",user:"root",password:"root",database:'projectshowcase',multipleStatements:'true'});
    return con;
}
async function execute(q, data) {
    var con=connect();
    return new Promise((resolve, reject) => {
        con.query(q,data, function (err, result) {
            if (err) return reject(err);
            // console.log(result);
            resolve(result);
        });
    })
}
module.exports={connect,execute};