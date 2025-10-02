import { NextRequest } from "next/server";
import ImageKit from "imagekit";


var ImageKit = new ImageKit({
    urlEndpoint: "https://ik.imagekit.io/your_imagekit_id", // Required
    transformationPosition: "query", // Optional, defaults to "query"
    publicKey: "your_public_api_key", // Required
    privateKey: "your_private_api_key", // Required
});

export async function POST(req: NextRequest) {
    const formData= await req.formData();
    const file = formData.get("file") as File;

    const bytes= await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    try {
        const uploadResponse=await ImageKit.upload({
            file: buffer, //required
            fileName: Date.now().toString()+".pdf", //required 
            isPublished: true,
        });

        // Call n8n Webhook to process the PDF and generate questions

        const result = await fetch('http://localhost:5678/webhook/generate-interview-question', {
            resumeUrl: uploadResponse?.url
        }
        console.log("Result", resourceLimits.data);

        return new Response(JSON.stringify({url: uploadPdf.url}), {status: 200});
        
    } catch (error) {
        
    }

}