import http.server
import socketserver
import webbrowser
import os

PORT = 8000
os.chdir(os.path.dirname(os.path.abspath(__file__)))

Handler = http.server.SimpleHTTPRequestHandler

print(f"==================================================")
print(f" KPCambodianmathematics Web Server")
print(f" Running at: http://localhost:{PORT}")
print(f" Opening in browser...")
print(f" Press Ctrl+C to stop the server.")
print(f"==================================================")

webbrowser.open(f"http://localhost:{PORT}/index.html")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
