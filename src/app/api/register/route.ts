import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const apiUrl = process.env.SERVER_URL || 'https://api.skilldeck.net';
    if (!apiUrl) {
        console.error('[API/Register] SERVER_URL is not defined');
        return NextResponse.json({ message: 'Server configuration error' }, { status: 500 });
    }

    const endpoint = `${apiUrl}/api/v1/admin/register/tenant`;

    try {
        const body = await req.json();

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        let data: any;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            data = { message: text || `Backend responded with status ${response.status}` };
        }

        if (!response.ok) {
            console.error('Registration Error:', data);
            return NextResponse.json({
                message: data.message || (data.error ? data.error : 'Failed to register'),
                error: data.error,
                errors: data.errors || undefined
            }, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Proxy Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', detail: String(error) }, { status: 500 });
    }
}
