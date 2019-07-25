const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器对象
var router=express.Router();
//添加路由
//1.用户注册
router.post('/reg',function(req,res){
	var obj=req.body;
	console.log(obj);
	//验证数据是否为空
	if(!obj.uname){
	   res.send({code:401,msg:'uname required'});
	   //阻止往后执行
	   return;
	}
if(!obj.upwd){
	   res.send({code:402,msg:'upwd required'});
	   //阻止往后执行
	   return;
	}
if(!obj.email){
	   res.send({code:403,msg:'email required'});
	   //阻止往后执行
	   return;
	}
if(!obj.phone){
	   res.send({code:404,msg:'phone required'});
	   //阻止往后执行
	   return;
	}
	//执行SQL语句
	pool.query('INSERT INTO xz_user SET ?',[obj],function(err,result){
	if(err) throw err;
	console.log(result);
	if(result.affectedRows>0){res.send({code:200,msg:'register suc'});} 
	});
});
//2.用户登录
router.post('/login',function(req,res){
    var obj=req.body;
    if(!obj.uname){
	   res.send({code:401,msg:'uname required'});
	   return;
	}
if(!obj.upwd){
	   res.send({code:402,msg:'upwd required'});
	   return;
	}
	pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],function(err,result){
	  if(err) throw err;
	  console.log(result);
	  if(result.length){res.send({code:200,msg:'login suc'});}else{
	  res.send({code:301,msg:'login err'});
	  }
	});
});
//3.检索用户
router.get('/detail',function(req,res){
    var obj=req.query;
	if(!obj.uid){
	res.send({code:401,msg:'uid required'});
	return;
	}
	pool.query('SELECT * FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
	if(err) throw err;
	console.log(result);
	if(result.length){res.send(result[0]);}else{
	res.send({code:301,msg:'can not found'});
	}
	});
});
//4.修改用户
router.get('/update',function(req,res){
var obj=req.query;
//console.log(obj);
var i=400;
for(var key in obj){
	i++;
   //console.log(key,obj[key]);
   if(!obj[key]){res.send({code:i,msg:key+' required'}); return;} 
}
pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],function(err,result){
   if(err) throw err;
   console.log(result);
   if(result.affectedRows>0){res.send({code:200,msg:'update suc'});}else{res.send({code:404,msg:'change err'});}
});
});
//5.用户列表
router.get('/list',function(req,res){
    var obj=req.query;
	if(!obj.pno){obj.pno=1};
	if(!obj.size){obj.size=3};
	obj.pno=parseInt(obj.pno);
	obj.size=parseInt(obj.size);
    pool.query('SELECT * FROM xz_user LIMIT ?,?',[(obj.pno-1)*obj.size,obj.size],function(err,result){
	if(err) throw err;
    res.send(result);
	});
});
//6.删除用户
router.get('/delete',function(req,res){
 var obj=req.query;
 if(!obj.uid){res.send({code:401,msg:'uid is null'});return;};
 pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],function(err,result){
 if(err) throw err;
 if(result.affectedRows>0){res.send({code:200,msg:'delete suc'});}else{res.send({code:301,msg:'delete err'});}
 });
});



//导出路由器对象
module.exports=router;
