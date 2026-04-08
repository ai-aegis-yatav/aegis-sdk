# SDK Orchestration Smoke Tests

각 언어 SDK를 GitHub `ai-aegis-yatav/aegis-sdk` 에서 실제 설치한 후
**17개 V1 orchestration 엔드포인트 + 3개 V3 (pipeline·military) 엔드포인트**를
모두 호출하여 통과/실패 매트릭스를 출력한다.

## 환경 변수

| 변수 | 설명 | 기본값 |
|---|---|---|
| `AEGIS_API_KEY_PROD` (또는 `AEGIS_API_KEY`) | API 키 | (필수) |
| `AEGIS_BASE_URL` | API 엔드포인트 | `https://api.aiaegis.io` |
| `AEGIS_TEST_TENANT_ID` | 테넌트 UUID | 임의 |

## 1. Python (`pip install` from GitHub)

```bash
python -m venv .venv && source .venv/bin/activate
pip install "aegis-sdk @ git+https://github.com/ai-aegis-yatav/aegis-sdk.git#subdirectory=python"
AEGIS_API_KEY_PROD=... python tests/sdk-smoke/python/orchestration_full.py
```

## 2. Go (`go get` from GitHub)

```bash
mkdir -p /tmp/aegis-go-smoke && cd /tmp/aegis-go-smoke
go mod init smoke
go get github.com/ai-aegis-yatav/aegis-sdk/go@latest
cp /Users/kangseokju/Projects/AEGIS/tests/sdk-smoke/go/orchestration_full.go .
AEGIS_API_KEY_PROD=... go run orchestration_full.go
```

## 3. Rust (`cargo` git dep)

```bash
cd tests/sdk-smoke/rust
AEGIS_API_KEY_PROD=... cargo run --bin orchestration_full
```

> Cargo는 git 의존성에서 서브디렉터리를 직접 지원하지 않으므로
> 외부 repo 루트에 `Cargo.toml` 워크스페이스가 있어야 한다 (sync 과정에서 추가됨).

## 4. JavaScript

`@aegis-ai/sdk`는 빌드 산출물(`dist/`)을 GitHub에 커밋하지 않으므로
로컬 클론을 빌드한 뒤 path 설치한다.

```bash
git clone https://github.com/ai-aegis-yatav/aegis-sdk.git /tmp/aegis-sdk
cd tests/sdk-smoke/javascript
AEGIS_SDK_JS_PATH=/tmp/aegis-sdk/javascript npm run install-sdk
AEGIS_API_KEY_PROD=... npm run smoke
```

## 5. Java

```bash
git clone https://github.com/ai-aegis-yatav/aegis-sdk.git /tmp/aegis-sdk
cd /tmp/aegis-sdk/java && ./gradlew publishToMavenLocal
cd tests/sdk-smoke/java
javac -cp $(find ~/.m2/repository/ai/aegis -name 'aegis-sdk-*.jar' | head -1) OrchestrationFullSmoke.java
AEGIS_API_KEY_PROD=... java -cp .:$(find ~/.m2/repository/ai/aegis -name 'aegis-sdk-*.jar' | head -1):$(cat ~/.m2/repository/ai/aegis/aegis-sdk/0.1.0/aegis-sdk-0.1.0.pom 2>/dev/null | grep -oE 'jackson-[a-z]+-[0-9.]+' | head -1) OrchestrationFullSmoke
```

(Jackson runtime classpath은 Gradle의 `runtimeClasspath` 도움이 더 편리하다.)

## 결과 매트릭스

각 스크립트는 다음 형식으로 출력한다:

```
=== <Lang> SDK Orchestration Smoke (https://api.aiaegis.io) ===
  18/20 OK
  ✅ POST /v1/orchestration/runs                                       42ms
  ✅ POST /v1/orchestration/runs/standard                              48ms
  ❌ POST /v3/pipeline/run                                             12ms 401 Unauthorized
  ...
```

종료 코드: 모두 OK면 0, 1개 이상 FAIL이면 1.
