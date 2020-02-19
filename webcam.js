 
var myParam = '';
var emailId = '';
window.onload = function() {
                        var urlParams = new this.URLSearchParams(Window.location.search);
                        myParam = urlParams.get('param1');
}

var  imageList =[];
var images='';
var folderBucketName = 'rewardsprgmcustimages';
var bucketRegion = 'us-east-1';
var final;
var newList =[];
//update config
AWS.config.update({
region: bucketRegion,
accessKeyId: '',
    secretAccessKey: '' ,

});

var s3 = new AWS.S3({
params: {Bucket: folderBucketName}
});

Webcam.set({
width: 320,
height: 240,
image_format: 'jpeg',
jpeg_quality: 90
});
Webcam.attach( '#my_camera' );

//Code to take picture and call function to upload to S3//
function take_snapshot() {

// take snapshot and get image data
Webcam.snap( function(data_uri) {
// display results in page
document.getElementById('results').innerHTML = 
'<img src="'+data_uri+'"/>';
//call function to add file to S3
addFile(dataURItoBlob(data_uri))
} );
document.getElementById("authBtn").style="display:block;margin-left:39%;";
}


function addFile(fileToUpload) {

    console.log('Adding to S3');
    //should name the image using cognito user's username
      var fileName = myParam+'.jpg';
     
      var fileKey = fileName;
     
        s3.upload({
        Key: fileKey,
        Body: fileToUpload,
        
      }, function(err, data) {
        if (err) {
            
          return alert('There was an error uploading your image: ', err.message);
        }
        console.log('Successfully uploaded image');
        
       
      });
      
      
      
    }
    
    //function to convert URI to BLOB
    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
    
        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    
        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        return new Blob([ia], {type:mimeString});
    }

