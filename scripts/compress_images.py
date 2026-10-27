"""Compress images_backup into images without changing file names.

Install Pillow: python -m pip install Pillow
Run from the project: python scripts/compress_images.py
"""

from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "images_backup"
DESTINATION = ROOT / "images"
MAX_SIZE = (2048, 2048)
JPEG_QUALITY = 80


def main():
    files = sorted(
        path
        for path in SOURCE.rglob("*")
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png"}
    )
    if not files:
        raise SystemExit(f"No images found in {SOURCE}")

    total_before = 0
    total_after = 0
    for source in files:
        destination = DESTINATION / source.relative_to(SOURCE)
        destination.parent.mkdir(parents=True, exist_ok=True)
        with Image.open(source) as original:
            image = ImageOps.exif_transpose(original)
            image.thumbnail(MAX_SIZE, Image.Resampling.LANCZOS)
            if source.suffix.lower() in {".jpg", ".jpeg"}:
                image.convert("RGB").save(
                    destination,
                    format="JPEG",
                    quality=JPEG_QUALITY,
                    optimize=True,
                    progressive=True,
                    icc_profile=original.info.get("icc_profile"),
                )
            else:
                image.save(destination, format="PNG", optimize=True)

        before = source.stat().st_size
        after = destination.stat().st_size
        total_before += before
        total_after += after
        print(f"{source.name}: {before / 1000:.0f} KB -> {after / 1000:.0f} KB")

    reduction = (1 - total_after / total_before) * 100
    print(
        f"{len(files)} images: {total_before / 1_000_000:.2f} MB -> "
        f"{total_after / 1_000_000:.2f} MB ({reduction:.1f}% smaller)"
    )


if __name__ == "__main__":
    main()
