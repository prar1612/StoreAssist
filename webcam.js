
	var userName ;
	function register(){
		//alert('hey');
		document.getElementById("regForm").style.display = "block";
		document.getElementById("succMsg").style.display = "none";
		
		
		
	}
	
  
		jQuery.support.cors = true;
		$(document).ready(function() {
			 $(".nav-tabs a").click(function(){
    $(this).tab('show');
	
  });
  
				
				
			var customerDetailsViewModel = function() {
				var self = this;
				self.EmailID = ko.observable("");
				self.FirstName = ko.observable("");
				self.LastName = ko.observable("");
				self.PhoneNum = ko.observable("");
				self.SuccessMessage = ko.observable("");
				self.SaveCustomerDetails = function () { 
						//alert('Hi');
					var fn = document.getElementById("fName").value;
					var ln = document.getElementById("lName").value;
					var em = document.getElementById("email").value;
					var ph = document.getElementById("phone").value;
					if(fn == '' || ln == '' || ph == '' || em == ''){
						alert('Please fill in all the fields before submitting.')
					}
					else{
						
							var CustomerDetail = {
							EmailID: self.EmailID(),
							FirstName: self.FirstName(),
							LastName: self.LastName(),
							PhoneNum: self.PhoneNum()
						
						}
						$.ajax({
							crossDomain: true,
						
							url: 'https://ar0o3d9r6k.execute-api.us-east-2.amazonaws.com/DEV/postcustomerdetails',
							
							
							cache: false,
							type: 'POST', 
							data: ko.toJSON(CustomerDetail),
							success: function (data) {             
										userName = document.getElementById("email").value;
										console.log(userName);
								self.SuccessMessage(data)
									self.EmailID('');
									self.FirstName('');
									self.LastName('');
									self.PhoneNum('');
									document.getElementById("regForm").style.display = "none";
									document.getElementById("succMsg").style.display = "block";
									document.getElementById("results").innerHTML = "";
									 Webcam.set({
									  width: 320,
									  height: 240,
									  image_format: 'jpeg',
									  jpeg_quality: 90
									 });
									 Webcam.attach( '#my_camera' );
								
							}
							}).fail(
							
							
							function(xhr, textStatus, err){
							alert("Error happened "+err);
							
						});
						}
				};
			}
			 var viewModel = new customerDetailsViewModel();
            ko.applyBindings(viewModel);
		});
	function take_snapshot() {
 
 // take snapshot and get image data
 Webcam.snap( function(data_uri) {
  // display results in page
  document.getElementById('results').innerHTML = 
  '<img src="'+data_uri+'"/>';
  console.log(data_uri);
  console.log(JSON.stringify(dataURItoBlob(data_uri)));
  addFile(dataURItoBlob(data_uri))
  } );
 // document.getElementById("authBtn").style="display:block;margin-left:39%;";
}

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
function addFile(fileToUpload) {

console.log(userName);
//should name the image using cognito user's username
  var fileName = userName+'.jpg';
 
  var fileKey = fileName;
 //update config
AWS.config.update({
  region: 'us-east-2',
    accessKeyId:'access',
     secretAccessKey: 'secret',
 
});

var s3 = new AWS.S3({
  params: {Bucket: 'rewardsprgmcustimages'}
});

	s3.upload({
    Key: fileKey,
    Body: fileToUpload,
	
  }, function(err, data) {
    if (err) {
		
      return alert(err.message);
    }
	else{
		console.log('Successfully uploaded image');
		alert('Successfully registered New user!');
		document.getElementById("regForm").style.display = "block";
		document.getElementById("succMsg").style.display = "none";
    }
   
  });
  
  
  
}
//Prarthana- JS End
//Jyothi- JS start
function retrieve(){
Webcam.set({
width: 320,
height: 240,
image_format: 'jpeg',
jpeg_quality: 90
});
Webcam.attach( '#my_camera1' );
}
function take_snapshot1() {

// take snapshot and get image data
Webcam.snap( function(data_uri) {
// display results in page
document.getElementById('results1').innerHTML = 
'<img src="'+data_uri+'"/>';
//call function to add file to S3
addFile1(dataURItoBlob(data_uri))
} );
document.getElementById("authBtn").style="display:block;margin-left:39%;";
}

