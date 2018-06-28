## 1. Init Serverless package
```
$ sls create -t aws-nodejs
```

1. Update the 'serverless.yml' configuration

2. Test configuration
```
$ sls config
```

3. Deploy
```
$ sls deploy
```

4. Test event
```
{
  "url": "https://r2---sn-hvcpauxa-nv4s.googlevideo.com/videoplayback?itag=140&pl=24&mime=audio%2Fmp4&fexp=23709359&c=WEB&keepalive=yes&pcm2cms=yes&mm=31%2C29&mn=sn-hvcpauxa-nv4s%2Csn-nv47ln7z&gir=yes&requiressl=yes&ei=WsYoW4KOFIS11gKt4p04&ms=au%2Crdu&mt=1529398734&mv=m&dur=198.089&expire=1529420474&ip=77.70.63.244&key=yt6&lmt=1508866017022484&id=o-ADZn8HIqqFLtaf1Ig5-7HwDw5HgpRu835UtwCVaMKgaj&fvip=2&source=youtube&initcwndbps=1551250&ipbits=0&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Ckeepalive%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpcm2cms%2Cpl%2Crequiressl%2Csource%2Cexpire&clen=3146781&ratebypass=yes&signature=37B854A52E29F92FE15935D988D7F41E72BDD0B7.1E0B443FA2036ADB7FEFC457ED52FC70F3F66ADF",
  "filename": "Dan Auerbach - The Prowl.aac",
  "key": "1529398872917 - Dan Auerbach - The Prowl"
}
```

## 2. Install FFMPEG

## 3. Install Exodus 
See https://github.com/intoli/exodus
```
$ pip install --user exodus_bundler
```

For Linux add in '~/.bashrc':
```
export PATH="~/.local/bin/:${PATH}"
```

For Windows
```
PATH=%PATH%;C:\Users\rumen\AppData\Roaming\Python\Python36\Scripts
```

## 4. Bundle FFMPEG with Exodus TODO:
In order to be able to access FFMPEG from the AWS Lambda container we have to upload the binary somehow



## 5. Lambdifying the Express App (e.g run on Lambda with API Gateway)
1. Install aws-serverless-express
```
$ npm install aws-serverless-express
```

2. Crete new Lambda handler (lambda-express.js)
```
const awsServerlessExpress = require('aws-serverless-express');
const app = require('../app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => (
    awsServerlessExpress.proxy(server, event, context)
);
```

3. Add a lambda handler
```
functions:
  app-express:
    handler: aws/lambda-express.handler
    timeout: 30
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

## Finally Create a Bookmarklet