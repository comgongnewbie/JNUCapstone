"use strict";

const contentTitle = document.querySelector("#contentTitle");
const contentCategory = document.querySelector("#contentCategory");
const contentText = document.querySelector("#contentText");
const peopleNum = document.querySelector("#peopleNum");
const uploadBtn = document.querySelector("#button1");
const link = document.querySelector("#link");
const num = document.querySelector("#num");

uploadBtn.addEventListener("click", upload);


function upload(){
    const req = {
        title : contentTitle.value,
        content: contentText.value,
        peopleNum : peopleNum.value,
        noticeLink : link.value,
        notice_num : num.value,
        writer : "익명",
    };
    req[contentCategory.value] = 1;

    fetch("/team_write", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(req),
    })
    .then((res)=>res.json())
    .then((res)=>{
        if(res.success){
            if(num.value.length!==0){
                window.location.href=link.value;
            }
            else {
                location.href="/team_main";
            }
        } else{
            return alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("글작성 중 에러발생"));
    });
}
