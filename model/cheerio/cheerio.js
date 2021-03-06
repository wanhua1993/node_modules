// 这是一个用于爬虫 爬取网页信息内容 的第三方模块
var http = require('http');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var url = 'https://baike.baidu.com/item/%E5%B7%9D%E8%B4%9D'; // 这是自如的网址

var cheerio_f = function () {
    // 請求網頁內容
    http.get(url, function (res) {
        var html = ''
        res.on('data', function (data) {
            html += data; // 返回來的是該 url 頁面內容
        });
        res.on('end', function () {
            console.log('结束');
            var data = guolv(html);
            console.log(data);
            // save_pic(data);
        });
    }).on('error', function (err) {
        console.log(err);
    });
    // 過濾頁面內容信息
    function guolv(html) {
        if (html) {
            var $ = cheerio.load(html);
            var slideList = $('.tage_list');
            var slideListData = [];
            slideList.find('li').each(function (val) {
                var item = $(this);
                var text = item.find('.p_top').text();
                // var image_path = item.children('a').children('img').attr('_src');
                var aTitle = item.find('.format').text();
                slideListData.push({
                    text: text,
                    aTitle: aTitle
                });
            });
            return slideListData
        } else {
            console.log('沒有數據插入');
        }
    }
    // 將讀取到的圖片保存到本地
    function save_pic(photos) {
        for (var i = 0; i < photos.length; i++) {
            !(function (i) {
                var filePath = photos[i].image_path;
                request(filePath)
                    .pipe(fs.createWriteStream('./public/images/test' + i + '.png'))
                    .on('close', function () {
                        console.log('已經完成保存圖片');
                    });;
            })(i);
        }
    }
}

module.exports = cheerio_f;