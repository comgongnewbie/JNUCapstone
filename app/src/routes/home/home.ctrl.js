"use strict";

const User = require("../../models/User");
const Contents = require("../../models/Contents");
const toContents = require("../../models/toContents");

function makeurl(data, i){
    var url = document.getElementsByid("content");
    url.href = "/notice/content?num="+data[i].num;
}
const output = {
    login : (req, res) =>{
        res.render("home/index");
    },
    
    signup : (req, res) => {
        res.render("home/signup");
    },

    notice : (req, res) =>{
        res.render("home/notice_main");
    },
    
    notice_list : async (req, res) =>{
        const category = req.query.category;
        const response = await Contents.getContentByCategory(category);
        res.render("home/notice_list",{ post : response, category : category});
    },

    notice_content : async (req, res) =>{
        const num = req.query.num;
        const category = req.query.category;
        const response = await Contents.getContent(num);
        const board = await Contents.getteamContentN(num);
        res.render("home/notice_content",
        {notice_content : response,
        team_list : board,
        category : category});
    },

    team_main : async (req, res) =>{
        if(Object.keys(req.query).length > 0){
            const category = req.query.category;
            const response = await Contents.getteamContentT(category);
            res.render("home/team_main",{teambuild : response});
        }
        else {const response = await Contents.getTeamBuild();
            res.render("home/team_main",{teambuild : response});
        }
    },

    team_write : async (req, res) =>{
        if(Object.keys(req.query).length > 0){
            const originnum = req.query.num;
            const category = req.query.category;
            res.render("home/team_write",{originnum : originnum, category : category});
        } 
            
        else{
            res.render("home/team_write", {originnum : null, category : null});
        }

    },
    
    team_content : async (req, res) =>{
        const num = req.query.num;
        const response = await Contents.getteamCon(num);
        const comment = await Contents.getteamComment(num);
        res.render("home/team_content",
        {team_content : response,
        team_comment : comment});
    },
    
    usersetting : (req, res) =>{
        res.render("home/usersetting");
    },

};

const process = {
    login : async (req, res) =>{
        const user = new User(req.body);
        const response = await user.login();
        return res.json(response);
    },

    signup: async (req, res) =>{
        const user = new User(req.body);
        const response = await user.signup();
        return res.json(response);
    },

    team_write : async (req, res) =>{
        const data = new toContents(req.body);
        const category = Object.keys(data.body)[6];
        const response = await data.upload(category);
        return res.json(response);
    },

    comment_write : async (req, res) =>{
        const data = new toContents(req.body);
        const response = await data.comment();
        return res.json(response);
    },
}

module.exports = {
    output,
    process,
};