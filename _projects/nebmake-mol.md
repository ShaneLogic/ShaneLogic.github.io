---
title: nebmake-mol
category: Molecular reorientation
order: 3
description: Initial VASP NEB paths that separate molecular translation and rotation from inorganic-framework motion.
stack: Python / pymatgen / VASP structures
repository: https://github.com/ShaneLogic/nebmake-mol
documentation: https://github.com/ShaneLogic/nebmake-mol#method
image: /assets/images/mapbi3.webp
image_alt: A representative MAPbI3 crystal containing organic molecular cations
image_caption: A representative MAPbI3 structure illustrates the molecular-inorganic system. This image is not a computed NEB trajectory.
---
## Molecular motion in hybrid perovskites

Independent linear interpolation of atomic positions can distort an intact rotating molecule. `nebmake-mol` separates molecular translation, orientation, and internal coordinates when constructing intermediate structures.

## Method

The tool identifies molecular groups across periodic boundaries and describes their geometry in a molecule-attached frame. Molecular centers and orientations are interpolated, while framework atoms and the lattice are handled separately. For a fixed cell, reconstruction retains the initial molecular geometry up to numerical precision.

## Current scope

The current implementation is configured for MAPbI3 and expects consistent atom ordering and correspondence between the endpoint structures. It generates an initial path; it does not run DFT, optimize an NEB, or calculate an activation barrier. Large rotations and variable-cell paths require particular care, as detailed in the repository.
