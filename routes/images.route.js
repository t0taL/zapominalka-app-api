const path = require('path');
const { Router } = require('express');


const router = Router();

router.get('/', async (req, res) => {
  console.log('get image');
  try {
    const imageFileName = req.query['fileName'];

    res.status(200).sendFile(path.join(__dirname, '../images', imageFileName));
  } catch (error) {
    console.log(error);
    res.status(500).json('Unexpected error...');
  }
});


module.exports = router;