function addFile1(fileToUpload) {
var myParam = 'sulalitha01@gmail.com';
    console.log('Adding to S3');
    //should name the image using cognito user's username
      var fileName = myParam+'.jpg';
     
      var fileKey = fileName;
     AWS.config.update({
  region: 'us-east-2',
    accessKeyId:'access',
     secretAccessKey: 'secret',
 
});

var s3 = new AWS.S3({
params: {Bucket: "storewebcamimg"}
});
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
	
	//function called on click of authenticate
function auth(){
	var images='';
	var imageList =[];
	var s3 = new AWS.S3({});
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
	var myParam = 'sulalitha01@gmail.com';
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
        document.getElementById("error").style = "display:none";
        document.getElementById("success").style="display:block;";
        //getDetails(s3_imagename);
        emailId = s3_imagename.split(".jpg")[0];
        display_details(s3_imagename);
        
       }
      function errorFunction(){
      //alert(JSON.stringify(TargetImage));
        //document.getElementById("app").style="display:none;";
        
        document.getElementById("error").style="display:block;";
        
        alert("You Are Not Authorized");
        document.getElementById("error").style="display:none;";
        
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
      accessKeyId: 'access',
      secretAccessKey: 'secret'
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
      var cur_points = parseInt(data.Item.RewardPoints);
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
          document.getElementById("app").style.display="block";
          document.getElementById("success").style.display="none";
          document.getElementById("image").style.display="none";
          document.getElementById("info").style.display="none";
          document.getElementById("add_rewards").value ="";
          
        }
        else
        {
          alert("Unable to add reward points. Please retry after some time");
          document.getElementById("app").style.display="block";
          document.getElementById("success").style.display="none";
          document.getElementById("image").style.display="none";
          document.getElementById("info").style.display="none";
          document.getElementById("add_rewards").value ="";
        }
      }
      add_request.send();
    } else {
      console.log('error while fetching data ' + request.status);
    };  
  }
  request.send();
}

function redeemPoints()
{
  console.log("inside redeem")
  var request = new XMLHttpRequest()
  request.open('GET', 'https://xmlsjm85s6.execute-api.us-east-2.amazonaws.com/prod/customers?Email_ID=' + emailId, true);
  request.onload = function(){
  var data = JSON.parse(this.response);
  if (request.status >= 200 && request.status < 400) {
    var redeem_points = parseInt(document.getElementById("redeem_rewards").value);
    var cur_points = data.Item.RewardPoints;
    console.log("current_points = " +cur_points);
    var redeem_request = new XMLHttpRequest()
     if(redeem_points > cur_points){
       alert("can not redeem points,u have only" + cur_points);
       document.getElementById("redeem_rewards").value ="";
     }
     else{
       var total_points = cur_points - redeem_points;
       redeem_request.open('PATCH', 'https://xmlsjm85s6.execute-api.us-east-2.amazonaws.com/prod/customers?Email_ID='+emailId+'&rewardsPoint=' + total_points);
       redeem_request.onload = function()
      {
        if (redeem_request.status >= 200 && redeem_request.status < 400)
        {
          document.getElementById("points_col").innerHTML = total_points;
          alert("Succesfully redeemed reward points");
          document.getElementById("app").style.display="block";
          document.getElementById("success").style.display="none";
          document.getElementById("image").style.display="none";
          document.getElementById("info").style.display="none";
          document.getElementById("redeem_rewards").value ="";
        }
        else
        {
          alert("Unable to redeem. Please retry after some time");
          document.getElementById("app").style.display="block";
          document.getElementById("success").style.display="none";
          document.getElementById("image").style.display="none";
          document.getElementById("info").style.display="none";
          document.getElementById("redeem_rewards").value ="";
        }
      }
      redeem_request.send();
    }


     }
     
     else {
      console.log('error while fetching data ' + request.status);
    }; 
  } 
  request.send();   
}
//Jyothi- JS end