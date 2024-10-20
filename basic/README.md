# fastcampus-blockchain101 hardhat upgrade version

<hr />
The older version uses a function that has changed in the newer version, so we modified it to match the version.
I had a lot of difficulties, so I contacted Claude.ai to help me.

### Command

#### 1. deploying to network

```bash
npx hardhat run ./ignition/modules/deploy.ts --network hardhat
```

#### 2. Testing Contract

```bash
npx hardhat test
```

#### 3. deploying to a live network

```bash
npx hardhat ignition deploy ./ignition/modules/<filename>.ts --network hardhat
```
