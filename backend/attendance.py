import json
import boto3
from datetime import datetime, timedelta, timezone
from boto3.dynamodb.conditions import Key
from urllib.parse import unquote_plus

rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")
s3 = boto3.client("s3")

attendance_table = dynamodb.Table("Attendance")
COLLECTION_ID = "attendance-collection"

IST = timezone(timedelta(hours=5, minutes=30))

def lambda_handler(event, context):

    record = event["Records"][0]
    bucket = record["s3"]["bucket"]["name"]
    key = unquote_plus(record["s3"]["object"]["key"])

    # Extract user_id from filename
    # We will name file like: user_id/timestamp.jpg
    user_id = key.split("/")[0]

    now = datetime.now(IST)

    # Rule 1: after 8 AM
    if now.hour < 8:
        return

    # Rule 2: prevent duplicate
    today = now.date()

    start_of_day = datetime.combine(
        today, datetime.min.time(), tzinfo=IST
    ).isoformat()

    end_of_day = datetime.combine(
        today, datetime.max.time(), tzinfo=IST
    ).isoformat()

    existing = attendance_table.query(
        KeyConditionExpression=
            Key("user_id").eq(user_id) &
            Key("timestamp").between(start_of_day, end_of_day)
    )

    if existing["Count"] > 0:
        return

    # Get image from S3
    response = s3.get_object(Bucket=bucket, Key=key)
    image_bytes = response["Body"].read()

    # Face verification
    search = rekognition.search_faces_by_image(
        CollectionId=COLLECTION_ID,
        Image={"Bytes": image_bytes},
        MaxFaces=1,
        FaceMatchThreshold=90
    )

    if not search["FaceMatches"]:
        return

    matched_id = search["FaceMatches"][0]["Face"]["ExternalImageId"]

    if matched_id != user_id:
        return

    attendance_table.put_item(
        Item={
            "user_id": user_id,
            "timestamp": now.isoformat(),
            "status": "PRESENT"
        }
    )
    
s3.delete_object(Bucket=bucket, Key=key)