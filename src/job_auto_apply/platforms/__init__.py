from job_auto_apply.platforms.greenhouse import GreenhouseAdapter
from job_auto_apply.platforms.indeed import IndeedAdapter

ADAPTERS = {
    "indeed": IndeedAdapter,
    "greenhouse": GreenhouseAdapter,
}

__all__ = ["ADAPTERS", "IndeedAdapter", "GreenhouseAdapter"]
