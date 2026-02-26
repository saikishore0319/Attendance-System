import json
import boto3
from datetime import datetime
from urllib.parse import quote_plus

s3 = boto3.client("s3")
BUCKET_NAME = "attendance-images112"

def lambda_handler(event, context):

    claims = event["requestContext"]["authorizer"]["jwt"]["claims"]
    user_id = claims["sub"]

    timestamp = datetime.utcnow().isoformat()
    key = f"{user_id}/{timestamp}.jpg"

    url = s3.generate_presigned_url(
    "put_object",
    Params={
        "Bucket": BUCKET_NAME,
        "Key": key
    },
    ExpiresIn=300
)

    return {
        "statusCode": 200,
        "body": json.dumps({
            "uploadUrl": url,
            "key": key
        })
    }