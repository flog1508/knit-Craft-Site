import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { filename, data } = body as { filename: string; data: string }

    if (!filename || !data) {
      return NextResponse.json({ success: false, error: 'Missing filename or data' }, { status: 400 })
    }

    // Ensure uploads dir exists
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    // data expected to be like: data:image/png;base64,XXXXX
    const matches = data.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/)
    let buffer: Buffer
    let ext = path.extname(filename) || ''

    if (matches) {
      const base64Data = matches[2]
      const mime = matches[1]
      // get extension from mime if not provided
      if (!ext) {
        ext = '.' + mime.split('/')[1]
      }
      buffer = Buffer.from(base64Data, 'base64')
    } else {
      // If it's raw base64 without prefix
      buffer = Buffer.from(data, 'base64')
    }

    // normalize filename
    let safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '-')
    if (!path.extname(safeName) && ext) safeName = safeName + ext

    const destPath = path.join(uploadsDir, safeName)
    await fs.writeFile(destPath, buffer)

    const publicPath = '/uploads/' + safeName
    return NextResponse.json({ success: true, url: publicPath })
  } catch (error) {
    console.error('[UPLOAD_POST]', error)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
