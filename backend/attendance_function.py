import json
import boto3
from decimal import Decimal
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj)
        return super(DecimalEncoder, self).default(obj)
dynamo = boto3.resource('dynamodb')
table = dynamo.Table('AttendanceLogs')
def lambda_handler(event, context):
    print("Fetching attendance logs...")
    try:
        result = table.scan()
        items = result.get('Items', [])
        return {
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({'logs': items}, cls=DecimalEncoder)
        }
    except Exception as err:
        print(f"Error: {str(err)}")
        return {
            'body': json.dumps({'message': 'Failed to fetch logs', 'error': str(err)})
        }