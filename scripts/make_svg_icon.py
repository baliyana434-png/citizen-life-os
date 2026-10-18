import base64

with open(r'c:/Users/abhay/earning website/public/logo-shield-transparent.png', 'rb') as f:
    b64 = base64.b64encode(f.read()).decode('utf-8')

svg_content = f'''<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <image href="data:image/png;base64,{b64}" x="0" y="0" width="128" height="128" preserveAspectRatio="xMidYMid meet" />
</svg>'''

with open(r'c:/Users/abhay/earning website/src/app/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open(r'c:/Users/abhay/earning website/public/icon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

with open(r'c:/Users/abhay/earning website/public/favicon.svg', 'w', encoding='utf-8') as f:
    f.write(svg_content)

print('SVG icons generated successfully!')
