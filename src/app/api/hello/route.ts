export async function GET() {
    return new Response(JSON.stringify({ message: "Hello from App Router!" }), {
        headers: { "Content-Type": "application/json" },
    });
}