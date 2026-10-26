import os
import glob

files = glob.glob(r"Mathematics for grade 9 2027\**\*.tex", recursive=True)
print(f"Total Grade 9 TeX files: {len(files)}")
for f in files[:20]:
    print(" ", f)
