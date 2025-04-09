
import { connectToDatabase } from '@/lib/db';

import User from '@/models/user';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name, picture } = body;

    await connectToDatabase();

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        uuid: uuidv4(),
        email,
        name,
        picture,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Something went wrong' }), {
      status: 500,
    });
  }
}
