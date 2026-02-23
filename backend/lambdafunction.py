import boto3
import json
import logging
from datetime import datetime

logger = logging.getLogger()
logger.setLevel(logging.INFO)

rekognition = boto3.client('rekognition', region_name='us-east-1')
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

TABLE_NAME = "Days wasted here"

def lambda_handler(event, context):
    
    logger.info(f"Event received: {json.dumps(event)}")
    
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        photo = event['Records'][0]['s3']['object']['key']
        
        logger.info(f"Analyzing photo {photo} from bucket {bucket}")
        response = rekognition.search_faces_by_image(
            CollectionId='employee_faces',
            Image={'S3Object': {'Bucket': bucket, 'Name': photo}},
            MaxFaces=1,
            FaceMatchThreshold=75
        )
        
        face_matches = response.get('FaceMatches', [])

        if face_matches:
            employee_id = face_matches[0]['Face']['ExternalImageId']
            confidence = face_matches[0]['Similarity']
            
            logger.info(f"Match Found: {employee_id} ({confidence}% confidence)")
            
            save_to_db(employee_id, "PRESENT", photo)
            
            return {
                'statusCode': 200,
                'body': json.dumps({'message': f'Welcome {employee_id}', 'match': True})
            }
        else:
            logger.warning(f"No match found for photo: {photo}")
            save_to_db("UNKNOWN_USER", "ABSENT/FAILED", photo)
            
            return {
                'statusCode': 403,
                'body': json.dumps({'message': 'Who are U ?', 'match': False})
            }

    except Exception as e:
        logger.error(f"Error processing face recognition: {str(e)}")

def save_to_db(emp_id, status, image_key):
    try:
        table = dynamodb.Table(TABLE_NAME)
        table.put_item(
            Item={
                'EmployeeID': emp_id,
                'Timestamp': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                'Status': status,
                'S3Link': image_key
            }
        )
        logger.info("Attendanc Successfully logged .")
    except Exception as e:
        logger.error(f"Failed to logg attendance: {str(e)}")