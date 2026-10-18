import os
from PIL import Image

src_path = r'C:/Users/abhay/.gemini/antigravity/brain/dccb2c08-efba-4006-938d-dc6cb5a97adf/.user_uploaded/media_1792310889757_6554e421.jpg'
output_dir = r'c:/Users/abhay/earning website/public'
app_dir = r'c:/Users/abhay/earning website/src/app'

os.makedirs(output_dir, exist_ok=True)

# 1. Load original 1024x1024 image
print('Loading original image...')
img = Image.open(src_path).convert('RGB')
w, h = img.size
pixels = img.load()

# 2. Erase the dot after 'OS.'
# The dot was measured at x: 549..559, y: 808..818
for y in range(790, 830):
    for x in range(544, 580):
        pixels[x, y] = (255, 255, 255)

# 3. Center the 'OS' text now that the dot is removed
# Original OS was at x: 462..542. Shifting by +10px centers it at x=511.5, matching CITIZEN LIFE (x=512.5) and Shield (x=511.5)
os_crop = img.crop((462, 775, 542, 822))
for y in range(775, 822):
    for x in range(460, 560):
        pixels[x, y] = (255, 255, 255)
img.paste(os_crop, (472, 775))

print('Dot removed and OS text centered!')

# 4. Save 1024x1024 web master
logo_1k_path = os.path.join(output_dir, 'logo.png')
img.save(logo_1k_path, 'PNG', optimize=True)
print(f'Saved: {logo_1k_path}')

# 5. Create 8K Master (8192 x 8192 px, 67 Megapixels, ultra pristine)
print('Generating 8K Ultra-HD Master (8192 x 8192 px)...')
img_8k = img.resize((8192, 8192), Image.Resampling.LANCZOS)
logo_8k_path = os.path.join(output_dir, 'logo-8k.png')
img_8k.save(logo_8k_path, 'PNG', optimize=True)
print(f'Saved 8K: {logo_8k_path} ({os.path.getsize(logo_8k_path) / (1024*1024):.2f} MB)')

# 6. Create Transparent Alpha-Matted versions
def create_transparent(source_img):
    img_rgba = source_img.convert('RGBA')
    width, height = img_rgba.size
    px = img_rgba.load()
    for y in range(height):
        for x in range(width):
            r, g, b, a = px[x, y]
            # Near white background detection
            if r > 250 and g > 250 and b > 250:
                px[x, y] = (255, 255, 255, 0)
            elif r > 230 and g > 230 and b > 230:
                whiteness = (r + g + b) / (3.0 * 255.0)
                alpha = int((1.0 - (whiteness - 0.90) / 0.10) * 255)
                alpha = max(0, min(255, alpha))
                px[x, y] = (r, g, b, alpha)
    return img_rgba

print('Generating 1K Transparent Logo...')
img_transparent = create_transparent(img)
logo_trans_path = os.path.join(output_dir, 'logo-transparent.png')
img_transparent.save(logo_trans_path, 'PNG', optimize=True)
print(f'Saved: {logo_trans_path}')

# 7. Create Shield-Only cropped version (for compact icons & headers)
# Shield bounds: x: [315, 708], y: [207, 686]
# Crop with balanced padding
shield_crop = img_transparent.crop((305, 195, 718, 695))
# Make it a square image centered
s_w, s_h = shield_crop.size
max_side = max(s_w, s_h) + 20
square_shield = Image.new('RGBA', (max_side, max_side), (255, 255, 255, 0))
offset_x = (max_side - s_w) // 2
offset_y = (max_side - s_h) // 2
square_shield.paste(shield_crop, (offset_x, offset_y))

shield_icon_path = os.path.join(output_dir, 'logo-shield-transparent.png')
square_shield.save(shield_icon_path, 'PNG', optimize=True)
print(f'Saved: {shield_icon_path}')

# 8. Web App Icon 512x512
icon_512 = square_shield.resize((512, 512), Image.Resampling.LANCZOS)
icon_512_path = os.path.join(output_dir, 'icon.png')
icon_512.save(icon_512_path, 'PNG', optimize=True)
# Also save into src/app/icon.png
app_icon_path = os.path.join(app_dir, 'icon.png')
icon_512.save(app_icon_path, 'PNG', optimize=True)
print(f'Saved: {icon_512_path} and {app_icon_path}')

# 9. Apple Touch Icon 180x180
apple_icon = square_shield.resize((180, 180), Image.Resampling.LANCZOS)
apple_icon_path = os.path.join(output_dir, 'apple-icon.png')
apple_icon.save(apple_icon_path, 'PNG', optimize=True)
print(f'Saved: {apple_icon_path}')

# 10. Multi-resolution Favicon.ico (16, 32, 48, 64)
fav_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
fav_icons = [square_shield.resize(s, Image.Resampling.LANCZOS) for s in fav_sizes]
favicon_path = os.path.join(output_dir, 'favicon.ico')
fav_icons[0].save(favicon_path, format='ICO', sizes=fav_sizes, append_images=fav_icons[1:])
print(f'Saved: {favicon_path}')

print('All 8K and web brand assets generated with 100% precision!')
