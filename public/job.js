var c = 0;
var e = 0;
const navarray = ["bn", "en", "expn", "lang", "techn", "refn", "prefn"];
const bodyarray = ["bd", "edu", "exp", "lan", "tech", "ref", "pref"];

async function load()
{
    op = await fetch('/data').then(response => response.json());
        // console.log("OP ",op);
        const sel=document.getElementById('state');
        // console.log(sel.options[sel.selectedIndex].text);
        // sel[0]=new Option("abc","pqr");
        for (let i = 0; i < op.length; i++) {
            sel[i]=new Option(op[i].name,op[i].name);
        }
        return op;
}
async function findcity()
{
    const sel=document.getElementById('state');
    var name=sel.options[sel.selectedIndex].value;
    // console.log(sel.options[sel.selectedIndex].value);
    op = await fetch(`/citydata?cn=${name}`).then(response => response.json());
//        console.log("OP ",op);
        const city=document.getElementById('city');
        // console.log(sel);
        for (let i = 0; i < op.length; i++) {
            city[i]=new Option(op[i].city,op[i].city);
        }
        return op;
}


//for next part
function next() {
    e = 0;
    var p = document.querySelectorAll(`#${bodyarray[c]} input`);
    p.forEach((el) => {
        if (el.value.trim() == "") {
            el.style.borderColor="red";
            e++;
        }
        else
        {
            el.style.borderColor="green";
        }
    
    });
    if (e == 0) {
        c++;
        for (let i = 0; i < navarray.length; i++) {
            if (i == c) {
                document.getElementById(`${navarray[i]}`).style.background = "black";
                document.getElementById(`${navarray[i]}`).style.color = "white";
                document.getElementById(`${bodyarray[i]}`).style.display = "block";
            }
            else {
                document.getElementById(`${bodyarray[i]}`).style.display = "none";
                document.getElementById(`${navarray[i]}`).style.background = "white";
                document.getElementById(`${navarray[i]}`).style.color = "black";
            }
        }
        p.forEach((el) => {
                el.style.borderColor="green";
            });
    }

    // console.log("next c", c);
    return c,e;
}

//for previous part
function previous() {
    // console.log("c=", c);
    c--;
    for (let i = 0; i < navarray.length; i++) {
        if (i == c) {
            document.getElementById(`${navarray[i]}`).style.background = "black";
            document.getElementById(`${navarray[i]}`).style.color = "white";
            document.getElementById(`${bodyarray[i]}`).style.display = "block";
        }
        else {
            document.getElementById(`${bodyarray[i]}`).style.display = "none";
            document.getElementById(`${navarray[i]}`).style.background = "white";
            document.getElementById(`${navarray[i]}`).style.color = "black";
        }
    }
    // console.log("prev", c);
    return c;
}

//call for get all emp records
const getAllEmployees = async () =>{
    var response = null;
    await fetch('/showdata', {
        method:"GET",
    headers:{'Content-Type':"application/json"}
    })
    .then(result =>{ response = result.json()});
    // console.log(await response);
    return await response;
}

//for showing that records
async function show() {
    bodyarray.forEach((el) => {
        document.getElementById(`${el}`).style.display = "none";
    });
    document.getElementById('viewn').style.background="black";
    document.getElementById('viewn').style.color="white";  
    document.getElementById('bn').style.background="white";
    document.getElementById('bn').style.color="black";    
    document.getElementById("mytab").style.display = "block";
    var op = await getAllEmployees();
    for (let j = 0; j < op.length; j++) {
        var tr = document.createElement("tr");
        var row = document.getElementById("mytab").lastElementChild.appendChild(tr);
        Object.values(op[j]).forEach((e) => {
            var td = document.createElement("td");
            td.innerHTML = e;
            row.appendChild(td);
        })
        var td = document.createElement("td");
        td.innerHTML = `<a onclick=update(${op[j].eno})>UPDATE</a>`;
        row.appendChild(td);

    }
}

