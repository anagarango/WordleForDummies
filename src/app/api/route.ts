import { NextRequest, NextResponse } from 'next/server';

type ResponseData = {
  word: string,
  number: number
}

export async function GET(req: NextRequest) {
  try {
    const arr = "About Shelf Urban Wheel Virus";
    const cool = arr.split(" ");
    const random = Math.floor(Math.random() * cool.length);

    const response = NextResponse.json({ word: cool[random], number: random }, { status: 200 });
    response.headers.set('Cache-Control', 'no-store');
    
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.error();
  }
}