"""Build mcq/<track>/Lnn.json from the question sources in mcq/src/*.py.
Each source defines QS = {"sc/L01": [(stem, correct, [wrong, wrong, wrong], explanation), ...], ...}.
Options are shuffled deterministically so the correct answer position varies."""
import glob, json, os, random, runpy
HERE = os.path.dirname(os.path.abspath(__file__))
n = 0
for src in sorted(glob.glob(os.path.join(HERE, "src", "*.py"))):
    for key, qs in runpy.run_path(src)["QS"].items():
        out = []
        for k, (stem, right, wrong, expl) in enumerate(qs):
            assert len(wrong) == 3 and right not in wrong, (key, k, stem)
            opts = [right] + list(wrong)
            random.Random(f"{key}-{k}").shuffle(opts)
            out.append({"q": stem, "o": opts, "a": opts.index(right), "e": expl})
        os.makedirs(os.path.join(HERE, os.path.dirname(key)), exist_ok=True)
        json.dump(out, open(os.path.join(HERE, key + ".json"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)
        n += len(out)
        print(key, len(out))
print("total", n)
