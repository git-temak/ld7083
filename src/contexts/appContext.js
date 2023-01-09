import { createContext, useState } from "react";

const appContext = createContext();

export const AppProvider = ({ children }) => {
  const [lastUpdate, setLastUpdate] = useState();
  const [deathState, setDeathState] = useState();
  const [caseState, setCaseState] = useState();
  const [vaccineState, setVaccineState] = useState();
  const [healthcareState, setHealthcareState] = useState();
  const [infectionState, setInfectionState] = useState();
  const [overviewState, setOverviewState] = useState();
  const [loading, setLoading] = useState(false);
  const [metricsState, setMetricsState] = useState(false);

  const values = {
    lastUpdate,
    setLastUpdate,
    deathState,
    setDeathState,
    caseState,
    setCaseState,
    vaccineState,
    setVaccineState,
    healthcareState,
    setHealthcareState,
    infectionState,
    setInfectionState,
    overviewState,
    setOverviewState,
    loading,
    setLoading,
    metricsState,
    setMetricsState,
  };
  return <appContext.Provider value={values}>{children}</appContext.Provider>;
};

export default appContext;
