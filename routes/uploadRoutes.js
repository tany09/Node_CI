const AWS = require('aws-sdk');
const keys = require('../config/dev');
const uuid = require('uuid');
const requireLogin = require('../middlewares/requireLogin');

const s3 = new AWS.S3({
    accessKeyId: keys.accessKeyId,
    secretAccessKey: keys.secretAccessKey,
    signatureVersion: 'v4',
    region: 'ap-south-1'
});

module.exports = app => {
    app.get('/api/upload', requireLogin, (req, res) => {
        const key = `${req.user.id}/${uuid()}.jpeg`;

        s3.getSignedUrl('putObject', {
            Bucket: 'blogs-app',
            ContentType: 'image/jpeg',
            Key: key
        }, (err, url) => {
            res.send({key, url});
        });

    });
}