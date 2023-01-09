import { useContext } from "react";
import { appContext } from "../contexts";
import AppService from "../services/appService";
import {
  filterForDate,
  formatDeaths,
  formatAgecases,
  formatHealthcare,
  formatVaccineData,
  formatVaccineDemo,
  extractCompleteVacc,
  getDataSum,
} from "../utils";

const useApiRequest = () => {
  const {
    lastUpdate,
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
  } = useContext(appContext);

  const getOverview = async () => {
    try {
      const data = await AppService.getOverview();
      return data;
    } catch (error) {}
  };

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

        // console.log("Testing overview cards", {
        //   ageCaseDist,
        //   healthcareDist,
        //   deathDist,
        //   deathData,
        //   vaccineData,
        //   caseData,
        //   healthcareData,
        //   vaccineDist,
        // });

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
      console.log({ error });
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
        deaths = formatDeaths(overviewState.deaths);
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
        console.log("Will refetch");
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
        deaths = formatDeaths(_deaths);

        // healthcare data
        const { data: _healthcares } = await AppService.getHealthcare({
          cumValue: false,
          date,
        });

        healthcares = formatHealthcare(_healthcares);

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
      console.log({ error });
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
      console.log({ error });
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

      // console.log("data cached 2: ", {
      //   date,
      //   byDate,
      //   belowTo50,
      //   above50,
      //   vaccineDemoData,
      //   byAges,
      //   monthlyVaccines,
      // });

      return {
        byDate,
        byAges,
        belowTo50,
        above50,
        monthlyVaccines,
      };
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  };

  return {
    getOverview,
    getOverviewCardData,
    getOverviewChartsData,
    getVaccineOverview,
    getVaccinationCardData,
  };
};

export default useApiRequest;
