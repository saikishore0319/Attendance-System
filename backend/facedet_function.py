import boto3
import json
from datetime import datetime
rekognition = boto3.client('rekognition', region_name='ap-south-1')
dynamodb = boto3.resource('dynamodb', region_name='ap-south-1')
TABLE_NAME = "AttendanceLogs"
def lambda_handler(event, context):   
    print(f"New event: {event}")
    try:
        bucket = event['Records'][0]['s3']['bucket']['name']
        photo = event['Records'][0]['s3']['object']['key']
        response = rekognition.search_faces_by_image(
            CollectionId='employee_faces',
            Image={'S3Object': {'Bucket': bucket, 'Name': photo}},
            MaxFaces=1,
            FaceMatchThreshold=75
        )
        matches = response.get('FaceMatches', [])
        if matches:
            emp_id = matches[0]['Face']['ExternalImageId']
            confidence = matches[0]['Similarity']
            print(f"Found him: {emp_id} with {confidence}% match")
            save_to_db(emp_id, "PRESENT", photo)
            return {
                'statusCode': 200,
                'body': json.dumps({'message': f'Welcome {emp_id}', 'match': True})
            }
        else:
            print("No clue who this is.")
            save_to_db("UNKNOWN_USER", "ABSENT/FAILED", photo)
            return {
                'statusCode': 403,
                'body': json.dumps({'message': 'Who are U ?', 'match': False})
            }
    except Exception as e:
        print(f"Something went wrong: {str(e)}")
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
        print("Attendanc Successfully logged .")
    except Exception as e:
        print(f"Failed to logg attendance: {str(e)}")