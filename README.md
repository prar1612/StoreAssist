# StoreAssist
Cloud Services Project - StoreAssist by Team SaaS<br/>
Team Members: Akanksha Jaiswal, Jyothi H R, Manasi Sadanand Pai and Prarthana Hemanth

StoreAssist is an app built on AWS which would be a one stop portal for employees working at a large Store/Super Market say Target, Walmart etc.<br/>


The app is accessible at :https://storeassist.auth.us-east-2.amazoncognito.com/login?response_type=token&client_id=2t1kmm2o49pa0148dd1hopfslo&redirect_uri=https://storeassist.manasipai.com/StoreAssist.html <br/>

# Functionalities:<br/>
•	Capability to add in customers to the store’s rewards program. Here along with the basic details of the customer like Name, Email ID, Phone No., we would also take a picture of the customer and store it.<br/>
•	Whenever a registered customer comes to the store, at the checkout counter, we would have the ability to recognize the person by clicking a picture and retrieving their reward points details. So this gives the customer the ability to redeem rewards even when they have not carried their Rewards card.<br/>
•	Capability to post upcoming offers to Twitter, using a scheduled process. The employee would only have to update an excel sheet with the tweet and when it should be posted, and the rest would be handled by the system.<br/>
•	A chatbot which would help the employee answer customer concerns and queries.<br/><br/>

# Technical Specifications:<br/>
The app is built on AWS Cloud using Node JS Backend and it is completely serverless.<br/>
The AWS Services used are:<br/>
•	AWS Cognito<br/>
•	AWS S3<br/>
•	AWS DynamoDB<br/>
•	AWS Rekognition<br/>
•	AWS Lambda<br/>
•	AWS API Gateway<br/>
•	AWS Lex<br/>
•	AWS R53<br/>
•	AWS CloudFront<br/>
AWS Code Pipeline is used for CICD.