//use for take all form data for insert
async function getdata() {
    var form = document.getElementById("job");
    const data = new URLSearchParams(new FormData(form));
    // console.log("data",data);
    var op = await fetch('/insert', { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data }).then(response => response.json());
    if (op.msg == "data inserted succesfully") {
        show();
    }

}

//particular emp details
async function getEmployeeDetails(id) {
    var res = null;
    await fetch(`/emp`, {
        method:"POST",
        headers: {"Content-Type":"application/json"},
        body:JSON.stringify({id})
    })
    .then((result)=>{
        res = result.json();
    })
    return res;
}

//select value in combo box
function selectval(id,val)
{
    var select=document.getElementById(`${id}`);
    for (let i = 0; i < select.length; i++) {
        if(select[i].value==val)
        {
            select[i].selected=true;
        }
    }
}

//for set data in form for update
function setdata(op)
{
    //basicdetails
    document.getElementById('eno').value=op['basicdetail']['eno'];
    document.getElementById('fname').value=op['basicdetail']['fname'];
    document.getElementById('lname').value=op['basicdetail']['lname'];
    document.getElementById('Designation').value=op['basicdetail']['designation'];
    if(op['basicdetail']['gender']=='M')
    {
        document.getElementById('male').checked='true';
    }
    else
    {
        document.getElementById('female').checked='true';
    }

    document.getElementById('Email').value=op['basicdetail']['email'];
    document.getElementById('Address1').value=op['basicdetail']['address'].split(",")[0];
    document.getElementById('Address2').value=op['basicdetail']['address'].split(",")[1];
    document.getElementById('Email').value=op['basicdetail']['email'];
    // document.getElementById('city').value=op['basicdetail']['city'];
    document.getElementById('Phone').value=op['basicdetail']['mobile'];
    document.getElementById('pincode').value=op['basicdetail']['pin'];
    document.getElementById('dob').value=op['basicdetail']['dob'];
    selectval('relstatus',op['basicdetail']['relation_status']);
    selectval('state',op['basicdetail']['state']);
    selectval('city',op['basicdetail']['city']);
    
    

    //education
    var course=document.getElementsByName('course[]');
    var boarduname=document.getElementsByName('boarduname[]');
    var passyear=document.getElementsByName('passyear[]');
    var percentage=document.getElementsByName('percentage[]');
    for (let i = 0; i < op['education'].length; i++) {
            course[i].value=op['education'][i].course;
            boarduname[i].value=op['education'][i].boarduname;
            passyear[i].value=op['education'][i].passyear;
            percentage[i].value=op['education'][i].percentage;
    }

    //workexp
    var companyname=document.getElementsByName('comname[]');
    var des=document.getElementsByName('cdesignation[]');
    var from=document.getElementsByName('cdfrom[]');
    var to=document.getElementsByName('ctodate[]');
    for (let i = 0; i < op['experience'].length; i++) {
      companyname[i].value=op['experience'][i].comapanyname;
      des[i].value=op['experience'][i].padesignation;
      from[i].value=op['experience'][i].doj;
      to[i].value=op['experience'][i].doe;
    }

    //reference
    var rname=document.getElementsByName('rname[]');
    var rcontact=document.getElementsByName('rcontact[]');
    var rrelation=document.getElementsByName('rrelation[]');
    for (let i = 0; i < op['reference'].length; i++) {
        rname[i].value=op['reference'][i].name;
        rcontact[i].value=op['reference'][i].contact;
        rrelation[i].value=op['reference'][i].relation;
      }

    //language
    var lang=op['language'];
    for (let i = 0; i < lang.length; i++) {
        if(lang[i].language=="hindi")
        {
            if(lang[i].lread==1)
            {
                document.getElementById('chread').checked='true';
            }
            if(lang[i].lwrite==1)
            {
                document.getElementById('chwrite').checked='true';
            }
            if(lang[i].speak==1)
            {
                document.getElementById('chspeak').checked='true';
            } 
            document.getElementById('chindi').checked='true';  
        }
        if(lang[i].language=="english")
        {
            if(lang[i].lread==1)
            {
                document.getElementById('ceread').checked='true';
            }
            if(lang[i].lwrite==1)
            {
                document.getElementById('cewrite').checked='true';
            }
            if(lang[i].speak==1)
            {
                document.getElementById('cespeak').checked='true';
            } 
            document.getElementById('cenglish').checked='true';  
        }
        if(lang[i].language=="gujarati")
        {
            if(lang[i].lread==1)
            {
                document.getElementById('cgread').checked='true';
            }
            if(lang[i].lwrite==1)
            {
                document.getElementById('cgwrite').checked='true';
            }
            if(lang[i].speak==1)
            {
                document.getElementById('cgspeak').checked='true';
            } 
            document.getElementById('cgujarati').checked='true';  
        }
    }

    //technology
    var tech=op['technology'];
    for (let i = 0; i < tech.length; i++) {
        if(tech[i].oname=='php')
        {
            if(tech[i].expertise=='Beginer')
            {
                document.getElementById('pbeg').checked='true';
            }
            if(tech[i].expertise=='Mideator')
            {
                document.getElementById('pmid').checked='true';
            }
            if(tech[i].expertise=='Expert')
            {
                document.getElementById('pex').checked='true';
            }
            document.getElementById('cphp').checked='true';
        }
        if(tech[i].oname=='laravel')
        {
            if(tech[i].expertise=='Beginer')
            {
                document.getElementById('lbeg').checked='true';
            }
            if(tech[i].expertise=='Mideator')
            {
                document.getElementById('lmid').checked='true';
            }
            if(tech[i].expertise=='Expert')
            {
                document.getElementById('lex').checked='true';
            }
            document.getElementById('claravel').checked='true';
        }
        if(tech[i].oname=='mysql')
        {
            if(tech[i].expertise=='Beginer')
            {
                document.getElementById('mbeg').checked='true';
            }
            if(tech[i].expertise=='Mideator')
            {
                document.getElementById('mmid').checked='true';
            }
            if(tech[i].expertise=='Expert')
            {
                document.getElementById('mex').checked='true';
            }
            document.getElementById('cmy').checked='true';
        }
        if(tech[i].oname=='oracle')
        {
            if(tech[i].expertise=='Beginer')
            {
                document.getElementById('obeg').checked='true';
            }
            if(tech[i].expertise=='Mideator')
            {
                document.getElementById('omid').checked='true';
            }
            if(tech[i].expertise=='Expert')
            {
                document.getElementById('oex').checked='true';
            }
            document.getElementById('coracle').checked='true';
        }
    }

    //preference
    document.getElementById('notice').value=op['preference'][0].notice;
    document.getElementById('exctc').value=op['preference'][0].expectedctc;
    document.getElementById('cuctc').value=op['preference'][0].currentctc;
    selectval('dep',op['preference']['department']);
}

