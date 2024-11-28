import { createConnection } from '../../../../lib/db';
import { NextResponse } from 'next/server';

async function addItemToDB(item: { SAP_ID: string; productName: string; Date: string; qr_code: string }) {
  try {
    const db = await createConnection();
    const sql = 'INSERT INTO scanner (SAP_ID, productName, Date, qr_code) VALUES (?, ?, ?, ?)';
    const result = await db.query(sql, [item.SAP_ID, item.productName, item.Date, item.qr_code]);
    return result;
  } catch (error) {
    console.error('Error adding item to DB:', error);
    throw new Error('Database error');
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { SAP_ID, productName, Date, qr_code } = body;

   
    if (!SAP_ID || !productName || !Date || !qr_code) {
      return NextResponse.json(
        { error: 'All fields (SAP_ID, productName, Date, qr_code) are required.' },
        { status: 400 }
      );
    }

    const result = await addItemToDB({ SAP_ID, productName, Date, qr_code });

    return NextResponse.json({ message: 'Item added successfully', result });
  } catch (error: any) {
    console.error('Error in POST handler:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
