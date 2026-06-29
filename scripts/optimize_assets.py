import os
from PIL import Image

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
IMAGE_PATH = os.path.join(ROOT_DIR, "gunndamental-icon.png")

def optimize_logo():
    if not os.path.exists(IMAGE_PATH):
        print(f"Error: Logo file not found at {IMAGE_PATH}")
        return

    original_size = os.path.getsize(IMAGE_PATH) / 1024
    print(f"Original Logo Size: {original_size:.2f} KB")

    # Open image
    img = Image.open(IMAGE_PATH)
    
    # Resize to 132x132 (3x size for 44x44 display)
    resized_img = img.resize((132, 132), Image.Resampling.LANCZOS)
    
    # Save optimized PNG
    resized_img.save(IMAGE_PATH, "PNG", optimize=True)
    
    new_size = os.path.getsize(IMAGE_PATH) / 1024
    print(f"Optimized Logo Size: {new_size:.2f} KB (Reduced by {((original_size - new_size)/original_size)*100:.1f}%)")

if __name__ == "__main__":
    optimize_logo()
