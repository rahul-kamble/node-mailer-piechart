var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');
const { pugEngine } = require("nodemailer-pug-engine");
const QuickChart = require('quickchart-js');

var readHTMLFile = function (path, callback) {
    fs.readFile(path, { encoding: 'utf-8' }, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

const myChart = new QuickChart();

myChart
    .setConfig({
        type: 'doughnut',
        data: {
            labels: ['Marks1', 'Marks2', 'Marks3', 'Marks4', 'Marks5'],
            datasets: [{ data: [80, 70, 40, 30, 60] }]
        },
        options: {
            plugins: {
                doughnutlabel: { labels: [{ text: '56', font: { size: 18 } }, { text: 'Average' }] },
                datalabels: {
                    display: true,
                    font: {
                        size: 10,
                    }
                },
            },
        },
    })
    .setWidth(300)
    .setHeight(200)
    .setBackgroundColor('transparent');

const chartImageUrl = myChart.getUrl();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ur ID',
        pass: 'ur password'
    },
});

transporter.use('compile', pugEngine({
    templateDir: __dirname + '/view',
}));

readHTMLFile(__dirname + '/demo.html', function (err, html) {
    var template = handlebars.compile(html);
    var replacements = {
        user1: {
            name: "Prasad",
            average: "56%",
            marks1: "80%",
            marks2: "70%",
            marks3: "40%",
            marks4: "30%",
            marks5: "60%",
        },
    };
    var htmlToSend = template(replacements);


    var mailOptions = {
        from: 'rahul.kamble827@gmail.com',
        to: 'prasad21jan@gmail.com',
        subject: 'Attendance Report',
        html: htmlToSend,
        attachments: [{
            filename: 'image.png',
            path: myChart.getUrl(),
            cid: 'unique@kreata.ee' //same cid value as in the html img src
        }]
    };
    transporter.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        }
    });
});
