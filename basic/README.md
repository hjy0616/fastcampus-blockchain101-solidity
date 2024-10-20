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

<hr />

### 가스비 측정 모듈 추가

```bash
npm i hardhat-gas-reporter --save
```

- 다시한번 테스트 시 예산 가스비가 모두 나오게 된다.
<hr />

### sol2 uml 사용

- 설치

```bash
npm link sol2uml --only=production
```

<hr />

### 버전 체크

```bash
npm ls sol2uml -g
```

```
/usr/local/lib
└── sol2uml@1.1.29
```

<hr />

### uml 그리기

```bash
sol2uml ./contracts/VendigMachine.sol
```
