# 二维码识别和生成服务

## 服务功能

* 根据文字生成二维码图片
* 根据二维码图片识别内容

## 举例

### 生成
GET接口: /qr/qr?d=xxxxxx

curl http://127.0.0.1:3003/qr/qr?d=测试中文二维码生成

### 识别
PUT接口: /qr/decode

curl -T qr.png http://127.0.0.1:3003/qr/decode

