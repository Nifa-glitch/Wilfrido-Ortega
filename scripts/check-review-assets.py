#!/usr/bin/env python3
"""Check local image and asset filenames used in the six HTML pages."""
from pathlib import Path
import re
import sys
ROOT=Path(__file__).resolve().parents[1]
pages=['index.html','su-bida.html','su-obra.html','investigashon.html','tokante.html','catalogus.html']
missing=[]
for page in pages:
    body=(ROOT/page).read_text(encoding='utf-8')
    urls=re.findall(r"""(?:src|href)=["']([^"']+)["']""",body)
    for url in urls:
        if url.startswith(('http:','https:','#','mailto:','tel:','data:','javascript:','/')):continue
        file=url.split('?',1)[0].split('#',1)[0]
        if not file or '${' in file:continue
        if not (ROOT/file).exists():missing.append((page,file))
if missing:
    print('BROKEN LOCAL REFERENCES:',*missing,sep='\n')
    sys.exit(1)
print('PASS: All literal local HTML src/href paths resolve across six pages.')
