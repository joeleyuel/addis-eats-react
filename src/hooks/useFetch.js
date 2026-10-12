import { useCallback, useEffect, useState } from "react";

// Reusable data-fetching hook. `fetcher` receives an AbortSignal.
//
// Cleanup on unmount: when the component unmounts, or `deps` change before the
// request finishes, the request is aborted and its result is ignored — so a
// slow response can never overwrite a newer one or update an unmounted component.
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setState({ data: null, loading: true, error: null });

    fetcher(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch((err) => {
        if (controller.signal.aborted || err.name === "AbortError") return;
        setState({ data: null, loading: false, error: err.message || "Something went wrong." });
      });

    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((n) => n + 1), []);

  return { data: state.data, loading: state.loading, error: state.error, reload };
}
