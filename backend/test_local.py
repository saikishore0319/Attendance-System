from lambdafunction import lambda_handler

dummy_event = {
    "Records": [
        {
            "s3": {
                "bucket": {"name": "fake-attendance-bucket"},
                "object": {"key": "test-webcam-photo.jpg"}
            }
        }
    ]
}
print("gggggggggggggg")
response = lambda_handler(dummy_event, None)
print("ffffffffffffffffffff")
print("Lambda Response:", response)