"use strict";

const id = document.querySelector("#id");
const password = document.querySelector("#password");
const passwordcheck = document.querySelector("#passwordcheck");
const username = document.querySelector("#username");
const email = document.querySelector("#email");
const phone = document.querySelector("#phone");
const {category} = document.getElementsByName("category");
const signupBtn = document.querySelector("#button");

signupBtn.addEventListener("click", signup);


function signup(){
    if(!id.value) return alert("아이디를 입력해주세요!");
    if(!password.value) return alert("비밀번호를 입력해주세요!");
    if(password.value !== passwordcheck.value) return alert("비밀번호가 비밀번호 확인과 일치하지 않습니다!");
    if(!username.value) return alert("사용자명을 입력해주세요!");
    const req = {
        id : id.value,
        password : password.value,
        username : username.value,
        email : email.value,
        phone : phone.value
    };

    fetch("/signup", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify(req),
    })
    .then((res)=>res.json())
    .then((res)=>{
        if(res.success){
            location.href="/login";
        } else{
            return alert(res.msg);
        }
    })
    .catch((err) => {
        console.error(new Error("회원가입 중 에러발생"));
    });
}
