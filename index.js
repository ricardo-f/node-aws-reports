import express from 'express';
import { engine } from 'express-handlebars';
import AWS from 'aws-sdk';

const app = express()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'))

AWS.config.update({
  region: 'us-east-1'
});

const ec2 = new AWS.EC2({ apiVersion: '2016-11-15' });
const params = {};

app.get('/', function (req, res) {
  ec2.describeSubnets(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const results = await data.Subnets;
      res.render('home', { results })
    }
  });
})

app.listen(3000)