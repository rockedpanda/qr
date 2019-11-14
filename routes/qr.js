var express = require('express');
var router = express.Router();
var qr = require('qr-image');
var qrcodeReader = require('../lib/qrcode.js');


function streamToBuffer(stream, cb){
    var bufs = [];
    stream.on('data', function(d){ bufs.push(d); });
    stream.on('end', function(){
        var buf = Buffer.concat(bufs);
        cb(buf);
    });
}

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

module.exports = router;
