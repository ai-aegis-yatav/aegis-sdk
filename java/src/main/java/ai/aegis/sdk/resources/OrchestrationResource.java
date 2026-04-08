package ai.aegis.sdk.resources;

import ai.aegis.sdk.internal.Transport;

import java.util.List;
import java.util.Map;

/**
 * OrchestrationResource — /v1/orchestration/* API group.
 * Every runs/* call always includes v1/judge. v2/v3 detectors are layered
 * server-side via in-process native adapters.
 *
 * <p>For simplicity this resource returns Map/List representations; callers
 * can deserialize into their own models as needed.</p>
 */
public class OrchestrationResource extends BaseResource {

    public OrchestrationResource(Transport transport) {
        super(transport);
    }

    // ---- runs ----

    public Map<String, Object> run(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs", body);
    }

    public Map<String, Object> basic(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/basic", body);
    }

    public Map<String, Object> standard(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/standard", body);
    }

    public Map<String, Object> full(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/full", body);
    }

    public Map<String, Object> advanced(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/advanced", body);
    }

    public Map<String, Object> agent(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/agent", body);
    }

    public Map<String, Object> anomaly(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/anomaly", body);
    }

    public Map<String, Object> pii(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/pii", body);
    }

    public Map<String, Object> anomalyTimeseries(Map<String, Object> body) {
        return postMap("/v1/orchestration/runs/anomaly/timeseries", body);
    }

    // ---- configs ----

    public Map<String, Object> getConfig(String tenantId, String scenario) {
        return getMap("/v1/orchestration/configs/" + tenantId + "/" + scenario);
    }

    public Map<String, Object> upsertConfig(String tenantId, String scenario, Map<String, Object> body) {
        String path = "/v1/orchestration/configs/" + tenantId + "/" + scenario;
        return put(path, body, new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
    }

    // ---- gridsearch (synchronous smoke-test variant) ----

    /**
     * Run a synchronous grid search over a domain dataset.
     * Use {@link #createGridsearchJob(Map)} for the async, DB-persisted variant.
     */
    public Map<String, Object> gridsearch(Map<String, Object> body) {
        return postMap("/v1/orchestration/gridsearch", body);
    }

    // ---- gridsearch jobs (async, DB-persisted) ----

    public Map<String, Object> createGridsearchJob(Map<String, Object> body) {
        return postMap("/v1/orchestration/gridsearch/jobs", body);
    }

    public Map<String, Object> getGridsearchJob(String jobId) {
        return getMap("/v1/orchestration/gridsearch/jobs/" + jobId);
    }

    public List<Map<String, Object>> listGridsearchResults(String jobId) {
        return getList("/v1/orchestration/gridsearch/jobs/" + jobId + "/results");
    }

    public Map<String, Object> promoteGridsearchJob(String jobId, Map<String, Object> body) {
        return postMap("/v1/orchestration/gridsearch/jobs/" + jobId + "/promote", body);
    }

    public List<Map<String, Object>> listDatasets() {
        return getList("/v1/orchestration/datasets");
    }

    // ---- V3 Integrated Pipeline (POST /v3/pipeline/run) ----

    public Map<String, Object> pipelineRun(Map<String, Object> body) {
        return postMap("/v3/pipeline/run", body);
    }

    // ---- V3 Military Orchestrator ----

    public Map<String, Object> militaryOrchestrate(Map<String, Object> body) {
        return postMap("/v3/military/orchestrate", body);
    }

    public Map<String, Object> militaryStatus() {
        return getMap("/v3/military/status");
    }
}
