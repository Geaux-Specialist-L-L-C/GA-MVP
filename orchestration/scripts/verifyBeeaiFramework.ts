import { readFile } from "node:fs/promises";
import path from "node:path";

interface PackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

interface PackageLock {
  packages?: Record<string, { version?: string }>;
  dependencies?: Record<string, { version?: string }>;
}

async function readJson<T>(filePath: string): Promise<T> {
  const contents = await readFile(filePath, "utf8");
  return JSON.parse(contents) as T;
}

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

async function main(): Promise<void> {
  const root = process.cwd();
  const packageJsonPath = path.join(root, "package.json");
  const packageLockPath = path.join(root, "package-lock.json");

  const packageJson = await readJson<PackageJson>(packageJsonPath);
  const dependencies = packageJson.dependencies ?? {};
  const devDependencies = packageJson.devDependencies ?? {};

  if (!Object.prototype.hasOwnProperty.call(dependencies, "beeai-framework")) {
    if (Object.prototype.hasOwnProperty.call(devDependencies, "beeai-framework")) {
      fail("beeai-framework is listed in devDependencies; it must be a runtime dependency.");
    }
    fail("beeai-framework is missing from dependencies.");
  }

  const packageLock = await readJson<PackageLock>(packageLockPath);
  const installedVersion =
    packageLock.packages?.["node_modules/beeai-framework"]?.version ??
    packageLock.dependencies?.["beeai-framework"]?.version;

  if (!installedVersion) {
    fail("beeai-framework is not installed in package-lock.json.");
  }

  console.log(`beeai-framework installed version: ${installedVersion}`);
}

main().catch((error) => {
  console.error("verify:beeai failed", error);
  process.exit(1);
});
