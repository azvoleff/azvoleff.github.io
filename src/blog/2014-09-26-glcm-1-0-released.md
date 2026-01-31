---
title: glcm 1.0 released
date: 2014-09-26
description: Version 1.0 of the glcm package is now available on CRAN.
---

I'm happy to announce that version 1.0 of the `glcm` package is now available on CRAN. This release marks a major milestone for the package.

## What is glcm?

`glcm` is an R package for calculating image texture measures based on the Gray Level Co-occurrence Matrix. These texture statistics are widely used in remote sensing for image classification, segmentation, and feature extraction.

## New in Version 1.0

This release includes several important improvements:

- **Improved performance**: The core algorithms have been rewritten using Rcpp for significantly faster processing
- **Better memory management**: Large rasters can now be processed more efficiently
- **Rotation invariant textures**: New support for calculating direction-independent texture measures
- **Additional statistics**: Several new texture statistics have been added

## Installation

Install from CRAN:

```r
install.packages("glcm")
```

Or install the development version from GitHub:

```r
devtools::install_github("azvoleff/glcm")
```

## Basic Usage

```r
library(glcm)
library(raster)

# Load a raster image
r <- raster("your_image.tif")

# Calculate GLCM textures
textures <- glcm(r, window = c(3, 3), 
                 statistics = c("mean", "variance", "homogeneity", 
                               "contrast", "entropy"))
```

## Feedback

Please report any issues or feature requests on the [GitHub repository](https://github.com/azvoleff/glcm).
