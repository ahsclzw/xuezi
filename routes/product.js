const express=require('express');
const pool=require('../pool.js');
var router=express.Router();
//商品列表
router.get('/list',function(req,res){
var obj=req.query;
	if(!obj.pno){obj.pno=1};
	if(!obj.count){obj.count=9};
	obj.pno=parseInt(obj.pno);
	obj.count=parseInt(obj.count);
    pool.query('SELECT lid,title,price FROM xz_laptop LIMIT ?,?',[(obj.pno-1)*obj.count,obj.count],function(err,result){
	if(err) throw err;
    res.send(result);
	});
});
//商品添加
router.post('/add',function(req,res){
 var obj=req.body;
 //console.log(obj);
var i=400;
for(var key in obj){
	i++;
   //console.log(key,obj[key]);
   if(!obj[key]){res.send({code:i,msg:key+' required'}); return;} 
}
 pool.query('INSERT INTO xz_laptop SET ?',[obj],function(err,result){
 if(err) throw err;
 console.log(result);
if(result.affectedRows>0){res.send({code:200,msg:'add suc'});}else{res.send({code:404,msg:'add err'});}

 });
});



















module.exports=router;