---
title: SolarLab
category: Photovoltaic device physics
order: 1
description: A research platform for thin-film solar-cell simulation, from optical generation to charge and ion transport.
stack: Python / FastAPI / TypeScript
repository: https://github.com/ShaneLogic/SolarLab
documentation: https://github.com/ShaneLogic/SolarLab#readme
image: /assets/images/solarlab.webp
image_alt: SolarLab current-voltage benchmark and comparison with a published reference
image_caption: A SolarLab benchmark figure from the public repository. The comparison includes both agreement and remaining discrepancies.
---
## Device-scale modeling

SolarLab connects a Python physics core with an interactive web interface for thin-film solar-cell simulation. The main model combines drift-diffusion and Poisson equations with mobile-ion dynamics and transfer-matrix optics.

## Research workflows

- Define multilayer devices and material parameters.
- Simulate current-voltage response, spectral response, and supported transient experiments.
- Inspect charge transport, spatial profiles, and optical generation.
- Run parameter studies and compare results with documented benchmarks.

## Scope and reproducibility

Different experiment drivers support different combinations of physics. The repository describes validation cases, experimental extensions, and current limitations. A feature being implemented does not by itself establish numerical convergence or experimental validation for every configuration.
