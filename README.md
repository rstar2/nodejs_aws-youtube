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

## 2. Install FFMPEG

## 3. Install Exodus 
See https://github.com/intoli/exodus
```
$ pip install --user exodus_bundler
```

### Add the Exodus executable to the path

For Linux add in '~/.bashrc':
```
$ export PATH="~/.local/bin/:${PATH}"
```

For Windows (the p)
```
$ PATH=%PATH%;%userhome%\AppData\Roaming\Python\Python36\Scripts
```

## 4. Bundle FFMPEG with Exodus
In order to be able to access FFMPEG from the AWS Lambda container we have to upload the binary somehow

## For Linux
```
# Create an `ffmpeg` bundle and extract it in the current directory.
$ exodus --tarball ffmpeg | tar -zx
```

## 5. Lambdifying the Express App (e.g run on Lambda with API Gateway)
1. Install aws-serverless-express
```
$ npm install aws-serverless-express
```

2. Create new Lambda handler (lambda-express.js)
Using: ```$ npm i aws-serverless-express```

```
const awsServerlessExpress = require('aws-serverless-express');
const app = require('../app');
const server = awsServerlessExpress.createServer(app);

exports.handler = (event, context) => (
    awsServerlessExpress.proxy(server, event, context)
);
```

Using: ```$ npm i serverless-http```

```
const serverless = require('serverless-http');
const app = require('../app');

exports.handler = serverless(app);
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
When a bookmark/bookmarklet is clicked while we are for instance in a YouTube page
then it will be executed in the context of the current page.
So to execute JavaScript in the same page context just use the "javascript:" prefix:

For using the AWS transcode url
```
javascript:window.open(`{{aws-lambda-http-gateway}}/{{stage}}/view/download/${encodeURIComponent(window.location.href)}`)
```


## When the local-express app is deployed to a different server it has to have proper AWS credentials:
E.g. like existing AWS profile in ~/.aws/credentials