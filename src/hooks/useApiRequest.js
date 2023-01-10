import { useContext } from "react";
import { appContext } from "../contexts";
import AppService from "../services/appService";
import {
  filterForDate,
  formatAgecases,
  formatVaccineData,
  formatVaccineDemo,
  extractCompleteVacc,
  getDataSum,
  formatDataToMonthAgg,
  formatByRegion,
  formatByAge,
} from "../utils";

const useApiRequest = () => {
  const {
    setLastUpdate,
    deathState,
    setDeathState,
    vaccineState,
    setVaccineState,
    overviewState,
    setOverviewState,
    metricsState,
    setMetricsState,
    setLoading,
    caseState,
    setCaseState,
    healthcareState,
    setHealthcareState,
  } = useContext(appContext);

  setLastUpdate(new Date().toString().slice(0, 33));

  const getOverviewCardData = async (date = "", refetch = false) => {
    let caseData = [],
      deathData = [],
      healthcareData = [],
      vaccineData = [];

    setLoading(true);
    try {
      if ((!metricsState && !date) || refetch) {
        const { data: _caseData } = await AppService.getCases({
          cumValue: true,
          date,
        });
        caseData = _caseData[0];

        const { data: _deathData } = await AppService.getDeaths({
          cumValue: true,
          date,
        });
        deathData = _deathData[0];

        const { data: _healthcareData } = await AppService.getHealthcare({
          cumValue: true,
          date,
        });
        healthcareData = _healthcareData[0];

        const { data: _vaccineData } = await AppService.getVaccines({
          cumValue: true,
          date,
        });
        vaccineData = _vaccineData[0];

        setMetricsState({
          caseData,
          deathData,
          healthcareData,
          vaccineData,
        });
      } else if (metricsState?.cumData) {
        // handles caching for saved latest cumulated data

        if (!date) {
          caseData = metricsState.caseData;
          deathData = metricsState.deathData;
          healthcareData = metricsState.healthcareData;
          vaccineData = metricsState.vaccineData;
        } else {
          const { ageCaseDist, healthcareDist, deathDist, vaccineDist } =
            metricsState.cumData;

          caseData = {
            value: getDataSum(filterForDate(ageCaseDist, date)),
          };
          healthcareData = {
            value: getDataSum(filterForDate(healthcareDist, date)),
          };
          deathData = {
            value: getDataSum(filterForDate(deathDist, date)),
          };
          vaccineData = {
            value: getDataSum(filterForDate(vaccineDist, date)),
          };
        }
      } else {
        const { data: ageCaseDist = [] } = await AppService.getCases({
          cumValue: false,
          newCases: true,
        });
        caseData = {
          value: getDataSum(filterForDate(ageCaseDist, date)),
        };

        const { data: healthcareDist } = await AppService.getHealthcare({
          cumValue: false,
          newAdm: true,
        });
        healthcareData = {
          value: getDataSum(filterForDate(healthcareDist, date)),
        };

        const { data: vaccineDist } = await AppService.getVaccines({
          cumValue: false,
        });
        vaccineData = {
          value: getDataSum(filterForDate(vaccineDist, date)),
        };

        const { data: deathDist } = await AppService.getDeaths({
          cumValue: false,
          newDeaths: true,
        });
        deathData = {
          value: getDataSum(filterForDate(deathDist, date)),
        };

        setMetricsState({
          ...metricsState,
          cumData: {
            ...metricsState.cumData,
            ageCaseDist,
            healthcareDist,
            deathDist,
            vaccineDist,
          },
        });
      }

      return {
        cases: caseData?.value,
        deaths: deathData?.value,
        healthcares: healthcareData?.value,
        vaccines: vaccineData?.value,
      };
    } catch (error) {
      console.log(error.stack);
      return;
    } finally {
      setLoading(false);
    }
  };

  const getDosages = async (date, cumValue = true) => {
    // vaccine doses
    const { data: _firstDose } = await AppService.getVaccines({
      cumValue,
      dosage: true,
      dosageIdx: "first",
      date,
    });

    const { data: _secondDose } = await AppService.getVaccines({
      cumValue,
      dosage: true,
      dosageIdx: "second",
      date,
    });

    const { data: _thirdDose } = await AppService.getVaccines({
      cumValue,
      dosage: true,
      dosageIdx: "third",
      date,
    });

    return {
      _firstDose,
      _secondDose,
      _thirdDose,
    };
  };

  const getOverviewChartsData = async (date = "", refetch = true) => {
    setLoading(true);
    try {
      let ageCases = {},
        deaths = [],
        healthcares = [],
        ageCaseDist = [],
        firstDose = [],
        secondDose = [],
        thirdDose = [],
        firstEpisodes = [],
        reinfections = [];

      // if (date || !overviewState) {
      if (!overviewState) {
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(date);

        // vaccine doses
        firstDose = _firstDose;
        secondDose = _secondDose;
        thirdDose = _thirdDose;

        // infections
        const { data: _firstEpisodes } = await AppService.getFirstEpisodes({
          cumValue: true,
          date,
        });
        firstEpisodes = _firstEpisodes;

        const { data: _reinfections } = await AppService.getReinfections({
          cumValue: true,
          date,
        });
        reinfections = _reinfections;
      }

      if (overviewState) {
        ageCaseDist = overviewState.ageCaseDist;

        // if (!date) {
        deaths = formatDataToMonthAgg(overviewState.deaths);
        ageCases = overviewState.ageCases;
        healthcares = overviewState.healthcares;
        firstDose = overviewState.firstDose;
        secondDose = overviewState.secondDose;
        thirdDose = overviewState.thirdDose;
        firstEpisodes = overviewState.firstEpisodes;
        reinfections = overviewState.reinfections;
        // } else {
        // deaths = filterForDate(overviewState.deaths, date);
        // const filteredCumHealthcare = filterForDate(
        //   overviewState.cumHealthcares,
        //   date
        // );
        // healthcares = formatHealthcare(filteredCumHealthcare);

        // const filteredAgeCaseDist = filterForDate(ageCaseDist, date);
        // ageCases = formatAgecases(filteredAgeCaseDist);

        // deaths = overviewState.deaths;
        // ageCases = overviewState.ageCases;
        // healthcares = overviewState.healthcares;
        // }
      } else {
        // age cases
        const { data: _ageCaseDist = [] } = await AppService.getCases({
          cumValue: false,
          ageDemo: true,
        });
        ageCaseDist = _ageCaseDist;
        ageCases = formatAgecases(ageCaseDist);

        const { data: _deaths } = await AppService.getDeaths({
          cumValue: false,
        });
        deaths = formatDataToMonthAgg(_deaths);

        // healthcare data
        const { data: _healthcares } = await AppService.getHealthcare({
          cumValue: false,
          nation: true,
          date,
        });

        healthcares = formatByRegion(_healthcares, "areaName");

        setOverviewState({
          cumHealthcares: _healthcares,
          ageCases,
          deaths: _deaths,
          healthcares,
          infections: [
            {
              label: "First infections",
              value: firstEpisodes[0]?.value,
            },
            {
              label: "Reinfections",
              value: reinfections[0]?.value,
            },
          ],
          vaccines: [
            { dose: "First", value: firstDose[0]?.value },
            { dose: "Second", value: secondDose[0]?.value },
            { dose: "Boost", value: thirdDose[0]?.value },
          ],
          ageCaseDist,
          firstDose,
          secondDose,
          thirdDose,
          firstEpisodes,
          reinfections,
        });
      }

      const overview = {
        ageCases,
        deaths,
        healthcares,
        infections: [
          {
            label: "First infections",
            value: firstEpisodes[0]?.value,
          },
          {
            label: "Reinfections",
            value: reinfections[0]?.value,
          },
        ],
        vaccines: [
          { dose: "First", value: firstDose[0]?.value },
          { dose: "Second", value: secondDose[0]?.value },
          { dose: "Boost", value: thirdDose[0]?.value },
        ],
      };
      return overview;
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getVaccineOverview = async (date = "", refetch = false) => {
    setLoading(true);
    try {
      let totalData = {},
        firstDoseData = {},
        secondDoseData = {},
        thirdDoseData = {},
        cumVaccineData = [];

      // caching conditions
      if ((!vaccineState && !overviewState && !date) || refetch) {
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(date);

        // vaccine doses
        firstDoseData = _firstDose[0];
        secondDoseData = _secondDose[0];
        thirdDoseData = _thirdDose[0];
        const { data: total } = await AppService.getVaccines({
          cumValue: true,
          date,
        });
        totalData = total[0];

        setVaccineState({
          ...vaccineState,
          overview: {
            firstDose: firstDoseData,
            secondDose: secondDoseData,
            thirdDose: thirdDoseData,
            total: totalData,
          },
        });
      } else if (vaccineState?.overview) {
        if (!date) {
          const {
            overview: { firstDose, secondDose, thirdDose, total },
          } = vaccineState;
          firstDoseData = firstDose;
          secondDoseData = secondDose;
          thirdDoseData = thirdDose;
          totalData = total;
        } else {
          if (vaccineState?.cumData) {
            const {
              cumData: { total, firstDose, secondDose, thirdDose },
            } = vaccineState;
            // accumulate collected from supplied date till now
            totalData = { value: getDataSum(filterForDate(total, date)) };
            firstDoseData = {
              value: getDataSum(filterForDate(firstDose, date)),
            };
            secondDoseData = {
              value: getDataSum(filterForDate(secondDose, date)),
            };
            thirdDoseData = {
              value: getDataSum(filterForDate(thirdDose, date)),
            };
          } else {
            const { data: vaccines } = await AppService.getVaccines({
              cumValue: false,
            });
            const { _firstDose, _secondDose, _thirdDose } = await getDosages(
              date,
              false
            );
            // accumulate collected from supplied date till now
            totalData = { value: getDataSum(filterForDate(vaccines, date)) };
            firstDoseData = {
              value: getDataSum(filterForDate(_firstDose, date)),
            };
            secondDoseData = {
              value: getDataSum(filterForDate(_secondDose, date)),
            };
            thirdDoseData = {
              value: getDataSum(filterForDate(_thirdDose, date)),
            };

            setVaccineState({
              ...vaccineState,
              cumData: {
                ...vaccineState.cumData,
                total: vaccines,
                firstDose: _firstDose,
                secondDose: _secondDose,
                thirdDose: _thirdDose,
              },
            });
          }
        }
      } else {
        if (!date) {
          if (metricsState && overviewState) {
            const { firstDose, secondDose, thirdDose } = overviewState;
            const { vaccineData } = metricsState;

            firstDoseData = firstDose[0] || {};
            secondDoseData = secondDose[0] || {};
            thirdDoseData = thirdDose[0] || {};
            totalData = vaccineData[0] || {};
            setVaccineState({
              ...vaccineState,
              overview: {
                firstDose: firstDoseData,
                secondDose: secondDoseData,
                thirdDose: thirdDoseData,
                total: totalData,
              },
            });
          } else {
          }
        } else {
        }
      }

      return {
        total: totalData?.value,
        firstDose: firstDoseData?.value,
        secondDose: secondDoseData?.value,
        thirdDose: thirdDoseData?.value,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getVaccinationCardData = async (date = "") => {
    setLoading(true);
    let vaccineDemoData = [];
    let byDate = {},
      byAges = [],
      belowTo50 = [],
      above50 = [],
      monthlyVaccines = [];
    try {
      if (
        !vaccineState?.cumData?.firstDose ||
        !vaccineState?.cumData?.vaccineDemo
      ) {
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(
          date,
          false
        );
        const { data: vaccineDemo } = await AppService.getVaccineAgeDemo({
          cumValue: false,
        });
        vaccineDemoData = vaccineDemo;

        monthlyVaccines = extractCompleteVacc(vaccineDemo);

        byDate = {
          firstDose: formatVaccineData(_firstDose),
          secondDose: formatVaccineData(_secondDose),
          thirdDose: formatVaccineData(_thirdDose),
        };
        byAges = formatVaccineDemo(vaccineDemo);
        const aggAges = formatVaccineDemo(vaccineDemo, "", true);
        belowTo50 = aggAges
          ? {
              "05_11": aggAges["05_11"],
              "12_15": aggAges["12_15"],
              "16_17": aggAges["16_17"],
              "18_24": aggAges["18_24"],
              "25_29": aggAges["25_29"],
              "30_34": aggAges["30_34"],
              "35_39": aggAges["35_39"],
              "40_44": aggAges["40_44"],
              "45_49": aggAges["45_49"],
            }
          : {};

        above50 = aggAges
          ? {
              "50_54": aggAges["50_54"],
              "55_59": aggAges["55_59"],
              "60_64": aggAges["60_64"],
              "65_69": aggAges["65_69"],
              "70_74": aggAges["70_74"],
              "75_79": aggAges["75_79"],
              "80_84": aggAges["80_84"],
              "85_89": aggAges["85_89"],
              "90+": aggAges["90+"],
            }
          : {};

        setVaccineState({
          ...vaccineState,
          cumData: {
            ...vaccineState,
            ...byDate,
            ...vaccineState?.cumData,
            vaccineDemo,
          },
        });
      } else {
        const {
          cumData: { firstDose, secondDose, thirdDose, vaccineDemo } = {},
        } = vaccineState || {};
        vaccineDemoData = vaccineDemo;
        byDate = {
          firstDose: formatVaccineData(filterForDate(firstDose, date)),
          secondDose: formatVaccineData(filterForDate(secondDose, date)),
          thirdDose: formatVaccineData(filterForDate(thirdDose, date)),
        };
        byAges = vaccineDemo ? formatVaccineDemo(vaccineDemo) : {};
        monthlyVaccines = extractCompleteVacc(vaccineDemo);
        const aggAges = formatVaccineDemo(vaccineDemo, "", true);
        belowTo50 = aggAges
          ? {
              "05_11": aggAges["05_11"],
              "12_15": aggAges["12_15"],
              "16_17": aggAges["16_17"],
              "18_24": aggAges["18_24"],
              "25_29": aggAges["25_29"],
              "30_34": aggAges["30_34"],
              "35_39": aggAges["35_39"],
              "40_44": aggAges["40_44"],
              "45_49": aggAges["45_49"],
            }
          : {};

        above50 = aggAges
          ? {
              "50_54": aggAges["50_54"],
              "55_59": aggAges["55_59"],
              "60_64": aggAges["60_64"],
              "65_69": aggAges["65_69"],
              "70_74": aggAges["70_74"],
              "75_79": aggAges["75_79"],
              "80_84": aggAges["80_84"],
              "85_89": aggAges["85_89"],
              "90+": aggAges["90+"],
            }
          : {};
      }

      return {
        byDate,
        byAges,
        belowTo50,
        above50,
        monthlyVaccines,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getCasesOverview = async (date = "", refetch = false) => {
    let total = {},
      firstEpisodes = {},
      reinfections = {},
      rate = {};
    setLoading(true);
    try {
      if ((!caseState?.overview && !caseState?.newData && !date) || refetch) {
        const { data: _totalData } = await AppService.getCases({
          cumValue: true,
        });
        total = _totalData[0].value;

        const { data: _reinfections } = await AppService.getReinfections({
          cumValue: true,
        });
        reinfections = _reinfections[0].value;

        const { data: _firstEpisodes } = await AppService.getFirstEpisodes({
          cumValue: true,
        });
        firstEpisodes = _firstEpisodes[0].value;

        const { data: caseRate } = await AppService.getCases({
          cumValue: true,
          rate: true,
        });
        rate = caseRate[0]?.value;

        setCaseState({
          ...caseState,
          overview: {
            ...caseState?.overview,
            total,
            reinfections,
            firstEpisodes,
            rate,
          },
        });
      } else if (caseState?.overview) {
        if (!date) {
          total = caseState?.overview?.total;
          reinfections = caseState?.overview?.reinfections;
          firstEpisodes = caseState?.overview?.firstEpisodes;
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        } else {
          const { caseDist, reinfectionsDist, firstEpisodesDist } =
            caseState.newData;

          total = getDataSum(filterForDate(caseDist, date));
          reinfections = getDataSum(filterForDate(reinfectionsDist, date));
          firstEpisodes = getDataSum(filterForDate(firstEpisodesDist, date));
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        }
      } else {
        const { data: caseDist = [] } = await AppService.getCases({
          cumValue: false,
          newCases: true,
        });

        const { data: reinfectionsDist } = await AppService.getReinfections({
          cumValue: false,
          newCases: true,
        });

        const { data: firstEpisodesDist } = await AppService.getFirstEpisodes({
          cumValue: false,
          newCases: true,
        });

        total = getDataSum(filterForDate(caseDist, date));
        reinfections = getDataSum(filterForDate(reinfectionsDist, date));
        firstEpisodes = getDataSum(filterForDate(firstEpisodesDist, date));

        if (caseState?.overview?.rate) {
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        } else {
          const { data: caseRate } = await AppService.getCases({
            cumValue: true,
            rate: true,
          });
          rate = caseRate[0]?.value;
        }

        setCaseState({
          ...caseState,
          newData: {
            ...caseState.newData,
            caseDist,
            reinfectionsDist,
            firstEpisodesDist,
            rate,
          },
        });
      }

      return { total, reinfections, firstEpisodes, rate };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getCasesChartData = async (date = "") => {
    setLoading(true);
    let caseTypes = {},
      byAge = [],
      byRegion = [],
      monthlyCases = [];
    try {
      if (caseState?.cumData) {
        const {
          cumFirstEpisodesDist,
          cumReinfectionsDist,
          cumAgeDist,
          cumAge,
        } = caseState.cumData || {};

        caseTypes = {
          "First Episode": formatDataToMonthAgg(cumFirstEpisodesDist),
          Reinfections: formatDataToMonthAgg(cumReinfectionsDist),
        };
        byAge = formatAgecases(cumAgeDist);
        byRegion = formatByRegion(cumAge);
        monthlyCases = formatDataToMonthAgg(cumAge, false);
      } else {
        const { data: cumReinfectionsDist } = await AppService.getReinfections({
          cumValue: false,
        });

        const { data: cumFirstEpisodesDist } =
          await AppService.getFirstEpisodes({
            cumValue: false,
          });

        const { data: cumAgeDist = [] } = await AppService.getCases({
          cumValue: false,
          ageDemo: true,
        });

        const { data: cumAge = [] } = await AppService.getCases({
          cumValue: false,
          nation: true,
          newCases: true,
        });

        caseTypes = {
          "First Episode": formatDataToMonthAgg(cumFirstEpisodesDist),
          Reinfections: formatDataToMonthAgg(cumReinfectionsDist),
        };
        byAge = formatAgecases(cumAgeDist);
        byRegion = formatByRegion(cumAge);
        monthlyCases = formatDataToMonthAgg(cumAge, false);

        setCaseState({
          ...caseState,
          cumData: {
            ...caseState?.cumData,
            cumFirstEpisodesDist,
            cumReinfectionsDist,
            cumAgeDist,
            cumAge,
          },
        });
      }

      return {
        caseTypes,
        byAge,
        byRegion,
        monthlyCases,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getDeathsOverview = async (date = "", refetch = false) => {
    setLoading(true);
    let total = {},
      within60 = {},
      within28 = {},
      rate = {};
    try {
      if ((!deathState?.overview && !deathState?.newData && !date) || refetch) {
        const { data: deaths } = await AppService.getDeaths({
          cumValue: true,
        });
        total = deaths[0]?.value;

        const { data: cum28 } = await AppService.getDeaths({
          cumValue: true,
          within28: true,
        });
        within28 = cum28[0]?.value;

        const { data: cum60 } = await AppService.getDeaths({
          cumValue: true,
          within60: true,
        });
        within60 = cum60[0]?.value;

        const { data: deathRate } = await AppService.getDeaths({
          cumValue: true,
          rate: true,
        });
        rate = deathRate[0]?.value;

        setDeathState({
          ...deathState,
          overview: {
            ...deathState?.overview,
            total,
            within28,
            within60,
            rate,
          },
        });
      } else if (deathState?.overview) {
        if (!date) {
          total = deathState?.overview?.total;
          within28 = deathState?.overview?.within28;
          within60 = deathState?.overview?.within60;
          rate = deathState?.overview?.rate;
        } else {
          const { deathsDist, within28Dist, within60Dist } = deathState.newData;

          total = getDataSum(filterForDate(deathsDist, date));
          within28 = getDataSum(filterForDate(within28Dist, date));
          within60 = getDataSum(filterForDate(within60Dist, date));
          rate = deathState?.overview?.rate;
        }
      } else {
        const { data: deathsDist } = await AppService.getDeaths({
          cumValue: false,
          newDeaths: true,
        });

        const { data: within28Dist } = await AppService.getDeaths({
          cumValue: false,
          within28: true,
        });

        const { data: within60Dist } = await AppService.getDeaths({
          cumValue: false,
          within28: true,
        });

        total = getDataSum(filterForDate(deathsDist, date));
        within28 = getDataSum(filterForDate(within28Dist, date));
        within60 = getDataSum(filterForDate(within60Dist, date));
        if (deathState?.overview?.rate) {
          rate = deathState?.overview?.rate;
        } else {
          const { data: deathRate } = await AppService.getDeaths({
            cumValue: true,
            rate: true,
          });
          rate = deathRate[0]?.value;
        }

        setDeathState({
          ...deathState,
          newData: {
            ...deathState.newData,
            deathsDist,
            within28Dist,
            within60Dist,
          },
        });
      }

      return {
        total,
        within28,
        within60,
        rate,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getDeathsChartData = async (date = "", refetch = false) => {
    setLoading(true);
    let deaths = [],
      byAge = [],
      within28 = [],
      within28Demo = [],
      within60 = [],
      within60Demo = [];
    try {
      if (deathState?.cumData) {
        const {
          deathsDist,
          within28DemoDist,
          within28Dist,
          within60Dist,
          within60DemoDist,
        } = deathState?.cumData;

        deaths = formatDataToMonthAgg(deathsDist, false);
        within28Demo = formatByAge(within28DemoDist, "deaths");
        within28 = formatDataToMonthAgg(within28Dist, false);
        within60Demo = formatByAge(within60DemoDist, "deaths");
        within60 = formatDataToMonthAgg(within60Dist, false);
      } else {
        const { data: deathsDist } = await AppService.getDeaths({
          cumValue: false,
          newDeaths: true,
        });

        const { data: within28Dist } = await AppService.getDeaths({
          cumValue: false,
          within28: true,
        });

        const { data: within60Dist } = await AppService.getDeaths({
          cumValue: false,
          within60: true,
        });

        const { data: within28DemoDist } = await AppService.getDeaths({
          cumValue: false,
          demo: true,
          within28: true,
        });
        const { data: within60DemoDist } = [];

        deaths = formatDataToMonthAgg(deathsDist, false);
        within28Demo = formatByAge(within28DemoDist, "deaths");
        within28 = formatDataToMonthAgg(within28Dist, false);
        within60Demo = formatByAge(within60DemoDist, "deaths");
        within60 = formatDataToMonthAgg(within60Dist, false);

        setDeathState({
          ...deathState,
          cumData: {
            ...deathState?.cumData,
            deathsDist,
            within28DemoDist,
            within28Dist,
            within60Dist,
            within60DemoDist,
          },
        });
      }

      return {
        byAge,
        deaths,
        within28,
        within28Demo,
        within60,
        within60Demo,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getHealthcareOverview = async (date = "", refetch = false) => {
    setLoading(true);
    let total = {},
      ventilationBeds = {},
      inHospital = {},
      rate = {};
    try {
      if (
        (!healthcareState?.overview && !healthcareState?.newData && !date) ||
        refetch
      ) {
        const { data: healthcare } = await AppService.getHealthcare({
          cumValue: true,
        });
        total = healthcare[0]?.value;

        const { data: ventilation } = await AppService.getHealthcare({
          cumValue: true,
          ventilation: true,
        });
        ventilationBeds = ventilation[0]?.value;

        const { data: healthcareRate } = await AppService.getHealthcare({
          cumValue: true,
          rate: true,
        });
        rate = healthcareRate[0]?.value;

        const { data: hospital } = await AppService.getHealthcare({
          cumValue: true,
          hospital: true,
        });
        inHospital = hospital[0]?.value;

        setHealthcareState({
          ...healthcareState,
          overview: {
            ...healthcareState?.overview,
            total,
            ventilationBeds,
            inHospital,
            rate,
          },
        });
      } else if (deathState?.overview) {
        if (!date) {
          total = healthcareState?.overview?.total;
          ventilationBeds = healthcareState?.overview?.ventilationBeds;
          inHospital = healthcareState?.overview?.inHospital;
          rate = healthcareState?.overview?.rate;
        } else {
          const { healthcareDist } = healthcareState.newData || {};

          total = getDataSum(filterForDate(healthcareDist, date));
          ventilationBeds = healthcareState?.overview?.ventilationBeds;
          inHospital = healthcareState?.overview?.inHospital;
          rate = healthcareState?.overview?.rate;
        }
      } else {
        const { data: healthcareDist } = await AppService.getHealthcare({
          cumValue: false,
          newAdm: true,
        });
        const { data: ventilationDist } = await AppService.getHealthcare({
          cumValue: false,
          ventilation: true,
          newAdm: true,
        });
        const { data: hospitalDist } = await AppService.getHealthcare({
          cumValue: false,
          hospital: true,
          newAdm: true,
        });

        const { data: ageDist } = await AppService.getHealthcare({
          cumValue: false,
          age: true,
        });

        total = getDataSum(filterForDate(healthcareDist, date));
        ventilationBeds = getDataSum(filterForDate(ventilationDist, date));
        inHospital = healthcareState?.overview?.inHospital;
        rate = healthcareState?.overview?.rate;

        setHealthcareState({
          ...healthcareState,
          newData: {
            ...healthcareState.newData,
            healthcareDist,
            ventilationDist,
            hospitalDist,
            ageDist,
          },
        });
      }

      return {
        total,
        ventilationBeds,
        inHospital,
        rate,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  const getHealthcareChartData = async () => {
    setLoading(true);
    let allAds = [],
      ventilationBed = [],
      inHospital = [],
      byAge = [];
    try {
      if (healthcareState?.cumData || healthcareState?.newData) {
        const { healthcareDist, ventilationDist, hospitalDist, ageDist } =
          healthcareState.cumData || healthcareState.newData;
        allAds = formatDataToMonthAgg(healthcareDist, false);
        ventilationBed = formatDataToMonthAgg(ventilationDist, false);
        inHospital = formatDataToMonthAgg(hospitalDist, false);
        byAge = formatByAge(ageDist, "value", true);
      } else {
        const { data: healthcareDist } = await AppService.getHealthcare({
          cumValue: false,
          newAdm: true,
        });
        const { data: ventilationDist } = await AppService.getHealthcare({
          cumValue: false,
          ventilation: true,
          newAdm: true,
        });
        const { data: hospitalDist } = await AppService.getHealthcare({
          cumValue: false,
          hospital: true,
          newAdm: true,
        });
        const { data: ageDist } = await AppService.getHealthcare({
          cumValue: false,
          age: true,
        });

        allAds = formatDataToMonthAgg(healthcareDist, false);
        ventilationBed = formatDataToMonthAgg(ventilationDist, false);
        inHospital = formatDataToMonthAgg(hospitalDist, false);
        byAge = formatByAge(ageDist, "value", true);

        setHealthcareState({
          ...healthcareState,
          ...healthcareState?.cumData,
          cumData: {
            healthcareDist,
            ventilationDist,
            hospitalDist,
            ageDist,
          },
        });
      }

      return {
        ventilationBed,
        inHospital,
        allAds,
        byAge,
      };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  return {
    getOverviewCardData,
    getOverviewChartsData,
    getVaccineOverview,
    getVaccinationCardData,
    getCasesOverview,
    getCasesChartData,
    getDeathsOverview,
    getDeathsChartData,
    getHealthcareOverview,
    getHealthcareChartData,
  };
};

export default useApiRequest;
