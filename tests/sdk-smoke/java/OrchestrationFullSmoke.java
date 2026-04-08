// AEGIS Java SDK orchestration smoke test.
//
// Setup (after publishing aegis-sdk to local maven):
//   cd /path/to/aegis-sdk/java && ./gradlew publishToMavenLocal
//   cd tests/sdk-smoke/java
//   AEGIS_API_KEY_PROD=... ./gradlew run
//
// Or compile + run directly with the built jar:
//   javac -cp /path/to/aegis-sdk-0.1.0.jar OrchestrationFullSmoke.java
//   AEGIS_API_KEY_PROD=... java -cp .:/path/to/aegis-sdk-0.1.0.jar OrchestrationFullSmoke

import ai.aegis.sdk.AegisClient;
import ai.aegis.sdk.resources.OrchestrationResource;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class OrchestrationFullSmoke {

    static class Result {
        String name; String status; String detail;
        Result(String n, String s, String d) { name = n; status = s; detail = d; }
    }

    static List<Result> results = new ArrayList<>();

    static <T> T call(String name, java.util.function.Supplier<T> fn) {
        long t0 = System.currentTimeMillis();
        try {
            T out = fn.get();
            results.add(new Result(name, "OK", (System.currentTimeMillis() - t0) + "ms"));
            return out;
        } catch (Throwable e) {
            String msg = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage();
            if (msg.length() > 120) msg = msg.substring(0, 120);
            results.add(new Result(name, "FAIL", (System.currentTimeMillis() - t0) + "ms " + msg));
            return null;
        }
    }

    public static void main(String[] args) {
        String apiKey = System.getenv("AEGIS_API_KEY_PROD");
        if (apiKey == null) apiKey = System.getenv("AEGIS_API_KEY");
        if (apiKey == null) {
            System.err.println("set AEGIS_API_KEY_PROD or AEGIS_API_KEY");
            System.exit(2);
        }
        String baseUrl = System.getenv().getOrDefault("AEGIS_BASE_URL", "https://api.aiaegis.io");
        String tenantId = System.getenv().getOrDefault(
            "AEGIS_TEST_TENANT_ID", "00000000-0000-0000-0000-000000000001");
        String sample = "테스트입니다 — 비밀번호는 1234입니다.";

        AegisClient client = AegisClient.builder(apiKey).baseUrl(baseUrl).build();
        OrchestrationResource o = client.orchestration();

        Map<String, Object> runBody = new HashMap<>();
        runBody.put("content", sample);

        call("POST /v1/orchestration/runs", () -> o.run(runBody));
        call("POST /v1/orchestration/runs/basic", () -> o.basic(runBody));
        call("POST /v1/orchestration/runs/standard", () -> o.standard(runBody));
        call("POST /v1/orchestration/runs/full", () -> o.full(runBody));
        call("POST /v1/orchestration/runs/advanced", () -> o.advanced(runBody));
        call("POST /v1/orchestration/runs/agent", () -> o.agent(runBody));
        call("POST /v1/orchestration/runs/anomaly", () -> o.anomaly(runBody));
        call("POST /v1/orchestration/runs/pii", () -> o.pii(runBody));
        Map<String, Object> ts = new HashMap<>();
        ts.put("value", 42.0);
        ts.put("history", List.of(10.0, 11.0, 9.5, 10.2, 10.8));
        ts.put("algorithm", "zscore");
        call("POST /v1/orchestration/runs/anomaly/timeseries", () -> o.anomalyTimeseries(ts));
        call("GET  /v1/orchestration/configs/{tid}/standard", () -> o.getConfig(tenantId, "standard"));
        Map<String, Object> upsert = new HashMap<>();
        upsert.put("algorithm", "weighted_mean");
        upsert.put("mode", "auto");
        upsert.put("weights", Map.of("v1.judge", 0.5, "v2.classify", 0.5));
        upsert.put("thresholds", Map.of("block", 0.7));
        call("PUT  /v1/orchestration/configs/{tid}/standard", () -> o.upsertConfig(tenantId, "standard", upsert));
        Map<String, Object> gs = new HashMap<>();
        gs.put("domain", "default");
        gs.put("scenario", "standard");
        gs.put("max_samples", 5);
        call("POST /v1/orchestration/gridsearch", () -> o.gridsearch(gs));
        Map<String, Object> job = call("POST /v1/orchestration/gridsearch/jobs", () -> o.createGridsearchJob(gs));
        String jobId = job != null && job.get("job_id") != null
            ? job.get("job_id").toString()
            : "00000000-0000-0000-0000-000000000000";
        final String fJobId = jobId;
        call("GET  /v1/orchestration/gridsearch/jobs/{id}", () -> o.getGridsearchJob(fJobId));
        call("GET  /v1/orchestration/gridsearch/jobs/{id}/results", () -> o.listGridsearchResults(fJobId));
        Map<String, Object> promote = new HashMap<>();
        promote.put("tenant_id", tenantId);
        promote.put("scenario", "standard");
        call("POST /v1/orchestration/gridsearch/jobs/{id}/promote",
            () -> o.promoteGridsearchJob(fJobId, promote));
        call("GET  /v1/orchestration/datasets", () -> o.listDatasets());
        Map<String, Object> pipe = new HashMap<>();
        pipe.put("prompt", sample);
        pipe.put("evolution_generations", 1);
        pipe.put("saber_trials", 5);
        call("POST /v3/pipeline/run", () -> o.pipelineRun(pipe));
        Map<String, Object> mil = new HashMap<>();
        mil.put("text", sample);
        call("POST /v3/military/orchestrate", () -> o.militaryOrchestrate(mil));
        call("GET  /v3/military/status", o::militaryStatus);

        long ok = results.stream().filter(r -> r.status.equals("OK")).count();
        System.out.printf("%n=== Java SDK Orchestration Smoke (%s) ===%n", baseUrl);
        System.out.printf("  %d/%d OK%n", ok, results.size());
        for (Result r : results) {
            String mark = r.status.equals("OK") ? "OK" : "FAIL";
            System.out.printf("  [%s] %-60s %s%n", mark, r.name, r.detail);
        }
        try { client.close(); } catch (Exception ignored) {}
        System.exit(ok == results.size() ? 0 : 1);
    }
}
