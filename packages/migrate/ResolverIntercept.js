class ResolverIntercept {
  constructor(resolver) {
    this.resolver = resolver;
    this.cache = [];
  }

  require(contractName) {
    // remove file extension if present on name
    const sanitizedContractName = contractName
      .replace(/^\.\//, "")
      .replace(/\.sol$/i, "");

    // there may be more than one contract of the same name which will be
    // problematic - only return the first one found in the cache for now
    for (const contract of this.cache) {
      if (contract.contract_name === sanitizedContractName) {
        return contract;
      }
    }

    // Note, will error if nothing is found.
    const resolved = this.resolver.require(sanitizedContractName);

    this.cache.push(resolved);

    return resolved;
  }

  contracts() {
    return this.cache;
  }
}

module.exports = ResolverIntercept;
