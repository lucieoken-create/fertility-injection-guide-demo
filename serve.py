"""Loopback-only preview; source files and repository metadata are not served."""
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import argparse
ROOT=Path(__file__).resolve().parent
class Preview(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ('/','/index.html'):
            self.send_error(404);return
        content=(ROOT/'index.html').read_bytes()
        self.send_response(200)
        self.send_header('Content-Type','text/html; charset=utf-8')
        self.send_header('Content-Length',str(len(content)))
        self.send_header('Cache-Control','no-store')
        self.send_header('Referrer-Policy','no-referrer')
        self.send_header('X-Content-Type-Options','nosniff')
        self.end_headers();self.wfile.write(content)
    def log_message(self,*args):pass
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8766);a=p.parse_args()
    print('Portfolio demo: http://127.0.0.1:'+str(a.port)+'/',flush=True)
    ThreadingHTTPServer(('127.0.0.1',a.port),Preview).serve_forever()
