import { connectToDatabase } from '@/lib/db';
import Work from '@/models/Work';

import File from "@/models/File";
// GET: Fetch all chat messages for a workId



export async function GET(req, { params }) {
  const { workId } = params;

  try {
    await connectToDatabase();

    const work = await Work.findOne({ workId });
    const file = await File.findOne({ workId });
    console.log(file?.filesData);
    let files = {};
    if (file && file.filesData) {
      try {
        files = JSON.parse(file.filesData);
      } catch (e) {
        console.error("Error parsing files data:", e);
      }
    }

    return new Response(
      JSON.stringify({
        inputs: work?.inputs || [],
        files: files,
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in GET:", err);
    return new Response(JSON.stringify({ message: "Server error" }), {
      status: 500,
    });
  }
}

export async function PATCH(req, { params }) {
  const { workId } = params;
  
  try {
    const body = await req.json();
    await connectToDatabase();

    // 1. Update inputs in Work model
    if (body.input && body.input.message && body.input.role) {
      await Work.findOneAndUpdate(
        { workId },
        {
          $push: {
            inputs: {
              message: body.input.message,
              role: body.input.role,
              createdAt: new Date(),
            },
          },
        },
        { new: true }
      );
    }

    // 2. Handle files in File model
    if (body.files && typeof body.files === "object") {
      console.log("Files object received:", JSON.stringify(body.files, null, 2));
      
      // Simply stringify the entire files object
      const filesString = JSON.stringify(body.files);
      
     const updatedFile= await File.findOneAndUpdate(
        { workId },
        { filesData: filesString },
        { upsert: true, new: true, runValidators: false }
      );

      console.log("Updated document:", updatedFile);

  return Response.json({
    message: "Files data saved successfully.",
    data: updatedFile,
  });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    console.error("Error in PATCH:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
}
export async function POST(req, { params }) {
  const { workId } = params;
  const body = await req.json();
  const { files } = body;
  console.log("Request body:", body);

  try {
    await connectToDatabase();
    const existingWork = await Work.findOne({ workId });
    
 
    if (existingWork) {
      try {
        const plainFiles = { ...files }; // assuming files is already a plain object
existingWork.files = plainFiles;
        
        console.log('existingWork:', existingWork.files);
        const savedDoc = await existingWork.save();
        console.log("Document after save:", JSON.stringify(savedDoc, null, 2));
      
      } catch (e) {
        console.error('Error saving document:', e);
        return new Response(JSON.stringify({ error: "Error saving document" }), { status: 500 });
      }
    } else {
      try {
        const newDoc = await Work.create({ workId, files });
        console.log('Newly created doc:', newDoc);
      } catch (e) {
        console.error('Error creating document:', e);
        return new Response(JSON.stringify({ error: "Error creating document" }), { status: 500 });
      }
    }
    
    // Return a successful response at the end
    return new Response(JSON.stringify({ success: true }), { status: 200 });
    
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
