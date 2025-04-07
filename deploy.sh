#!/bin/bash
set -e

# Configuration
STACK_NAME="news-linker"
REGION="ca-central-1"  # Change to your preferred region
BUCKET_NAME=${1:-"news-linker"}  # Use first argument as bucket name or default to "news-linker"

# Build the application
echo "Building the application..."
npm run build

# Check if the CloudFormation stack exists
if aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION &>/dev/null; then
  # Update existing stack
  echo "Updating CloudFormation stack..."
  # Temporarily disable exit on error
  set +e
  update_output=$(aws cloudformation update-stack \
    --stack-name $STACK_NAME \
    --template-body file://cloudformation.yaml \
    --parameters ParameterKey=DomainName,ParameterValue=$BUCKET_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION 2>&1)
  update_status=$?
  # Re-enable exit on error
  set -e

  if [ $update_status -ne 0 ]; then
    # Check if the error is "No updates are to be performed"
    if echo "$update_output" | grep -q "No updates are to be performed"; then
      echo "No updates are to be performed. Continuing..."
    else
      # If it's a different error, exit with the error message
      echo "Error updating stack: $update_output"
      exit $update_status
    fi
  else
    # If the update was successful, wait for it to complete
    echo "Waiting for update stack operation to complete..."
    aws cloudformation wait stack-update-complete --stack-name $STACK_NAME --region $REGION
  fi
else
  # Create new stack
  echo "Creating CloudFormation stack..."
  aws cloudformation create-stack \
    --stack-name $STACK_NAME \
    --template-body file://cloudformation.yaml \
    --parameters ParameterKey=DomainName,ParameterValue=$BUCKET_NAME \
    --capabilities CAPABILITY_IAM \
    --region $REGION
  echo "Waiting for create stack operation to complete..."
  aws cloudformation wait stack-create-complete --stack-name $STACK_NAME --region $REGION
fi

# Get the S3 bucket name, CloudFront distribution ID, and website URL from the stack outputs
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='WebsiteBucketName'].OutputValue" --output text)
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" --output text)
WEBSITE_URL=$(aws cloudformation describe-stacks --stack-name $STACK_NAME --region $REGION --query "Stacks[0].Outputs[?OutputKey=='WebsiteURL'].OutputValue" --output text)

# Upload the built files to S3
echo "Uploading files to S3 bucket: $BUCKET_NAME..."
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete --region $REGION

# Invalidate CloudFront cache
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*" --region $REGION

echo "Deployment completed successfully!"
echo "Website URL: $WEBSITE_URL"
echo ""
echo "Note: Your website is now accessible via HTTPS through CloudFront."
