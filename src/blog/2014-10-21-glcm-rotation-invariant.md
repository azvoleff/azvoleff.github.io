---
title: Calculating rotation invariant GLCM textures
date: 2014-10-21
description: How to calculate rotationally invariant texture measures using the glcm R package.
tags:
  - R
  - glcm
  - remote sensing
---

This post outlines how to use the `glcm` package to calculate image textures that are direction invariant (calculated over "all directions"). This feature is available in `glcm` versions >= 1.0.

## Getting started

First install the latest version of `glcm`, and the `raster` package that is also needed for this example:

```r
install.packages("glcm")
library(glcm)
library(raster)
```

## Calculating rotationally invariant textures

`glcm` supports calculating GLCMs using multiple shift values. If multiple shifts are supplied, `glcm` will calculate each texture statistic using each of the specified shifts, and return the mean value of the texture for each pixel.

In general, I have not found large differences in calculated image textures when comparing GLCM textures calculated using a single shift versus calculating rotationally invariant textures. However this may not be the case for images with strongly directional textures.

To compare for a sample cropped out of a Landsat scene, use the `L5TSR_1986` sample image included in the `glcm` package. This is a section of a 1986 Landsat 5 image preprocessed to surface reflectance from the [Volcán Barva TEAM site](http://www.teamnetwork.org/network/sites/volc%C3%A1n-barva).

When `glcm` is run without specifying a shift, the default shift (1, 1) is used (90 degrees), with a window size of 3 pixels x 3 pixels:

```r
test_rast <- raster(L5TSR_1986, layer=1)
tex_shift1 <- glcm(test_rast)
plot(tex_shift1)
```

![GLCM textures calculated with 90 degree shift](/assets/blog/2014-10-21-glcm-rotation-invariant/glcm_90deg_shift-1.png)

To calculate rotationally invariant GLCM textures (over "all directions" in the terminology of commonly used remote sensing software), use: `shift=list(c(0,1), c(1,1), c(1,0), c(1,-1))`. This will calculate the average GLCM texture using shifts of 0 degrees, 45 degrees, 90 degrees, and 135 degrees:

```r
tex_all_dir <- glcm(test_rast, shift=list(c(0,1), c(1,1), c(1,0), c(1,-1)))
plot(tex_all_dir)
```

![GLCM textures calculated over all directions](/assets/blog/2014-10-21-glcm-rotation-invariant/glcm_all_directions-1.png)

To compare the difference between these textures, subtract the textures calculated with a 90 degree shift from those calculated using multiple shifts, and plot the result:

```r
plot((tex_all_dir - tex_shift1) / tex_all_dir)
```

![Difference between all-directions and 90-degree GLCM textures](/assets/blog/2014-10-21-glcm-rotation-invariant/glcm_all_directions_vs_90deg-1.png)

## Computation time

There is a performance penalty for using a rotationally invariant GLCM (not surprisingly, as more calculations are involved). Using `microbenchmark` to compare:

```r
library(microbenchmark)

glcm_one_dir <- function(x) {
  glcm(x)
}

glcm_all_dir <- function(x) {
  glcm(x, shift=list(c(0,1), c(1,1), c(1,0), c(1,-1)))
}

microbenchmark(glcm_one_dir(test_rast), glcm_all_dir(test_rast), times=5)
```

The rotationally invariant calculation takes roughly 4x longer, which is expected since we're computing textures for four directions instead of one.

## Learn More

The full documentation for the `glcm` package is available on [CRAN](https://cran.r-project.org/package=glcm).
