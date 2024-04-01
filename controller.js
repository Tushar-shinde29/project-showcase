const express=require('express');
const ejs=require('ejs');
const app=express();
const path = require('path'); 
app.use(express.static(__dirname + "/public"));
const daynamictable=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/table.html')); 
};

const tictactoe=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/tic_tac_toe.html'));
};

const kukukube=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/game.html'));
};

const ehya=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/ehya/frame1.html'));
};

const awan=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/awan/awan.html'));
};

const hirex=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/hirex/Hirex.html'));
};

const eventdemo=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/event.html'));
};

const fetchapi=(req,res)=>{
    res.sendFile(path.join(__dirname, '/public/fetchapi.html'));
};

module.exports={
    daynamictable,
    tictactoe,
    kukukube,
    ehya,
    awan,
    hirex,
    eventdemo,
    fetchapi,
}