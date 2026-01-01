
export default function PingPage() {
    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold text-green-600">PONG</h1>
            <p>The application is serving routes correctly.</p>
            <p>Time: {new Date().toISOString()}</p>
        </div>
    );
}
