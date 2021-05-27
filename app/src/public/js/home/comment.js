"use strict";

const contentText = document.querySelector("#content");
const uploadBtn = document.querySelector("#button1");
const num = document.querySelector("#num");


uploadBtn.addEventListener("click", comment);


function comment(){
    const req = {
        content: contentText.value,
        team_num : num.value,
        writer : "익명",
    };

    fetch("/comment_write", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(req),
    })
    .then((res)=>res.json())
    .then((res)=>{
        if(res.success){
            window.location.reload();
        } else{
            return alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("글작성 중 에러발생"));
    });
}
