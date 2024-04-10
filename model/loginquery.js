const { execute } = require("../config/dbconnection");

async function getusername(code)
{
    var q1 = `select username from users where activationcode='${code}'`;
    result=await execute(q1);
    return result;
}
async function passwordupdate(password,salt,username,code){
    var q1 = `update users set password= md5('${password}'),salt='${salt}',status='1' where username='${username}' AND activationcode='${code}'`;
    await execute(q1);
}
async function usercheck(username,email)
{
    var q1 = `select username,email from users where username='${username}' AND email='${email}'`;
    result=await execute(q1);
    return result;
}
async function registeruser(data)
{
    var q = `insert into users (fname,lname,username,email,activationcode) values ?`;
        var d = [data];
        result = await execute(q, [d]);
}
async function finduser(username)
{
    var q = `select * from users where username='${username}'`;
    var result=await execute(q);
    return result;
}
async function getnewcode(code,username)
{
    var q = `update users set activationcode='${code}' where username='${username}'`;
    var result2 = await execute(q);
    return result2;
}

async function logincheck(username,password)
{
    var q1 = `select * from users where username='${username}' AND password=md5('${password}')`;
    var result1 = await execute(q1);
    return result1;
}
module.exports={
    getusername,
    passwordupdate,
    usercheck,
    registeruser,
    finduser,
    getnewcode,
    logincheck
}