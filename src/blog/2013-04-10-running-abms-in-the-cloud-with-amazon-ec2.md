---
title: Running ABMs in the Cloud with Amazon EC2
date: 2013-04-10
description: How to run computationally intensive agent-based models on Amazon EC2 cloud instances.
---

Agent-based models (ABMs) can be computationally intensive, especially when running Monte Carlo simulations that require thousands of model runs. Cloud computing services like Amazon EC2 provide a cost-effective way to access the computing power needed for these simulations.

## Why Use Cloud Computing for ABMs?

Running an ABM often requires:
- Hundreds or thousands of model runs for sensitivity analysis
- Large amounts of memory for complex agent populations
- Long runtimes that would tie up local machines

Cloud computing allows you to:
- Scale up to many instances for parallel runs
- Pay only for the compute time you use
- Access powerful hardware without capital investment

## Setting Up an EC2 Instance

### 1. Choose an Instance Type

For CPU-intensive ABM work, compute-optimized instances work well:
- **c5.xlarge**: Good balance of cost and performance
- **c5.4xlarge**: For larger models or faster parallel processing

### 2. Configure Your Instance

Create an Amazon Machine Image (AMI) with your ABM environment:

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade

# Install Python and dependencies
sudo apt-get install python3 python3-pip
pip3 install numpy scipy pyabm

# Install R if needed
sudo apt-get install r-base
```

### 3. Upload Your Model

Use `scp` to transfer your model files:

```bash
scp -i your-key.pem model_files.zip ec2-user@your-instance:~/
```

## Running Parallel Simulations

To take full advantage of EC2, run multiple simulations in parallel:

```python
from multiprocessing import Pool
from pyabm import Model

def run_simulation(params):
    model = Model(params)
    return model.run()

# Run 100 simulations across all available cores
with Pool() as p:
    results = p.map(run_simulation, parameter_sets)
```

## Cost Optimization Tips

- Use **spot instances** for up to 90% cost savings
- **Stop instances** when not in use
- Use **S3** for storing results instead of keeping instances running
- Consider **AWS Batch** for large-scale batch processing

## Conclusion

Cloud computing opens up new possibilities for ABM research by providing access to scalable computing resources on demand. For large-scale simulations, the cost and convenience benefits make it an attractive option.
