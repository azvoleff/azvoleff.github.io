---
layout: post
title: "Cloud removal with teamlucc"
description: "How to use the teamlucc R package to remove thick clouds in Landsat imagery"
category: articles
tags: [R, teamlucc, remote sensing, Landsat]
comments: true
share: true
---

## Overview

This post outlines how to use the `teamlucc` package to remove thick clouds from Landsat 
imagery using the Neighborhood Similar Pixel Interpolator (NSPI) algorithm by 
[Zhu et al.](ieeexplore.ieee.org/xpl/login.jsp?tp=&arnumber=6095313)[^1]. 
`teamlucc` includes the original 
[IDL](http://www.exelisvis.com/ProductsServices/IDL.aspx) code by Xiaolin Zhu 
(modified slightly to be called from R) as well as a native R/C++ 
implementation of the original NSPI algorithm. Thanks to Xiaolin for permission 
to redistribute this code along with the `teamlucc` package.

[^1]:
    Zhu, X., Gao, F., Liu, D., Chen, J., 2012. A modified neighborhood similar 
    pixel interpolator approach for removing thick clouds in Landsat images. 
    Geoscience and Remote Sensing Letters, IEEE 9, 521–525. 
    doi:10.1109/LGRS.2011.2173290


## Getting started

First load the `teamlucc` package, and the `SDMTools` package we will use 
later:


{% highlight r %}
library(teamlucc)
library(SDMTools)
{% endhighlight %}

If `teamlucc` is not installed, install it using `devtools`"


{% highlight r %}
if (!require(teamlucc)) install_github('azvoleff/teamlucc')
{% endhighlight %}

## Simplest approach: cloud fill a single clouded image with a single clear image

This example will use a portion of a 1986 Landsat 5 scene from Volcan Barva, 
Costa Rica (a [TEAM 
Network](http://www.teamnetwork.org/network/sites/volc%C3%A1n-barva) monitoring 
site). The scene is WRS-2 path 15, row 53. Particularly in the tropics, it can 
sometimes be difficult to find a Landsat image that is cloud-free. Cloud 
filling can offer a solution to this problem if there are multiple Landsat 
scenes captured of an area of interest, that, taken together, offer a 
cloud-free (or nearly cloud-free) view of an area. Throughout this post I will 
refer to the "base" and the "fill" images. The "base" image is a cloudy image 
that will be filled using images (the "fill images) of the same area that were 
captured on different dates.

While it can sometimes be possible to find a cloud-free scene from a different 
part of the year that can be used to fill in a cloudy scene from an earlier or 
later base date, it is often the case that both the fill and base image will 
have clouds. Therefore we must use cloud masks to mark areas in both the base 
and the fill image. Without a cloud mask for the fill image we could otherwise 
inadvertently fill clouded areas in one image with also cloudy pixels from 
another image.

The base (cloudy) image for this example is from January 5, 1986, and the fill
image is from January 21, 1986.  The images are surface reflectance images from 
the [Landsat Surface Reflectance Climate Data Record 
(CDR)](http://landsat.usgs.gov/CDR_LSR.php), that also include cloud masks 
constructed with the [Function of Mask (fmask) 
algorithm](https://code.google.com/p/fmask)[^2].

To follow along with this analysis, [download these 
files](/content/2014-04-16-cloud-removal-with-teamlucc/2014-04-16-cloud-removal-with-teamlucc.zip).  
Note that the original CDR reflectance images have been rescaled to range 
between 0 and 255 in the files supplied here.

[^2]:
    Zhu, Z. and Woodcock, C. E., Object-based cloud and cloud shadow detection 
    in Landsat imagery, Remote Sensing of Environment (2012), 
    doi:10.1016/j.rse.2011.10.028

### Load input data

First load the base and fill images into R:


{% highlight r %}
base <- brick('vb_1986_005_b234.tif')
{% endhighlight %}



{% highlight text %}
## rgdal: version: 0.8-16, (SVN revision 498)
## Geospatial Data Abstraction Library extensions to R successfully loaded
## Loaded GDAL runtime: GDAL 1.10.1, released 2013/08/26
## Path to GDAL shared files: C:/Users/azvoleff/R/win-library/3.1/rgdal/gdal
## GDAL does not use iconv for recoding strings.
## Loaded PROJ.4 runtime: Rel. 4.8.0, 6 March 2012, [PJ_VERSION: 480]
## Path to PROJ.4 shared files: C:/Users/azvoleff/R/win-library/3.1/rgdal/proj
{% endhighlight %}



{% highlight r %}
base_mask <- raster('vb_1986_005_fmask.tif')
fill <- brick('vb_1986_021_b234.tif')
fill_mask <- raster('vb_1986_021_fmask.tif')
{% endhighlight %}

Notice the cloud cover in the base image:


{% highlight r %}
plotRGB(base, stretch='lin')
{% endhighlight %}

![Base image](/content/2014-04-16-cloud-removal-with-teamlucc/base_image.png) 

The fill image also has cloud cover, but less than the fill image - there are 
areas of the fill that can be used to fill clouded pixels in the base image:


{% highlight r %}
plotRGB(fill, stretch='lin')
{% endhighlight %}

![Fill image](/content/2014-04-16-cloud-removal-with-teamlucc/fill_image.png) 

### Topographic correction

In mountainous areas, topographic correction should be performed prior to cloud 
fill[^1]. `teamlucc` supports performing topographic correction using 
algorithms derived from those in the `landsat` 
package](http://cran.r-project.org/web/packages/landsat/index.html) by Sarah 
Goslee[^3].

[^3]:
    [Sarah C. Goslee (2011). Analyzing Remote Sensing Data in R: The landsat 
    Package. Journal of Statistical Software, 43(4), 
    1-25.](http://www.jstatsoft.org/v43/i04/. )

To perform topographic correction, use the `topographic_corr` function in 
`teamlucc`. First load the slope and aspect rasters:


{% highlight r %}
slp_asp <- brick('vb_slp_asp.tif')
{% endhighlight %}

Now call the `topographic_corr` function twice, to topographically correct both 
the base and fill image. Note that the sun angle elevation and sun azimuth 
(both in degrees) must be supplied - values for these parameters can be found 
in the metadata accompanying your imagery. See `?topographic_corr` for more 
information.  `DN_min` and `DN_max` can be used to ensure that invalid values 
are not generated by the topographic correction routine (which can sometimes be 
a problem in very heavily shadowed areas, or in very bright areas, such as 
clouds).


{% highlight r %}
base_tc <- topographic_corr(base, slp_asp, sunelev=90-47.34, sunazimuth=134.04, 
                            DN_min=0, DN_max=255)
fill_tc <- topographic_corr(fill, slp_asp, sunelev=90-46.80, sunazimuth=129.88, 
                            DN_min=0, DN_max=255)
{% endhighlight %}


{% highlight r %}
plotRGB(base_tc, stretch='lin')
{% endhighlight %}

![Base image after topographic correction](/content/2014-04-16-cloud-removal-with-teamlucc/base_tc.png) 


{% highlight r %}
plotRGB(fill_tc, stretch='lin')
{% endhighlight %}

![Fill image after topographic correction](/content/2014-04-16-cloud-removal-with-teamlucc/fill_tc.png) 

### Construct cloud masks

The fmask band from the CDR imagery uses the following codes:

| Pixel type     |  Code  |
| -------------- | :----: |
| Clear land     |    0   |
| Clear water    |    1   |
| Cloud shadow   |    2   |
| Snow           |    3   |
| Cloud          |    4   |
| No observation |   255  |

We need to construct a mask of areas where all pixels that are cloud (code 4) 
or cloud shadow (code 2) are equal to 1, and where pixels in all other areas 
are equal to zero.  This is easy using raster algebra from the R `raster` 
package:


{% highlight r %}
base_mask <- (base_mask == 2) | (base_mask == 4)
fill_mask <- (fill_mask == 2) | (fill_mask == 4)
{% endhighlight %}

Plot these masks to double-check they align with the clouds in the images we 
viewed earlier:


{% highlight r %}
plot(base_mask)
{% endhighlight %}

![Base image cloud mask](/content/2014-04-16-cloud-removal-with-teamlucc/base_mask.png) 


{% highlight r %}
plot(fill_mask)
{% endhighlight %}

![Fill image cloud mask](/content/2014-04-16-cloud-removal-with-teamlucc/fill_mask.png) 

### Fill clouds

For this simple example, we will directly use the `cloud_remove` function in 
`teamlucc`. This function has a number of input parameters that can be supplied 
(see `?cloud_remove`). Two important ones to note are `DN_min` and `DN_max`. 
These are the minimum and maximum valid values, respectively, that a pixel in 
the image can take on. These limits are used to ignore unrealistic predictions 
that may arise in the cloud fill routine. For the base and fill images we are 
working with here, these values are 0 and 255, for max and min, respectively. 
Set these parameters to appropriate values as necessary for the images you are 
working with.

The cloud mask for the base image must be constructed so that each cloud has 
its own unique integer code, with codes starting from 1. This process can be 
automated using the `ConnCompLabel` function from the `SDMTools` package:


{% highlight r %}
base_mask <- ConnCompLabel(base_mask)
{% endhighlight %}

Finally, because there are clouds in our fill image as well as in our base 
image, we need to modify the `base_mask` slightly to account for this, and to 
tell the `cloud_remove` function in `teamlucc` not to attempt cloud filling for 
pixels in the base image that are also clouded in the fill image. Do this by 
setting all pixels in the `base_mask` that are clouded in the `fill_mask` to 
`-1`.


{% highlight r %}
base_mask[fill_mask] <- -1
{% endhighlight %}

The final `base_mask` is now coded as:

| Pixel type                       | Code    |
| -------------------------------- | :-----: |
| Clouded in `fill`                |   -1    |
| Clear in `base`, clear in `fill` |    0    |
| Clouded in `base`                | 1 ... n |

where n is the number of clouds in the image:


{% highlight r %}
plot(base_mask)
{% endhighlight %}

![Base mask with areas clouded in fill image masked out](/content/2014-04-16-cloud-removal-with-teamlucc/base_mask_recoded.png) 

The default version of the `cloud_remove` runs an IDL script provided by 
[Xiaolin Zhu](http://geography.osu.edu/grads/xzhu/). For R to be able to run 
this script it must know the path to IDL on your machine. For Windows users, 
this means the path to "idl.exe". To specify this path you will need to provide 
the `idl` parameter to the `cloud_remove` script. The default value (C:/Program 
Files/Exelis/IDL83/bin/bin.x86_64/idl.exe) may or may not work on your machine.

An optional `out_name` parameter can be supplied to `cloud_remove` to specify 
the filename for the output file. If not supplied, R will save the filled image 
as an R object pointing to a temporary file.

To run the cloud removal routine, call the `cloud_remove` function with the 
appropriate parameters. Note that this computation may take some time (10-15 
minutes).


{% highlight r %}
# start_time <- Sys.time()
# base_filled <- cloud_remove(base_tc, fill_tc, base_mask, 
#                             out_name='vb_1986_005_b234_filled.envi',
#                             idl="C:/Program Files/Exelis/IDL83/bin/bin.x86_64/idl.exe")
# Sys.time() - start_time
{% endhighlight %}

The default cloud fill approach can take a long time to run (this above 
calculation takes about 30-40 minutes on my 2.9Ghz Core-i7 3520M laptop). There 
is an alternative approach that can take considerably less time to run, with 
similar results. This option can be enabled by supplying the `fast=TRUE` 
parameter to `cloud_remove`:

The "fast" version of the algorithm makes some simplifications to improve 
running time. Specifically, rather than follow the precise algorithm as 
outlined by Zhu et al.[^1], the "fast" routine uses k-means clustering to 
divide the image into the number of classes specified by the `num_class` 
parameter. The script then constructs a linear model of the temporal change in 
reflectance for each class within the neighborhood of a given cloud. This 
"temporal" adjustment is complemented by a "spatial" adjustment that considers 
the change in reflectance in a small neighborhood around each clouded pixel. 
For each clouded pixel, a weighted combination of the predicted fill values 
from the spatial and temporal models determines the final predicted value for 
that pixel.


{% highlight r %}
# start_time <- Sys.time()
# base_filled_fast  <- cloud_remove(base_tc, fill_tc, base_mask, 
#                                   out_name='vb_1986_005_b234_filled_fast.envi',
#                                   DN_min=0, DN_max=255,
#                                   idl="C:/Program Files/Exelis/IDL83/bin/bin.x86_64/idl.exe",
#                                   fast=TRUE, num_class=3)
# Sys.time() - start_time
{% endhighlight %}

If you do not have IDL on your machine, there is a (experimental) C++ 
implementation of the NSPI cloud fill algorithm that will run directly in R. To 
run this version of the algorithm, call the `cloud_remove` function with the 
same parameters as above, but specify `use_IDL=FALSE`. This function also has a 
`verbose=TRUE` option to tell `cloud_remove` to print progress statements as it 
is running (this option is not available with the IDL scripts shown above):


{% highlight r %}
# start_time <- Sys.time()
# base_filled_R <- cloud_remove(base_tc, fill_tc, base_mask, DN_min=0, DN_max=255, 
#                               use_IDL=FALSE, verbose=TRUE)
# Sys.time() - start_time
{% endhighlight %}

## Advanced approach: automated cloud fill from an image time series

The `teamlucc` package also includes functions for automated cloud filling from 
an image time series. Automatic cloud filling is performed using the 
`team_cloud_fill` function. This function automates the majority of the cloud 
filling process. As multiple images are required to demonstrate this process, 
the images required for this portion of the example are not available for 
download from this site. I suggest you download the appropriate imagery for a 
particular study site and preprocess the imagery using the `team_setup_dem` and 
`team_preprocess_landsat` functions in the `teamlucc` package so that you can 
follow along with this example. The `team_preprocess_landsat` function will 
also perform topographic correction, which is necessary prior to cloud filling 
images in mountainous areas.

The `team_cloud_fill` function allows an analyst to automatically construct a 
cloud-filled image after specifying: `data_dir` (a folder of Landsat 
images), `wrspath` and `wrsrow` (the WRS-2 path/row to use), and `start_date` 
and `end_date` (a start and end date limiting the images to use in the 
algorithm). The analyst can also optionally specify a `base_date`, and the 
`team_cloud_fill` function will automatically pick the image closest to that 
date to use as the base image.

As the `team_cloud_fill` function automatically chooses images for inclusion in 
the cloud fill process, it relies on having images stored on disk in a 
particular way, and currently only supports cloud fill for Landsat CDR surface 
reflectance images. To ensure that images are correctly stored on your hard 
disk, use the `team_preprocess_landsat` function to extract the original 
Landsat CDR hdf files from the USGS archive. The `team_preprocess_landsat` 
function will ensure that images are extracted and renamed properly so that 
they can be used with the `team_cloud_fill` script.



{% highlight r %}
# start_time <- Sys.time()
# team_cloud_fill()
# Sys.time() - start_time
# start_date <- as.Date('1986-01-01')
# end_date <- as.Date('1987-01-01')
# filled_image <- team_cloud_fill("C:/Data/LEDAPS_imagery", wrspath=230, 
#                                 wrsrow=62, start_date=start_date,
#                                 end_date=end_date)
{% endhighlight %}