
function rowadd()
        {
            var c=document.querySelector("table").rows[0].cells.length;
            const tr=document.createElement("tr");
            //const td=document.createElement("td");
            //p=document.querySelector("table").appendChild(tr);
            p=document.querySelector("table").lastElementChild.appendChild(tr); 
            for(i=0;i<c;i++)
            {
                const td=document.createElement("td");
                // td.innerHTML="11";
                p.appendChild(td);
            }
            console.log(document.querySelector("table").rows.length);
        }
        function coladd()
        {
            q=document.querySelectorAll("tr");
            for(i=0;i<q.length;i++)
            {
                const td=document.createElement("td");
                q[i].appendChild(td);
                // td.innerHTML="11";
            }
            console.log(document.querySelector("table").rows.length);
        }
        function delrow()
        {
            // var p1=document.querySelector("table").rows.length;
            // var p2=document.querySelector("table").rows[0].cells.length;
            // var r=document.querySelector("table").rows.length;
            // console.log(r);
            // var c=document.querySelector("table").rows[0].cells.length;
            // if(p1>2)
            // {
            // p=document.querySelector("tr");
            // p.remove();
            // }
            // else
            // {
            //     window.alert("u can not delete");
            // }
            let table = document.getElementById('mytab');
            let le = table.rows.length;
            if(le == 2)
            {
                alert("you can not delete");
            }
            else
            {
                table.deleteRow(table.rows.length-1);
            }
        }

        function delcol()
        {
            var p1=document.querySelector("table").rows.length;
            var p2=document.querySelector("table").rows[0].cells.length;
            if(p2>2)
            {
                let row=document.getElementById("mytab").rows;
                for(let i=0;i<row.length;i++)
                {
                    row[i].deleteCell(-1);
                }
            }
            else
            {
                window.alert("you can not delete");
            }

        }
