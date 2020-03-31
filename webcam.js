 
var myParam = 'sulalitha01@gmail.com';
var emailId = '';
// window.onload = function() {
//                         var urlParams = new URLSearchParams(Window.location.search);
//                         myParam = urlParams.get('param1');
// }

var imageList =[];
var images='';
var folderBucketName = 'storewebcamimg';
var bucketRegion = 'us-east-2';
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
          console.log(err)
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

//function called on click of authenticate
function auth(){
	var params1= {
  Bucket: "rewardsprgmcustimages"
 };
 s3.listObjects(params1, function(err, data) {
   if (err) console.log(err, err.stack); // an error occurred
   else     {
   var t = JSON.stringify(data.Contents[0].Key); 
   console.log("data = " + t);
	var imgs = data.Contents.map(function(res){
		 var fileKey = res.Key;
		var lastchar = fileKey.charAt(fileKey.length-1)
		 if(lastchar != '/' ) {
			images+=fileKey +','
            imageList.push(fileKey);
		 }
    });
    
    var newStr;
    newstr  = images.slice(0, -1);
	
  authenticate(newstr);
	 }
   });
   
   
}

//function to do the facial comparison
function authenticate(newstr){
    var res = newstr.split(',');
    var match = false;
    var s3_imagename = '';
    var num_compares = 0;
    
      
       for(var i=0;i<res.length;i++){
        console.log('res[i]...' + res[i]);
        const client = new AWS.Rekognition();
      
       const params = {
        SimilarityThreshold: 95,
         SourceImage: {
           S3Object: {
             Bucket: "storewebcamimg",
             Name: myParam+".jpg"
           },
         },
         TargetImage: {
           S3Object: {
             Bucket: "rewardsprgmcustimages",
             Name: res[i]
           },
         }
       }
        client.compareFaces(params, function(err, response) {
         num_compares++;
         if (err) {
           console.log( "params =  " + JSON.stringify(params));
           console.log(err, err.stack); // an error occurred
         } else {
           console.log("params=  " + JSON.stringify(params));
           console.log("response JSON =  " + JSON.stringify(response));
           console.log("response " + response);
        //  console.log(response.FaceMatches);
        //    response.FaceMatches.forEach(data => {
        //      let position   = data.Face.BoundingBox
        //      let similarity = data.Similarity
            
        //      console.log(`The face at: ${position.Left}, ${position.Top} matches with ${similarity} % confidence`)
        //     match =true;
        //     console.log(match);
        //    }) // for response.faceDetails
           if(response.FaceMatches.length > 0) {
            match=true;
            s3_imagename = params.TargetImage.S3Object.Name;
            console.log(s3_imagename)
           }

           if (num_compares == res.length)
           {
             if (match)
             {
               successFunction(s3_imagename);
             }
             else
             {
              errorFunction();
             }
           }
           final = match;
           return match;
          //  newList.push(match);
          //  console.log(newList.length);
          //  console.log(newList);
          //  console.log(res);
          //  let index;
           //Fetching the name of the matched face in order to display image from s3
          //  for(let i=0;i < newList.length;i++)
          //  {
          //    console.log(i);
          //    if(newList[i] === true)
          //    index = i;
          //    console.log(index)
          //    break;
          //  }

          //  if(newList.length == res.length) {
           
          //       var temp = newList.includes(true);
          //       if(temp){
          //           successFunction();
          //       }	
          //        else{
          //       errorFunction();
          //  }
          //  }
          
          //final = match;
         // return match;
         } 
       });
       
       }
      }
      function successFunction(s3_imagename){
        console.log("success")
        document.getElementById("app").style="display:none;";
        document.getElementById("my_camera").style = "display:none";
        document.getElementById("authBtn").style = "display:none";
        document.getElementById("success").style="display:block;";
        //getDetails(s3_imagename);
        emailId = s3_imagename.split(".jpg")[0];
        display_details(s3_imagename);
        
       }
      function errorFunction(){
      //alert(JSON.stringify(TargetImage));
        document.getElementById("app").style="display:none;";
        document.getElementById("error").style="display:block;";
        
        var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
        var params = {
      UserPoolId: 'us-east-2_Ah2t3hSsZ', /* required */
      Username: myParam /* required */
    };
    cognitoidentityserviceprovider.adminGetUser(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else    { console.log(JSON.stringify(data.UserAttributes[2].Value)); 
        emailId = data.UserAttributes[2].Value;
        sendEmail(emailId);
        
    }
      // successful response
    });
        console.log(emailId);
}

function display_details(s3_imagename)
{
  email_id = s3_imagename.split(".jpg")[0];
  var mimes = {
    'jpeg': 'data:image/jpeg;base64,'
  };
  
  AWS.config.update({
      signatureVersion: 'v4',
      region: 'us-east-1',
      accessKeyId: '',
      secretAccessKey: ''
  });
  
  var bucket = new AWS.S3({params: {Bucket: 'rewardsprgmcustimages'}});
  
  function encode(data)
  {
      var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
      return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }
  
  function getUrlByFileName(fileName,mimeType) {
      return new Promise(
          function (resolve, reject) {
              bucket.getObject({Key: fileName}, function (err, file) {
                  var result =  mimeType + encode(file.Body);
                  resolve(result)
              });

          }
      );
  }
  
  getUrlByFileName(s3_imagename, mimes.jpeg).then(function(data) {
      var image = document.getElementById("image");
      image.src = data;
      image.height = image.width = 200;
      document.getElementById("email_col").innerText = emailId;
  });

  displayUserInfo(emailId);
  document.getElementById("image").style = "display:block";
  document.getElementById("info").style = "display:block";
}

function displayUserInfo(emailId)
{
  var request = new XMLHttpRequest()
  request.open('GET', 'https://xmlsjm85s6.execute-api.us-east-2.amazonaws.com/prod/customers?Email_ID=' + emailId, true);
  request.onload = function()
  {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        var user_info = data.Item;
        document.getElementById("first_name_col").innerHTML = user_info.FirstName;
        document.getElementById("last_name_col").innerHTML = user_info.LastName;
        document.getElementById("phone_col").innerHTML = user_info.PhoneNumber;
        document.getElementById("points_col").innerHTML = user_info.RewardPoints;      
    } else {
      console.log('error while fetching data ' + request.status);
    };  
  }
  request.send();
}

function addPoints()
{
  var request = new XMLHttpRequest()
  request.open('GET', 'https://xmlsjm85s6.execute-api.us-east-2.amazonaws.com/prod/customers?Email_ID=' + emailId, true);
  request.onload = function()
  {
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
      var add_points = parseInt(document.getElementById("add_rewards").value);
      var cur_points = data.Item.RewardPoints;
      var add_request = new XMLHttpRequest()
      var total_points = cur_points + add_points;
      console.log("cur_points = " + cur_points);
      console.log("add_points = " + add_points);
      console.log("total points = " + total_points);
      add_request.open('PATCH', 'https://xmlsjm85s6.execute-api.us-east-2.amazonaws.com/prod/customers?Email_ID='+emailId+'&rewardsPoint=' + total_points);
      add_request.onload = function()
      {
        if (add_request.status >= 200 && add_request.status < 400)
        {
          document.getElementById("points_col").innerHTML = total_points;
          alert("Succesfully added reward points");
        }
        else
        {
          alert("Unable to add reward points. Please retry after some time");
        }
      }
      add_request.send();
    } else {
      console.log('error while fetching data ' + request.status);
    };  
  }
  request.send();
}
