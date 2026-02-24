import boto3
import json

rekog = boto3.client('rekognition', region_name='ap-south-1')
COLLECTION = "employee_faces" 

def lambda_handler(event, context):
    print(f"Enroll event: {event}")
    
    try:
        # getting bucketname and image name 
        bucket = event['Records'][0]['s3']['bucket']['name']
        photo = event['Records'][0]['s3']['object']['key']
        
        # getting emp id form the directory 
        emp_id = photo.split('/')[-1].split('.')[0]
        
        # Save face to AI database so it remembers them tomorrow
        res = rekog.index_faces(
            CollectionId=COLLECTION,
            Image={'S3Object': {'Bucket': bucket, 'Name': photo}},
            ExternalImageId=emp_id,
            MaxFaces=1,
            QualityFilter="AUTO",
            DetectionAttributes=['ALL']
        )
        
        print(f"Indexed face for: {emp_id}")
        return {
            'statusCode': 200,
            'body': json.dumps({'msg': f'Enrolled {emp_id}', 'success': True})
        }
        
    except Exception as e:
        print(f"Enroll failed: {str(e)}")
        return {'statusCode': 500, 'body': str(e)}