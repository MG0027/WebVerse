import { connectToDatabase } from '@/lib/db';
import Work from '@/models/Work';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  const body = await req.json();
  const { userId, firstInput } = body;

  await connectToDatabase();

  const newWork = await Work.create({
    workId: uuidv4(),
    userId,
    inputs: [
      {
        message: firstInput,
      },
    ],
    
  });

  return new Response(JSON.stringify(newWork), { status: 201 });
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  await connectToDatabase();

  try {
    const works = await Work.find(
      { userId },
      { workId: 1, inputs: { $slice: 1 }}
    ).sort({ createdAt: -1 }); // optional: sort by newest first

    return NextResponse.json({ success: true, data: works });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
 
}
