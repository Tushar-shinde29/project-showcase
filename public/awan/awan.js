function tab(id)
{
    if(id=="m")
    {
        
        document.getElementById("he").innerHTML="The Best Managed Cloud Hosting for Magento";
        document.getElementById("in").innerHTML="Magento Demo";
    }
    else if(id=="p")
    {
        document.getElementById(id).style.backgroundColor="#F0F6FF";
        document.getElementById("he").innerHTML="The Best Managed Cloud Hosting for PHP";
        document.getElementById("in").innerHTML="PHP Demo";
    }
    else if(id=="l")
    {
        document.getElementById(id).style.backgroundColor="#F0F6FF";
        document.getElementById("he").innerHTML="The Best Managed Cloud Hosting for Laravel";
        document.getElementById("in").innerHTML="Laravel Demo";
    }
    else if(id=="w")
    {
        document.getElementById(id).style.backgroundColor="#F0F6FF";
        document.getElementById("he").innerHTML="The Best Managed Cloud Hosting for Wordpress";
        document.getElementById("in").innerHTML="We live and breathe Wordpress.Our managed hosting for Wordpress and WooCommerce takes away cloud server related hassles so you can scale your website the way you want";
    }
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