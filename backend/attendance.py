import json
import base64
import boto3
from datetime import datetime

rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")

attendance_table = dynamodb.Table("Attendance")
COLLECTION_ID = "attendance-collection"

def lambda_handler(event, context):

    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    body = json.loads(event["body"])
    image_base64 = body["image"]

    # Remove header if present
    if image_base64.startswith("data:image"):
        image_base64 = image_base64.split(",")[1]

    image_bytes = base64.b64decode(image_base64)

    # Search face
    search = rekognition.search_faces_by_image(
        CollectionId=COLLECTION_ID,
        Image={"Bytes": image_bytes},
        MaxFaces=1,
        FaceMatchThreshold=90
    )

    if not search["FaceMatches"]:
        return {
            "statusCode": 401,
            "body": json.dumps({"error": "Face not recognized"})
        }

    matched_id = search["FaceMatches"][0]["Face"]["ExternalImageId"]

    if matched_id != user_id:
        return {
            "statusCode": 401,
            "body": json.dumps({"error": "Face does not match logged in user"})
        }

    # Optional: prevent multiple attendance same day
    today = datetime.utcnow().date()
    timestamp = datetime.utcnow().isoformat()

    attendance_table.put_item(
        Item={
            "user_id": user_id,
            "timestamp": timestamp,
            "status": "PRESENT"
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Attendance recorded"})
    }