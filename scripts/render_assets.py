"""Render public atomistic structures and optimize approved website images."""

import argparse
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from ase.io import read
from ase.visualize.plot import plot_atoms
from PIL import Image, ImageDraw, ImageFont
from matplotlib.font_manager import findfont


def structure_image(source, destination, rotation, repeat=None):
    atoms = read(source)
    if repeat:
        atoms = atoms.repeat(repeat)
    atoms.wrap()
    palette = {"Pb": "#768ca6", "I": "#786185", "C": "#40474b", "N": "#47799d",
               "H": "#e8e5df", "Ti": "#658e88", "O": "#c7786e"}
    colors = [palette.get(symbol, "#82958a") for symbol in atoms.get_chemical_symbols()]
    fig, ax = plt.subplots(figsize=(8, 6), dpi=160)
    fig.patch.set_facecolor("#f5f7f6")
    ax.set_facecolor("#f5f7f6")
    plot_atoms(atoms, ax, rotation=rotation, radii=0.72, colors=colors, show_unit_cell=0)
    ax.set_axis_off()
    ax.set_aspect("equal")
    ax.margins(0.08)
    fig.tight_layout(pad=0.4)
    temporary = destination.with_suffix(".png")
    fig.savefig(temporary, facecolor=fig.get_facecolor(), dpi=160)
    plt.close(fig)
    with Image.open(temporary) as image:
        image.convert("RGB").save(destination, quality=88)
    temporary.unlink()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--portrait", required=True, type=Path)
    parser.add_argument("--interface", required=True, type=Path)
    parser.add_argument("--crystal", required=True, type=Path)
    parser.add_argument("--solarlab", required=True, type=Path)
    args = parser.parse_args()
    target = Path(__file__).resolve().parents[1] / "assets" / "images"
    target.mkdir(parents=True, exist_ok=True)
    with Image.open(args.portrait) as image:
        image.convert("RGB").save(target / "portrait.jpg", quality=92, optimize=True)
    with Image.open(args.solarlab) as image:
        image.thumbnail((1800, 1200))
        image.convert("RGB").save(target / "solarlab.webp", quality=90)
    structure_image(args.interface, target / "interface.webp", "90x,8y,0z")
    structure_image(args.crystal, target / "mapbi3.webp", "12x,22y,5z", (2, 2, 1))
    favicon = Image.new("RGB", (64, 64), "#edf4f0")
    draw = ImageDraw.Draw(favicon)
    font = ImageFont.truetype(findfont("DejaVu Sans"), 30)
    draw.text((32, 32), "XC", fill="#176e63", font=font, anchor="mm")
    favicon.save(target / "favicon.png")
    print("Prepared portrait and three research images.")


if __name__ == "__main__":
    main()
