# Asset Provenance

Prepared on 2026-10-01. The website code license does not grant a separate license to personal photographs or third-party research assets.

| Asset | Source | Processing and meaning |
| --- | --- | --- |
| `portrait.jpg` | Portrait embedded in the CV supplied by Xuan-Yan Chen | Extracted and compressed for the owner's academic website. No contact details or other PDF content are embedded. |
| `solarlab.webp` | [SolarLab Calado benchmark figure](https://github.com/ShaneLogic/SolarLab/blob/68bcdbc9d2f4d9dfbeeb5779b3aff9a518d6a327/docs/figures/Calado16Fig1fJVV1.png) | Resized and converted to WebP. Both the plot and comparison table are retained. The caption points to the documented benchmark scope. |
| `interface.webp` | [InterfaceML MAPbI3/TiO2 structure](https://github.com/ShaneLogic/InterfaceML/blob/64dd7ab19d8e729e70b5a63583d6b2cb7717a66d/structures/heterojunctions/H6PbCI3N%40TiO2.vasp) | A static atomistic rendering with ASE and Matplotlib. It is not an application screenshot or a new calculation. |
| `mapbi3.webp` | [InterfaceML MAPbI3 structure](https://github.com/ShaneLogic/InterfaceML/blob/64dd7ab19d8e729e70b5a63583d6b2cb7717a66d/structures/perovskites/H6PbCI3N.cif) | A 2 x 2 x 1 structural repeat rendered with ASE and Matplotlib. Used as a representative system, not as an NEB trajectory. |
| `favicon.png` | Site initials, XC | Locally rendered PNG. |

`scripts/render_assets.py` records the image processing. It accepts the approved portrait and public structure/figure paths as inputs. It does not depend on or distribute the original private CV.

The actual public project capabilities should be checked in their repositories. Displaying a figure here does not broaden a simulation's validation claims.
