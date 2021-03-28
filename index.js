const express = require('express');
const { getInstImgUrl } = require('./process-url');

const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname +'/index.html');
})

app.post('/url', async (req, res) => {
  const {instUrl} = req.body;
  console.log(req.body)
  try {
    const imgUrls = await getInstImgUrl(instUrl);
    res.status(200).send({imgUrls})
  } catch (error) {
    res.status(500).send({error})
  }
  
  
})

app.listen(port, ()  => console.log('Server is running on port %s', port))