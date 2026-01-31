---
layout: page.njk
title: Applications
---

# Applications & Software

I develop open-source tools for remote sensing, spatial analysis, and environmental monitoring. These tools are designed to make complex analyses accessible to researchers and practitioners working on conservation and sustainability challenges.

## Featured Projects

### Trends.Earth

**Primary Developer** | [GitHub](https://github.com/ConservationInternational/trends.earth)

An open-source tool for calculating indicators of land degradation using satellite imagery and cloud computing. Available as a QGIS plugin with over 10,000 registered users.

- Calculates land degradation indicators aligned with SDG 15.3.1
- Integrates with Google Earth Engine for cloud-based processing
- Referenced in multiple decisions by the Conference of Parties to the United Nations Convention to Combat Desertification
- Supports land degradation neutrality (LDN) reporting and target setting

### glcm

**Primary Developer** | [CRAN](https://cran.r-project.org/package=glcm) | [GitHub](https://github.com/azvoleff/glcm)

R package for calculating image textures based on the Gray-Level Co-Occurrence Matrix (GLCM). Useful for extracting texture features from remote sensing imagery for classification and analysis.

**Key Features:**
- Calculates multiple texture statistics (contrast, homogeneity, entropy, etc.)
- Supports rotation-invariant texture calculation
- Optimized for processing large raster datasets

### gfcanalysis

**Original Author** | [CRAN](https://cran.r-project.org/package=gfcanalysis) | [GitHub](https://github.com/azvoleff/gfcanalysis)

R package for analyzing Global Forest Change data from Hansen et al. Facilitates downloading, processing, and analyzing annual forest change data at local to regional scales.

**Capabilities:**
- Download and mosaic Hansen forest change tiles
- Calculate forest loss and gain statistics
- Generate annual forest cover maps

### teamlucc (no longer maintained)

**Primary Developer** | [GitHub](https://github.com/azvoleff/teamlucc)

Collection of R tools for analyzing satellite imagery and performing automated image classifications. Developed to support the Tropical Ecology Assessment and Monitoring (TEAM) Network.

**Features:**
- Landsat surface reflectance preprocessing
- Cloud removal and gap filling
- Automated image classification workflows
- Time series analysis

### PyABM (no longer maintained)

**Primary Developer** | [GitHub](https://github.com/azvoleff/pyabm)

Python framework for agent-based modeling. Provides a foundation for building agent-based models with spatial components.

### ChitwanABM (no longer maintained)

**Primary Developer** | [GitHub](https://github.com/azvoleff/chitwanabm)

Agent-based model of population and land use dynamics in the Chitwan Valley, Nepal. Developed as part of my dissertation research to explore feedbacks between demographic decision-making and land cover change.

### wrspathrow (no longer maintained)

**Primary Developer** | [CRAN](https://cran.r-project.org/package=wrspathrow) | [GitHub](https://github.com/azvoleff/wrspathrow)

R package for working with Landsat Worldwide Reference System (WRS) path/row designations. Useful for identifying which Landsat scenes cover a given area of interest.

---

## Development Philosophy

All of my software tools are developed with these principles in mind:

1. **Open Source**: All code is freely available under permissive licenses
2. **Reproducibility**: Tools enable reproducible research workflows
3. **Accessibility**: Designed for users with varying levels of technical expertise
4. **Scalability**: Built to handle analyses from local to global scales

## Get Involved

I welcome contributions to any of these projects. Feel free to:

- Report issues or suggest features on GitHub
- Submit pull requests with improvements
- Reach out with questions about using the tools

Visit my [GitHub profile](https://github.com/azvoleff) to explore all repositories.
