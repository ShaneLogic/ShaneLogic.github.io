---
title: InterfaceML
category: Atomistic interface modeling
order: 2
description: Structure-building and analysis tools for heterojunctions, adsorbates, and first-principles interface calculations.
stack: Python / pymatgen / Flask
repository: https://github.com/ShaneLogic/InterfaceML
documentation: https://github.com/ShaneLogic/InterfaceML#readme
image: /assets/images/interface.webp
image_alt: Representative MAPbI3 and TiO2 interface from the InterfaceML structure collection
image_caption: A visualization of a MAPbI3/TiO2 structure distributed with InterfaceML; this is an atomic model, not a software screenshot.
---
## Building interfaces

InterfaceML provides tools for constructing and preparing heterostructures for electronic-structure calculations. Example systems include perovskite/fullerene and perovskite/oxide interfaces.

## Core capabilities

- Build adsorbate geometries and multilayer structures.
- Match interface supercells and inspect lattice strain.
- Select fixed layers and separate components of a heterostructure.
- Prepare charge-density-difference analysis and VASP/CP2K workflows.

## From structure to calculation

Generated structures are starting models. Their geometry, termination, strain, and calculation settings should be checked before relaxation or property calculations. The public repository contains command-line examples, a web interface, and representative structures.
