


import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { createConnection } from "../../../../../lib/db";

export async function POST(request: Request) {
  try {
    const { name, email, password, isAdmin } = await request.json();
    const db = await createConnection();

    // Check if email is already registered
    const [existingUser] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email is already registered." },
        { status: 400 }
      );
    }

  
    const hashedPassword = await hash(password, 10);

    
    const role = isAdmin ? 'admin' : 'user';

   
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const values = [name, email, hashedPassword, role];
    await db.execute(sql, values);

    const token = jwt.sign(
      { email, role },
      process.env.JWT_SECRET_KEY!,
      { expiresIn: '1h' } 
    );

    return NextResponse.json({
      message: "User created successfully",
      token, 
      user: {
        name,
        email,
        role
      }
    });
  } catch (e) {
    console.error("Error during registration:", e);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