//for showing updated form
async function update(p) {
    // console.log(p);
    document.getElementById(`${bodyarray[0]}`).style.display = "block";
    document.getElementById("mytab").style.display = "none";
    var form = document.querySelector("form");
    var op=await getEmployeeDetails(p);
    setdata(op);    
    document.getElementById('viewn').style.background='white';
    document.getElementById('viewn').style.color='black';
    document.getElementById('bn').style.background='black';
    document.getElementById('bn').style.color='white';

    c=0,e=0;
    document.getElementById('submit').style.display='none';
    document.getElementById('update').style.display='block';
    return c,e;
    // console.log(op);
}



//for update that data
async function updatedata()
{
    c=0,e=0;
    // var eno=document.getElementById('eno').value;
    var form = document.getElementById("job");
    const data = new URLSearchParams(new FormData(form));
    // console.log("data",data);
    var op = await fetch('/updateemp', { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: data }).then(response => response.json());
    if (op.msg == "data updated succesfully") {
        document.getElementById('job').reset();
        document.getElementById('eno').value=1;
        console.log("data updated successfully");
        document.getElementById(`${bodyarray[6]}`).style.display="none";
        document.getElementById(`${bodyarray[0]}`).style.display = "block";
    }
    // updateEmployeeDetails(eno);
    return c;
}