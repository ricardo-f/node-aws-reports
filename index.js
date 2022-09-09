import express from 'express';
import { engine } from 'express-handlebars';
import AWS from 'aws-sdk';

const app = express()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'))

AWS.config.update({region: 'us-east-1'});

const params = {};

app.get('/network/:region', function (req, res) {
  const region = req.params.region;
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: region });
  ec2.describeSubnets(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const subnetCount = await data.Subnets.length;
      const results = await data.Subnets;
      res.render('network', { results, region, subnetCount})
    }
  });
})

app.get('/iam', function (req, res) {
  res.render('iam')
})

app.get('/', function (req, res) {
    res.render('home')
})

app.listen(3000)