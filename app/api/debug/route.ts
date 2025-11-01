import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Test 1: Check if Prisma can connect at all
    await prisma.$connect();

    // Test 2: Try a raw query to list tables
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    // Test 3: Try to describe Contact table structure
    const contactColumns = await prisma.$queryRaw`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'Contact'
      ORDER BY ordinal_position;
    `;

    // Test 4: Count records in Contact table
    let contactCount = 0;
    try {
      contactCount = await prisma.contact.count();
    } catch (e) {
      contactCount = -1; // Error counting
    }

    return NextResponse.json({
      success: true,
      database: {
        connected: true,
        url: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
        urlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...'
      },
      tables,
      contactTableColumns: contactColumns,
      prismaContactCount: contactCount
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      database: {
        url: process.env.DATABASE_URL ? 'Set (hidden)' : 'NOT SET',
        urlPrefix: process.env.DATABASE_URL?.substring(0, 30) + '...'
      }
    }, { status: 500 });
  }
}
