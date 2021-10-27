const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

let packages = JSON.parse(
  exec(
    `${path.join(__dirname, '..', 'node_modules', '.bin', 'lerna')} ls  --json`,
  ),
);
let packageVersions = new Map(
  packages.map(pkg => [
    pkg.name,
    {version: pkg.version, location: pkg.location},
  ]),
);
let coreVersion = packageVersions.get('@parcel/core').version;

for (let [, {location}] of packageVersions) {
  let pkgPath = path.join(location, 'package.json');
  let pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  if (pkg.engines?.parcel != null) {
    pkg.engines.parcel = coreVersion;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
}
