const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../../../Videos/8055421-large.jpeg');

// const accessKeyId = 'AKIA2GEA6ZD3DSL5P3QA'
// const secretAccessKey = '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'

function awsPutObject () {
    const s3 = new AWS.S3();

    let imageFile = fs.readFileSync(filePath, 'base64');

    const data = s3.putObject({
        Bucket: 'blogs-app',
        Key: '8055421-large.jpeg',
        Body: imageFile
    }).promise().then((data) => {
        console.log(data)
    }).catch(err => console.log(err));

}

awsPutObject();