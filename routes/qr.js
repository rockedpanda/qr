var express = require('express');
var router = express.Router();
var qr = require('qr-image');
var qrcodeReader = require('../lib/qrcode.js');
var ocr = require('../lib/ocr.js');

function streamToBuffer(stream, cb){
    var bufs = [];
    stream.on('data', function(d){ bufs.push(d); });
    stream.on('end', function(){
        var buf = Buffer.concat(bufs);
        cb(buf);
    });
}


router.use('/*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS,PUT,DELETE");
    res.header("Access-Control-Allow-Credentials", "true");

    if (req.method == "OPTIONS") {
        res.sendStatus(204);
        return res.send('OK');
    }
    else {
        next();
    }
});

/**
 * 根据文本生成二维码图片(PNG格式)
 * 仅支持GET
 * d 传入的参数,默认值为当前页面路径,
 * 用例: http://127.0.0.1:3000/qr/qr?d=1qfasdfasdfasdfasdfasdf
 */
router.get('/qr',function (req, res, next) {
    res.status(200);
    var d = req.query.d || req.originalUrl;
    if (d.length > 1000) {
        d = d.substr(0, 1000);
    }
    res.setHeader("Content-Type", "image/png");
    var qr_svg = qr.image(d, { type: 'png' });
    qr_svg.pipe(res);
});

router.put('/decode', function(req, res, next){
    streamToBuffer(req, function(buf){
        qrcodeReader.read(buf).then(x=>{
        res.send({error_code:0,data:x,msg:''});
        }).catch(err=>{
        res.send({error_code:1,data:null,msg:'识别出错'});
        });
    })
});
router.put('/dec', function(req, res, next){
    streamToBuffer(req, function(buf){
        /* Promise.race([
            qrcodeReader.read(buf),
            ocr.decodeBySvr(buf)
        ]).then(x=>{
            res.send({error_code:0,text:x, data:x ,msg:''});
        }).catch(err=>{
            res.send({error_code:1,text:'', data:null,msg:'识别出错'});
        }); */
        qrcodeReader.read(buf).then(x=>{
            console.log(x);
            // if(!x.trim()){
            //     return res.send({error_code:0,text:['未识别到二维码'],msg:''});
            // }
            res.send({error_code:0,text:[x], data:x ,msg:''});
        }).catch(err=>{
            console.log('err', err);
            // ocr.decodeBuf(buf).then(x=>{
            ocr.decodeBySvr(buf).then(x=>{
                res.send(x);
            }).catch(err=>{
                res.send({error_code:1,data:null,msg:'识别出错'});
            });
        });
    });

    
});



module.exports = router;
