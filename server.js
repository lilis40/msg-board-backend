const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname,"data.json");

// 留言文件不存在就自动创建空数组
if(!fs.existsSync(DATA_FILE)){
    fs.writeFileSync(DATA_FILE,JSON.stringify([]));
}

app.use(cors()); // 允许跨域，github pages前端可以访问
app.use(express.json());

// 获取所有留言接口 GET
app.get("/api/messages",(req,res)=>{
    const raw = fs.readFileSync(DATA_FILE,"utf-8");
    const list = JSON.parse(raw);
    res.json(list);
})

// 新增留言接口 POST
app.post("/api/messages",(req,res)=>{
    const {name,content,time} = req.body;
    if(!name || !content){
        return res.status(400).json({error:"昵称和留言不能为空"});
    }
    const raw = fs.readFileSync(DATA_FILE,"utf-8");
    const list = JSON.parse(raw);
    // 新留言放最前面
    list.unshift({name,content,time});
    fs.writeFileSync(DATA_FILE,JSON.stringify(list,null,2));
    res.json({ok:true})
})

app.listen(PORT,()=>{
    console.log(`✅后端启动成功！地址：http://127.0.0.1:${PORT}`)
})
