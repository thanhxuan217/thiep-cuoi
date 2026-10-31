"""Cut audio/audio.mp3 from 00:32 to 01:09.

Install: python -m pip install imageio-ffmpeg
Run: python scripts/trim_audio.py
"""

from pathlib import Path
import subprocess

from imageio_ffmpeg import get_ffmpeg_exe


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "audio" / "audio.mp3"
DESTINATION = ROOT / "audio" / "audio-32-69.mp3"


def main():
    subprocess.run(
        [
            get_ffmpeg_exe(),
            "-hide_banner", "-loglevel", "error", "-nostdin", "-y",
            "-ss", "32",
            "-i", str(SOURCE),
            "-t", "37",
            "-map", "0:a:0",
            "-map_metadata", "-1",
            "-c:a", "libmp3lame",
            "-q:a", "2",
            str(DESTINATION),
        ],
        check=True,
    )
    print(f"Saved 00:32-01:09 (37 seconds) to {DESTINATION}")


if __name__ == "__main__":
    main()
