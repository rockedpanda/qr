var Jimp = require("jimp");
var QrCode = require('qrcode-reader');

function read(buffer) {
    //var buffer = fs.readFileSync(__dirname + '/image.png');
    return new Promise(function (resolve, reject) {
        Jimp.read(buffer, function (err, image) {
            if (err) {
                console.error(err);
                return reject(err);
            }
            var qr = new QrCode();
            qr.callback = function (err, value) {
                if (err) {
                    console.error(err);
                    return reject(err);
                }
                console.log(value.result);
                // console.log(value);//详细识别结果
                resolve(value.result);
            };
            qr.decode(image.bitmap);
        });
    });
}

exports.read = read;