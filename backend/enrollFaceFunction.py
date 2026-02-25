import json
import base64
import boto3

rekognition = boto3.client("rekognition")
dynamodb = boto3.resource("dynamodb")

COLLECTION_ID = "attendance-collection"
TABLE_NAME = "Users"

def lambda_handler(event, context):

    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_sub = claims["sub"]
    email = claims["email"]

    body = json.loads(event["body"])
    image_base64 = body["image"]

    image_bytes = base64.b64decode(image_base64.split(",")[1])

    response = rekognition.index_faces(
        CollectionId=COLLECTION_ID,
        Image={"Bytes": image_bytes},
        ExternalImageId=user_sub
    )

    if not response["FaceRecords"]:
        return {
            "statusCode": 400,
            "body": json.dumps({"error": "No face detected"})
        }

    face_id = response["FaceRecords"][0]["Face"]["FaceId"]

    table = dynamodb.Table(TABLE_NAME)
    table.put_item(
        Item={
            "user_id": user_sub,
            "email": email,
            "face_id": face_id
        }
    )

    return {
        "statusCode": 200,
        "body": json.dumps({"message": "Enrollment successful"})
    }