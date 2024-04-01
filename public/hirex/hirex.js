function hire(id)
{
    document.getElementById(id).style.backgroundColor="#000000";
    document.getElementById(id).style.color="#FFFFFF";
}
function right(){
    let width=document.querySelector("div .card1").getBoundingClientRect().width;
    document.querySelector("div .slidecontent").scrollLeft +=width;
}
function left()
{
    let width=document.querySelector("div .card1").getBoundingClientRect().width;
    document.querySelector("div .slidecontent").scrollLeft -=width;
}