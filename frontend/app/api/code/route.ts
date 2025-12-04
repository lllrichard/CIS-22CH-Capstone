import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Go up one level from frontend directory to reach repo root
        const filePath = path.join(process.cwd(), '../app.cpp');

        if (!fs.existsSync(filePath)) {
            return NextResponse.json({ error: 'File not found' }, { status: 404 });
        }

        const content = fs.readFileSync(filePath, 'utf-8');
        return NextResponse.json({ code: content });
    } catch (error) {
        console.error('Error reading app.cpp:', error);
        return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
    }
}
