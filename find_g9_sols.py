import glob

files = glob.glob(r"Mathematics for grade 9 2027\**\*sol*.tex", recursive=True)
for f in files:
    print(f)
