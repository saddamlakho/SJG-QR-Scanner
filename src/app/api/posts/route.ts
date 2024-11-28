         import { createConnection } from '../../../../lib/db';
         import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    const db = await createConnection();
    const sql = id ? "SELECT * FROM scanner WHERE id = ?" : "SELECT * FROM scanner";
    const [results] = await db.query(sql, id ? [id] : []);
     
    if (!results || results.length === 0) {
      return NextResponse.json({ error: id ? "Record not found" : "No records found" }, { status: 404 });
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error("Error in API:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { ID, SAP_ID, productName, Date, qr_code } = body;

  
    if (!ID || !SAP_ID || !productName || !Date || !qr_code) {
      return NextResponse.json(
        { error: 'All fields are required (ID, SAP_ID, productName, Date, qr_code)' },
        { status: 400 }
      );
    }

    const db = await createConnection();

  
    const sql = `UPDATE scanner SET SAP_ID = ?, productName = ?, Date = ?, qr_code = ? WHERE ID = ?`;
    const [result] = await db.query(sql, [SAP_ID, productName, Date, qr_code, ID]);

  
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Update failed, record not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Record updated successfully' });
  } catch (error: any) {
    console.error('Error updating record:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}












































