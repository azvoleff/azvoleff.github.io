---
title: Calculating image textures with GLCM
date: 2014-02-17
description: Introduction to calculating Gray Level Co-occurrence Matrix texture measures for remote sensing imagery.
tags:
  - R
  - glcm
  - remote sensing
  - teamlucc
---

`glcm` can calculate image textures from either a matrix or a `Raster*` object from the `raster` package. First install the package if it is not yet installed:

```r
if (!(require(glcm))) install.packages("glcm")
```

The below examples use an image included in the `glcm` package, a red/green/blue cutout of a Landsat 5 image from 1986 from a Tropical Ecology Assessment and Monitoring (TEAM) Network site in Volcan Barva, Costa Rica. The image is included in the glcm package as `L5TSR_1986`:

```r
library(raster)
plotRGB(L5TSR_1986, 3, 2, 1, stretch='lin')
```

![1986 Landsat 5 image from Volcan Barva](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/L5TSR_1986_plot-1.png)

To calculate GLCM textures from this image using the default settings, type:

```r
textures <- glcm(raster(L5TSR_1986, layer=3))
```

where `raster(L5TSR_1986, layer=3)` selects the third (red) layer. To see the textures that have been calculated by default:

```r
names(textures)
## [1] "glcm_mean"          "glcm_variance"      "glcm_homogeneity"  
## [4] "glcm_contrast"      "glcm_dissimilarity" "glcm_entropy"      
## [7] "glcm_second_moment" "glcm_correlation"
```

This shows the eight GLCM texture statistics that have been calculated by default. These can all be visualized in R:

### Mean
```r
plot(textures$glcm_mean)
```
![Mean of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/mean-1.png)

### Variance
```r
plot(textures$glcm_variance)
```
![Variance of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/variance-1.png)

### Homogeneity
```r
plot(textures$glcm_homogeneity)
```
![Homogeneity of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/homogeneity-1.png)

### Contrast
```r
plot(textures$glcm_contrast)
```
![Contrast of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/contrast-1.png)

### Dissimilarity
```r
plot(textures$glcm_dissimilarity)
```
![Dissimilarity of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/dissimilarity-1.png)

### Entropy
```r
plot(textures$glcm_entropy)
```
![Entropy of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/entropy-1.png)

### Second Moment
```r
plot(textures$glcm_second_moment)
```
![Second moment of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/second_moment-1.png)

### Correlation
```r
plot(textures$glcm_correlation)
```
![Correlation of GLCM texture](/assets/blog/2014-02-17-calculating-image-textures-with-glcm/correlation-1.png)

## Learn More

The full documentation for the `glcm` package is available on [CRAN](https://cran.r-project.org/package=glcm).
