import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ExploreHomeView } from "./ExploreHomeView";
import { slugify, type Monument } from "./data/monuments";
import { useUserState } from "../../context/UserStateContext";

/**
 * ExploreHeritagePage — the Explore home. Selecting a monument now navigates
 * to the real /monuments/:id route instead of swapping content inline, so the
 * URL changes and browser back/forward work naturally.
 */
export function ExploreHeritagePage() {
  const navigate = useNavigate();
  const { addActivity, incrementStat } = useUserState();

  useEffect(() => {
    addActivity("Explore Heritage", "Opened Explore Heritage");
    incrementStat("explorationCount");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (monument: Monument) => {
    navigate({ to: "/monuments/$id", params: { id: slugify(monument.name) } });
  };

  return <ExploreHomeView onSelectMonument={handleSelect} />;
}
