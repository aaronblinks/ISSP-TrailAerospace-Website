const AWS = require('aws-sdk');
const credentials = require('./awsCredentials');
const bucketName = 'trailspace-sim-output';

// Set AWS credentials
AWS.config.update(credentials);

const s3 = new AWS.S3();

// List each object in S3 Bucket. Returns each object's key in an array
async function listObjects() {
  try {
    const params = {
      Bucket: bucketName
    };
    
    const data = await s3.listObjectsV2(params).promise();
    let objectsList = [];
    data.Contents.forEach(obj => {
      objectsList.push(obj.Key)
    })

    if (objectsList.length === 0) {
      throw new Error('Bucket is empty!')
    }

    return objectsList;

  } catch (err) {
    console.error("Error:", err);
  }
}

// Function to get text data of an S3 object
async function getObjectText(objectKey) {
  try {
    const params = {
      Bucket: bucketName,
      Key: objectKey
    };
    
    const data = await s3.getObject(params).promise();
    
    return data.Body.toString('utf-8');
  } catch (err) {
    console.error("Error:", err);
    return null;
  }
}

module.exports = { listObjects, getObjectText };


// Test retrieval of object data
// (async () => {
//   try {
//     objects = await listObjects();
//     csvData = await getObjectText(objects[0]);
//     console.log(csvData);
//   } catch (err) {
//     console.error("Error:", err);
//   }
// })();