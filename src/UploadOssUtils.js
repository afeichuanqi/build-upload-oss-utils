const fs = require('fs')
const path = require('path');
const OSS = require('ali-oss');
const Async = require('async');
const ProgressBar = require('./ProgressBar')

class UploadOssUtil {
    ossConfig = {
        accessKeyId: "",
        accessKeySecret: "",
        bucket: "",
        region: "",
        bucketPath: '',
        enable: true,
        buildPath: '/build',
    }
    constructor(config) {
        if (config) {
            this.ossConfig = config;
            return ;
        }
        fs.readFile(path.resolve('uploadOss.config.json'), 'utf8', (err, data) => {
            if (err) {
                this.ossConfig = null;
                return;
            }

            this.ossConfig = Object.assign(this.ossConfig,JSON.parse(data));
            this.run()
        })
    }

    run () {
        const _this = this;
        if (!this.ossConfig || !this.ossConfig.enable) {
            return ;
        }
        const outputPath = path.join(__dirname, '../', this.ossConfig.buildPath);
        const client = new OSS(this.ossConfig);
        const headers = [{
            allowedOrigin: '*',
            allowedMethod: 'GET',
            allowedHeader: '*',
            exposeHeader: 'Content-Length',
            maxAgeSeconds: '3600'
        }];
        const promises = [];
        const files = fs.readdirSync(outputPath);
        const pb = new ProgressBar('上传进度', 50);
        let num = 0, total = files.length;
        for (const filePathName of files) {
            promises.push(async function () {
                const result = await client.put(`${_this.ossConfig.bucketPath}${filePathName}`, path.normalize(`${outputPath}/${filePathName}`), { headers });
                if (result && result.url) {
                    num++;
                    if (num <= total) {
                        // 更新进度条
                        pb.render({ completed: num, total });

                    }
                }
                return (result && result.url) || ''
            })
        }

        Async.eachSeries(promises, async function (item) {
            await item();
        }, function () {
            console.log('\n全部文件上传完毕')
        });
    }
}
module.exports = UploadOssUtil;