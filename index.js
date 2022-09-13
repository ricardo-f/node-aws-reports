import express from 'express';
import { engine } from 'express-handlebars';
import AWS from 'aws-sdk';

const app = express()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'))

AWS.config.update({ region: 'us-east-1' });

const params = {};

app.get('/subnets/:region', function (req, res) {
  const region = req.params.region;
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: region });
  ec2.describeSubnets(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const subnetCount = await data.Subnets.length;
      const results = await data.Subnets;
      res.render('subnetwork', { results, region, subnetCount })
    }
  });
})

app.get('/network/:region', function (req, res) {
  const region = req.params.region;
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: region });
  ec2.describeVpcs(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const vpcCount = await data.Vpcs.length;
      const results = await data.Vpcs;
      res.render('network', { results, region, vpcCount })
    }
  });
})

app.get('/network/:region/peering', function (req, res) {
  const region = req.params.region;
  const ec2 = new AWS.EC2({ apiVersion: '2016-11-15', region: region });
  ec2.describeVpcPeeringConnections(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const peeringCount = await data.VpcPeeringConnections.length;
      const results = await data.VpcPeeringConnections;
      res.render('networkPeering', { results, region, peeringCount })
    }
  });
})

app.get('/iam', function (req, res) {
  const iam = new AWS.IAM({ apiVersion: '2010-05-08' });
  iam.listUsers(params, async (err, data) => {
    if (err) {
      console.log(err);
    } else {
      const userCount = await data.Users.length;
      const results = await data.Users;
      res.render('iam', { results, userCount })
    }
  });
})

app.get('/rds/instances/:region', function (req, res) {
  const region = req.params.region;
  const rds = new AWS.RDS({ apiVersion: '2014-10-31', region: region });
  rds.describeDBInstances(params, async (err, data) => {
    if (err) {
      console.log(err);
    }
    else {
      const dbCount = await data.DBInstances.length;
      const results = await data.DBInstances;
      res.render('rdsInstances', { results, region, dbCount})
    }
  });
})

app.get('/', function (req, res) {
  res.render('home')
})

app.listen(3000)