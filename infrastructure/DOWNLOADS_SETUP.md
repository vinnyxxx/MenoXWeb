# Downloads Bucket Setup Guide

## Overview

The CDK infrastructure creates a dedicated S3 bucket for hosting downloadable app files (.dmg, .zip, etc.). Files uploaded to this bucket are automatically served via CloudFront CDN at `https://menox.us/downloads/`.

## Bucket Details

- **Bucket Name**: `macos-app-downloads-625418298742`
- **CloudFront Path**: `/downloads/*`
- **Public URL**: `https://menox.us/downloads/`
- **Versioning**: Enabled (old versions kept for 90 days)
- **Retention**: RETAIN policy (bucket persists even if CDK stack is deleted)

## How to Upload Files

### Option 1: AWS CLI

```bash
# Upload a single file
aws s3 cp /path/to/your/MenoX.dmg s3://macos-app-downloads-625418298742/MenoX.dmg

# Upload with version number
aws s3 cp /path/to/your/MenoX.dmg s3://macos-app-downloads-625418298742/MenoX-v1.0.0.dmg

# Upload multiple files
aws s3 cp /path/to/downloads/ s3://macos-app-downloads-625418298742/ --recursive
```

### Option 2: AWS Console

1. Go to AWS S3 Console
2. Find bucket: `macos-app-downloads-625418298742`
3. Click "Upload"
4. Drag and drop your .dmg file
5. Click "Upload"

## Download URLs

After uploading, files are accessible at:

```
https://menox.us/downloads/{filename}
```

Examples:
- `https://menox.us/downloads/MenoX.dmg`
- `https://menox.us/downloads/MenoX-v1.0.0.dmg`
- `https://menox.us/downloads/MenoX-latest.dmg`

## Frontend Integration

Update your download button to:

1. Call the download stats API: `POST /api/downloads`
2. Redirect to: `https://menox.us/downloads/MenoX.dmg`

Example JavaScript:

```javascript
async function handleDownload() {
  try {
    // Record download stat
    await fetch('https://your-api-url/api/downloads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      })
    });
    
    // Start download
    window.location.href = 'https://menox.us/downloads/MenoX.dmg';
  } catch (error) {
    console.error('Download failed:', error);
  }
}
```

## CloudFront Cache

- Files are cached by CloudFront for fast global delivery
- Cache duration: Optimized for static content
- To force cache refresh after uploading a new version:

```bash
aws cloudfront create-invalidation \
  --distribution-id {your-distribution-id} \
  --paths "/downloads/*"
```

## File Versioning

The bucket has versioning enabled:
- Uploading a file with the same name creates a new version
- Old versions are automatically deleted after 90 days
- You can restore previous versions from the S3 console

## Best Practices

1. **Use version numbers in filenames**: `MenoX-v1.0.0.dmg` instead of just `MenoX.dmg`
2. **Keep a "latest" symlink**: Upload the same file as `MenoX-latest.dmg` for easy updates
3. **Test downloads**: Always test the download URL after uploading
4. **Monitor storage**: Check S3 storage costs if you have many large files

## Deployment

After modifying the CDK code, deploy with:

```bash
cd infrastructure
npm run build
npm run cdk deploy FrontendStack
```

The outputs will show:
- `DownloadsBucketName`: The S3 bucket name
- `DownloadsBucketArn`: The bucket ARN
- `DownloadsUrl`: The base URL for downloads
