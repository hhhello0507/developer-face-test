import {NextRequest, NextResponse} from "next/server";
import {S3} from "aws-sdk";
import {randomUUID} from "node:crypto";
import {Buffer} from "node:buffer";

export async function POST(request: NextRequest) {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const fileType = formData.get('fileType') as string;

    if (!file || !fileType) return NextResponse.json({error: 'No file uploaded'}, {status: 400});

    const buffer = Buffer.from(await file.arrayBuffer());
    
    try {
        const s3 = new S3({
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        });

        const uploadResult = await s3.upload({
            Bucket: 'hhhello-face-dev',
            Key: `uploads/${randomUUID()}.jpg`, // S3 경로와 파일명 설정
            Body: buffer,
            ContentType: fileType,
        }).promise();

        return NextResponse.json({message: 'File uploaded successfully', s3Url: uploadResult.Location});
    } catch (error) {
        console.error(error)
        return NextResponse.json({error: 'File upload failed'}, {status: 500});
    }
}