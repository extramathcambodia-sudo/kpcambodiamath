import http.server
import socketserver
import webbrowser
import os

PORT = 8080
DIST_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")

if not os.path.exists(DIST_DIR):
    print("Error: 'dist' folder not found! Please run 'python build_dist.py' first.")
    input("Press Enter to exit...")
    exit(1)

os.chdir(DIST_DIR)
Handler = http.server.SimpleHTTPRequestHandler

print("=" * 60)
print(" KPCambodianmathematics - Testing Production Dist Server")
print(f" Serving folder: {DIST_DIR}")
print(f" Running at:     http://localhost:{PORT}")
print(" Press Ctrl+C to stop the server.")
print("=" * 60)

webbrowser.open(f"http://localhost:{PORT}/index.html")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
