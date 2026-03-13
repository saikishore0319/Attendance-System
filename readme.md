# Serverless Face Recognition Attendance System

A cloud-native attendance system that captures employee images, verifies identity using AWS Rekognition, and automatically records attendance using a fully serverless architecture on AWS.

The system uses event-driven processing, where images uploaded from the frontend are stored in Amazon S3, which triggers AWS Lambda functions to perform facial recognition and update attendance records in DynamoDB.

## Architecture

![alt](https://private-user-images.githubusercontent.com/141355805/563011280-9d76ebc7-d6d5-4e27-8545-c4363a5cdf58.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM0MDY2NTQsIm5iZiI6MTc3MzQwNjM1NCwicGF0aCI6Ii8xNDEzNTU4MDUvNTYzMDExMjgwLTlkNzZlYmM3LWQ2ZDUtNGUyNy04NTQ1LWM0MzYzYTVjZGY1OC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMjUyMzRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lMTBlNzkwYzM0NTY1Y2EzOTQ0ZmFjN2JhNjZhMzZlYmNiMjE2NGU5NzJlYWI2MGMxYzVkZTFmYjg5ZjJkMjFkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.wxJen-mvwdy_ukK6Qm6VPvogLUuwrUD8Ns8xSPIlqiI)

## Features
#### Secure Authentication

Users authenticate using Amazon Cognito with OAuth2 / OpenID Connect.

#### Face Enrollment

Users capture their face once, which is indexed into an AWS Rekognition collection.

#### Automated Attendance

When a user uploads an image:

* Rekognition verifies the face

* Attendance is recorded automatically

#### Daily Attendance Control

The system ensures:

* Attendance can only be recorded once per day

* Attendance allowed only after 8 AM

#### Event-Driven Processing

Images uploaded to S3 automatically trigger Lambda functions.

#### Attendance Analytics

Dashboard displays:

* Today’s attendance status

* Weekly attendance summary

* Attendance percentage

#### Automatic Image Cleanup

Uploaded images are removed from S3 after processing to maintain storage hygiene.

## DynamoDB Tables
#### Users Table

Stores registered users and enrolled faces.
| Attribute | Description          |
| --------- | -------------------- |
| user_id   | Partition key        |
| timestamp | Attendance timestamp |
| status    | PRESENT / ABSENT     |


#### Attendance Table

Stores attendance records.

|Attribute|	Description|
| ------ | ---------- |
|user_id|	Partition key|
|timestamp|	Attendance timestamp|
|status|	PRESENT / ABSENT|

## Rekognition Collection

A Rekognition collection stores indexed faces.
```bash
attendance-collection
```
Each face is indexed with:
```bash
ExternalImageId = Cognito User Sub
```
## API Endpoints
| Endpoint            | Method | Description                      |
| ------------------- | ------ | -------------------------------- |
| /upload-url         | GET    | Generate presigned S3 upload URL |
| /profile            | GET    | Fetch user profile               |
| /attendance/summary | GET    | Fetch attendance analytics       |

## Lambda Functions
#### 1. Face Enrollment

Indexes user face into Rekognition and stores metadata in DynamoDB.

#### 2. Attendance Processor

Triggered by S3 upload events.

Responsibilities:

* Fetch image from S3
* Verify face using Rekognition

* Check duplicate attendance

* Store attendance record

* Delete processed image

#### 3. Attendance Summary

Calculates dashboard statistics.

Returns:

* Today's attendance

* Weekly attendance

* Percentage

#### 4. Upload URL Generator

Generates a presigned S3 URL for secure image uploads.

## Frontend Pages
##### Login

Authenticates users using Cognito hosted UI.
![alt](https://private-user-images.githubusercontent.com/141355805/563023379-b6039129-30c4-4b42-bc83-a42d8bcdf382.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM0MDgyOTUsIm5iZiI6MTc3MzQwNzk5NSwicGF0aCI6Ii8xNDEzNTU4MDUvNTYzMDIzMzc5LWI2MDM5MTI5LTMwYzQtNGI0Mi1iYzgzLWE0MmQ4YmNkZjM4Mi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMzE5NTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT01MmQ3ZDFkZTE5Y2M0MTJiZDNlOWYzNGI1Zjc1NDJmNmU5Y2I2YTM0MGFkZDRlZDE0ODQwZTQ3MmJmMjMyMTczJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Ti5UnJP9uF9CYkQdh4WcvYCCyQrCtG18oyB-peDAIrc)
##### Face Enrollment

Users capture their face for registration.
![alt](https://private-user-images.githubusercontent.com/141355805/563023444-7946308d-7c73-4ace-b0a0-faa3a777f189.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM0MDgyOTUsIm5iZiI6MTc3MzQwNzk5NSwicGF0aCI6Ii8xNDEzNTU4MDUvNTYzMDIzNDQ0LTc5NDYzMDhkLTdjNzMtNGFjZS1iMGEwLWZhYTNhNzc3ZjE4OS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMzE5NTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT0xNDE5OGE4ZDE2MDYwNjJiMWI3NTJhOWNmZWY2Njk3M2VlMzdmZDAwMGJkYmVlMzcwZTYxMTA0ZDc2MzVlZmUzJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.Tp_btCkRSP_W98mctBY8S0DyuNSFH_nW2a5t5MtMAYw)
##### Dashboard

Displays attendance statistics.
![alt](https://private-user-images.githubusercontent.com/141355805/563023479-d7a2c350-5c84-42c8-afcc-d29f6b58afaf.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM0MDgyOTUsIm5iZiI6MTc3MzQwNzk5NSwicGF0aCI6Ii8xNDEzNTU4MDUvNTYzMDIzNDc5LWQ3YTJjMzUwLTVjODQtNDJjOC1hZmNjLWQyOWY2YjU4YWZhZi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMzE5NTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iNjNkMTIyNWIxNzIwMzJjMjQyZmVjZmI4MmFhZjFjNDFlMTk4YjhiNjYwYjM4M2Y1ZmZkMDI4ZDVlZTE5ODQxJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.d0BbQWbAR8Dmfm4kUaMf_UsFFsSme8RT0AXvlRHzQto)
##### Attendance

Captures image and uploads to S3.
![alt](https://private-user-images.githubusercontent.com/141355805/563023519-49dcffe4-90b5-4415-b9db-b72c6860e3be.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzM0MDgyOTUsIm5iZiI6MTc3MzQwNzk5NSwicGF0aCI6Ii8xNDEzNTU4MDUvNTYzMDIzNTE5LTQ5ZGNmZmU0LTkwYjUtNDQxNS1iOWRiLWI3MmM2ODYwZTNiZS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMzE5NTVaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1lNmNiMmM5NWZmN2Q3NmU1YjQ4NzExMjRiOGE5MWJmN2VhNjZhNDQwOTgwZGU4YTMxMmI2ZDFkZTc0YmEwMmExJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.V8VgAZA0DT0TbQ94U7-7rHdgwa8SOVF6FjtDzTOYGKc)

## Deployment
#### 1. Deploy Backend

Create AWS resources:

* S3 bucket

* DynamoDB tables

* Rekognition collection

* Lambda functions

* API Gateway

* Cognito User Pool

#### 2. Deploy Frontend

Build the frontend:
```bash
npm run build
```
Upload build files to S3 static website bucket.

### Environment Configuration

Frontend configuration file:
```bash
src/services/cognitoConfig.js
```
Example:
```json
export const cognitoConfig = {
  domain: "...",
  clientId: "...",
  redirectUri: "...",
};
```
