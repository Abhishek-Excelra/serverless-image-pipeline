import boto3
import uuid
from rest_framework.views import APIView
from rest_framework.response import Response

class ImageUploadView(APIView):
    def post(self, request):
        file = request.FILES.get("image")

        if not file:
            return Response({"error": "No file provided"}, status=400)

        s3 = boto3.client('s3')

        bucket_name = "ab-learning-2026"
        file_key = f"uploads/{uuid.uuid4()}_{file.name}"

        try:
            s3.upload_fileobj(
                file,
                bucket_name,
                file_key,
                ExtraArgs={"ContentType": file.content_type}
            )

            file_url = f"https://{bucket_name}.s3.amazonaws.com/{file_key}"

            return Response({
                "message": "Upload successful",
                "url": file_url
            }, status=200)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=500)