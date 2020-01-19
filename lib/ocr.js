const child_process = require('child_process');
const fs = require('fs');
const fetch = require('node-fetch');
let index = 0;

function getIndex(){
    index = (index+1)%1000;
    return Date.now()+'_'+(index);
}

function decodeBuf(buf){
    let i = getIndex();
    let fName = 'public/'+i+'.png';
    fs.writeFileSync(fName, buf);
    return new Promise(function(resolve, reject){
        child_process.exec(`"C:/Program Files/Tesseract-OCR/tesseract.exe" ${fName} public/${i+'_ans.log'} -l chi_sim`,function(err,stdout,stderr){
            if(err){
                console.log(err);
                reject(err);
            }else{
                console.log(stdout, stderr);
            }
            fs.readFile('public/'+i+'_ans.log.txt','utf8', function(err, data){
                if(err){
                    console.log(err);
                }
                console.log(data);
                let ans = data.split('\n');
                resolve(ans.slice(0,ans.length-1));
            });
        });
        //tesseract.exe d:\tmp\a3.png d:\tmp\a3 -l chi_sim
        //fs.createWriteStream(i+'.png')
    });
}

function decodeBySvr(buf){
    return fetch(configInfo.ocrURL,{
        method:"PUT",
        // headers:{
        //     "Content-Type":""
        // }
        body: buf
    }).then(x=>x.json());
}

exports.decodeBuf = decodeBuf;
exports.decodeBySvr = decodeBySvr;
