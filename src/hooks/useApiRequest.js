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

/*************************************************************************************************************
 * This hook returns necessary functions carrying out API calls and data manipulation required to display
 * metric cards and chart information across all pages
 ************************************************************************************************************/

const useApiRequest = () => {
  // the application state store in the app cntext
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
    areaName,
    setAreaName,
  } = useContext(appContext);

  // update the data time call upon using any of the functions in the hook, this is used to display the last updated time
  setLastUpdate(new Date().toString().slice(0, 25));

  //fetches and return all vaccination dosages data based on supplied time and data mode
  // cumValue truthy value means to return only the lastest value at the provided date, while falsy value
  // returns all entries for each of the dosage types over time
  const getDosages = async (date, cumValue = true) => {
    // fetch first dose data
    const { data: _firstDose } = await AppService.getVaccines({
      areaName,
      cumValue,
      dosage: true,
      dosageIdx: "first",
      date,
    });

    //fetch the second does data
    const { data: _secondDose } = await AppService.getVaccines({
      areaName,
      cumValue,
      dosage: true,
      dosageIdx: "second",
      date,
    });

    // fetch the third injection boost data
    const { data: _thirdDose } = await AppService.getVaccines({
      areaName,
      cumValue,
      dosage: true,
      dosageIdx: "third",
      date,
    });

    // return the data of each of the dosage type
    return {
      _firstDose,
      _secondDose,
      _thirdDose,
    };
  };

  // extract and returns data for all cards rendered on overview page
  const getOverviewCardData = async (date = "", refetch = false) => {
    let caseData = [],
      deathData = [],
      healthcareData = [],
      vaccineData = [];

    setLoading(true);
    try {
      // check if data should be refetched or the overview metrics data state is empty
      if ((!metricsState && !date) || refetch) {
        // fetch and extract total number of cases
        const { data: _caseData } = await AppService.getCases({
          areaName,
          cumValue: true,
          date,
        });
        caseData = _caseData[0];

        // fetch and extract total number of deaths
        const { data: _deathData } = await AppService.getDeaths({
          areaName,
          cumValue: true,
          date,
        });
        deathData = _deathData[0];

        // fetch and extract the total nunmbr of patients admitted
        const { data: _healthcareData } = await AppService.getHealthcare({
          cumValue: true,
          date,
        });
        healthcareData = _healthcareData[0];

        // fetch and extract the total number of vaccinations given
        const { data: _vaccineData } = await AppService.getVaccines({
          areaName,
          cumValue: true,
          date,
        });
        vaccineData = _vaccineData[0];

        // save the extracted data in the overview metrics state
        setMetricsState({
          caseData,
          deathData,
          healthcareData,
          vaccineData,
        });
      } else if (metricsState?.cumData) {
        // This block takes care of when the overview metrics data cache contains the overview data set in the previous block

        if (!date) {
          // fetch and set data from the cache if there's no date filter selection
          caseData = metricsState.caseData;
          deathData = metricsState.deathData;
          healthcareData = metricsState.healthcareData;
          vaccineData = metricsState.vaccineData;
        } else {
          // This runs if filter date has been selected

          const { ageCaseDist, healthcareDist, deathDist, vaccineDist } =
            metricsState.cumData;

          // extract and format the overview data distribution to derive result on selected option
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
        // This runs if there is no saved data for date range accumulation and date has been selected

        // fetch and extract the cases by age distribution over the selected date range
        const { data: ageCaseDist = [] } = await AppService.getCases({
          areaName,
          cumValue: false,
          newCases: true,
        });
        caseData = {
          value: getDataSum(filterForDate(ageCaseDist, date)),
        };

        // fetch and extract the admissions distribution over the selected date range
        const { data: healthcareDist } = await AppService.getHealthcare({
          cumValue: false,
          newAdm: true,
        });
        healthcareData = {
          value: getDataSum(filterForDate(healthcareDist, date)),
        };

        // fetch and extract all vaccine distrinution over time over the selected date range
        const { data: vaccineDist } = await AppService.getVaccines({
          areaName,
          cumValue: false,
        });
        vaccineData = {
          value: getDataSum(filterForDate(vaccineDist, date)),
        };

        // fetch and extract the deaths over the selected date range
        const { data: deathDist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          newDeaths: true,
        });
        deathData = {
          value: getDataSum(filterForDate(deathDist, date)),
        };

        // save the fetched data in the overview metrics state
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

      // return the extracted data for the overview cards
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

  // extract, format and returns all the data to be used to render charts on the overview page
  const getOverviewChartsData = async (date = "", refetch = true) => {
    setLoading(true);
    try {
      // initialize the return and cache state variables
      let ageCases = {},
        deaths = [],
        healthcares = [],
        ageCaseDist = [],
        firstDose = [],
        secondDose = [],
        thirdDose = [],
        firstEpisodes = [],
        reinfections = [];

      // if there is no cached data for the charts
      if (!overviewState || refetch) {
        // fetch the distribution of dosages data
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(date);

        // set the dosages values
        firstDose = _firstDose;
        secondDose = _secondDose;
        thirdDose = _thirdDose;

        // fetch and set the first episode distrubution data
        const { data: _firstEpisodes } = await AppService.getFirstEpisodes({
          areaName,
          cumValue: true,
          date,
        });
        firstEpisodes = _firstEpisodes;

        // fetch and set the reinfections distrubution data
        const { data: _reinfections } = await AppService.getReinfections({
          areaName,
          cumValue: true,
          date,
        });
        reinfections = _reinfections;
      }

      // if all api data used in rendering all the overview charts have been fetched and cached locally,
      if (overviewState && !refetch) {
        //extract all the required data from the cache and the formatted data for the return values
        ageCaseDist = overviewState.ageCaseDist;
        deaths = formatDataToMonthAgg(overviewState.deaths);
        ageCases = overviewState.ageCases;
        healthcares = overviewState.healthcares;
        firstDose = overviewState.firstDose;
        secondDose = overviewState.secondDose;
        thirdDose = overviewState.thirdDose;
        firstEpisodes = overviewState.firstEpisodes;
        reinfections = overviewState.reinfections;
      } else {
        // api data isn't cached and needs to be fetched

        //fetch, extract and format age cases distribution data
        const { data: _ageCaseDist = [] } = await AppService.getCases({
          areaName,
          cumValue: false,
          ageDemo: true,
        });
        ageCaseDist = _ageCaseDist;
        ageCases = formatAgecases(ageCaseDist);

        // fetch, extract and set deaths distribution data
        const { data: _deaths } = await AppService.getDeaths({
          areaName,
          cumValue: false,
        });
        deaths = formatDataToMonthAgg(_deaths);

        //fetch, extract and set healthcare distribution data
        const { data: _healthcares } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          nation: true,
          date,
        });
        healthcares = formatByRegion(_healthcares, "areaName");

        // set the fetched data in the overview state
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

      // structure the return value
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
      // return the overview charts data
      return overview;
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  // extract, format, and return vaccine cards data
  const getVaccineOverview = async (date = "", refetch = false) => {
    setLoading(true);
    try {
      // initialize the return value variables
      let totalData = {},
        firstDoseData = {},
        secondDoseData = {},
        thirdDoseData = {},
        cumVaccineData = [];

      // check if vaccine overview data should be refetched or the vaccine data state is empty
      if ((!vaccineState && !overviewState && !date) || refetch) {
        // fetch all doses accumulated data
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(date);

        // extract and set the dosages numbers form the returned data
        firstDoseData = _firstDose[0];
        secondDoseData = _secondDose[0];
        thirdDoseData = _thirdDose[0];

        //fetch and extract total vaccinations number
        const { data: total } = await AppService.getVaccines({
          areaName,
          cumValue: true,
          date,
        });
        totalData = total[0];

        // save the vaccine fetched data in the vaccine state
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
        // This block handles when the vaccine data cache contains the card data set in the previous block the last time
        // this function was invoked

        if (!date) {
          // extract and set total vaccine data from the cache if there's no date filter selection
          const {
            overview: { firstDose, secondDose, thirdDose, total },
          } = vaccineState;
          firstDoseData = firstDose;
          secondDoseData = secondDose;
          thirdDoseData = thirdDose;
          totalData = total;
        } else {
          // if a filter date range has been selected

          if (vaccineState?.cumData) {
            // This block caters for when date filter is chosen

            //extract, format and set all total vaccine related data in the cache based on the filter date
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
            // if there's no vaccine distribution stored in the vaccine state and date filter is selected

            // fetch and extract the total vaccine data based on the date range
            const { data: vaccines } = await AppService.getVaccines({
              areaName,
              cumValue: false,
            });
            totalData = { value: getDataSum(filterForDate(vaccines, date)) };

            // fetch all doses distribution data
            const { _firstDose, _secondDose, _thirdDose } = await getDosages(
              date,
              false
            );
            // accumulate collected from supplied date till now and save in return variables
            firstDoseData = {
              value: getDataSum(filterForDate(_firstDose, date)),
            };
            secondDoseData = {
              value: getDataSum(filterForDate(_secondDose, date)),
            };
            thirdDoseData = {
              value: getDataSum(filterForDate(_thirdDose, date)),
            };

            // save the fetched vaccine data in the vaccine state
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
        // a backup cache incase the vaccine data is already cached in the matrics and overview state of the overview page
        if (!date) {
          // if no date selected and there's value in both states
          if (metricsState && overviewState) {
            // extract the cached vaccine data from the states
            const { firstDose, secondDose, thirdDose } = overviewState;
            const { vaccineData } = metricsState;

            // extract and set the vaccine data numbers in the return value variables
            firstDoseData = firstDose[0] || {};
            secondDoseData = secondDose[0] || {};
            thirdDoseData = thirdDose[0] || {};
            totalData = vaccineData[0] || {};

            // update the vaccine state with this data extracted from the metrics and overview state
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

      // return the numbers to be displayed on the vaccine page cards
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

  // extract, formats and returns all the formatted data to render charts on vaccination page
  const getVaccinationChartData = async (date = "", refetch = false) => {
    setLoading(true);

    // initialize the return value vartiables
    let vaccineDemoData = [];
    let byDate = {},
      byAges = [],
      belowTo50 = [],
      above50 = [],
      monthlyVaccines = [];
    try {
      // if all api data used in rendering all the vaccination charts have not been cached locally,
      if (
        !vaccineState?.cumData?.firstDose ||
        !vaccineState?.cumData?.vaccineDemo
      ) {
        // fetch and set the dosages demographic distribution data
        const { _firstDose, _secondDose, _thirdDose } = await getDosages(
          date,
          false
        );

        // fetch, format and set the dosages distribution data
        const { data: vaccineDemo } = await AppService.getVaccineAgeDemo({
          cumValue: false,
          areaName,
        });
        vaccineDemoData = vaccineDemo;
        monthlyVaccines = extractCompleteVacc(vaccineDemo);

        // format all charts data
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

        // save the fetched data in the cache
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
        /**
         * retrieve, format and set extracted data from the vaccine cache
         */
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

      // return the vaccine charts data
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

  // returns data for all cards rendered on deaths page
  const getCasesOverview = async (date = "", refetch = false) => {
    let total = {},
      firstEpisodes = {},
      reinfections = {},
      rate = {};

    // set loading state to show spinner on page
    setLoading(true);

    try {
      // check if data should be refetched or the deaths data state is empty
      if ((!caseState?.overview && !caseState?.newData && !date) || refetch) {
        // fetch and extract the total number of cases
        const { data: _totalData } = await AppService.getCases({
          areaName,
          cumValue: true,
        });
        total = _totalData[0].value;

        // fetch and extract the total number of reinfection cases
        const { data: _reinfections } = await AppService.getReinfections({
          cumValue: true,
          areaName,
        });
        reinfections = _reinfections[0].value;

        // fetch and extract the total number of first episode cases
        const { data: _firstEpisodes } = await AppService.getFirstEpisodes({
          cumValue: true,
          areaName,
        });
        firstEpisodes = _firstEpisodes[0].value;

        // fetch and extract the current case rate
        const { data: caseRate } = await AppService.getCases({
          areaName,
          cumValue: true,
          rate: true,
        });
        rate = caseRate[0]?.value;

        // save the extracted values in the case state
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
        // This block handles when the case data cache contains the overview data set in the previous block the last time
        // this function was invoked

        if (!date) {
          // extract and set data from the cache if there's no date filter selection
          total = caseState?.overview?.total;
          reinfections = caseState?.overview?.reinfections;
          firstEpisodes = caseState?.overview?.firstEpisodes;
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        } else {
          // if a filter date has been selected

          // fetch data from the cache and format the date range data
          const { caseDist, reinfectionsDist, firstEpisodesDist } =
            caseState.newData;

          total = getDataSum(filterForDate(caseDist, date));
          reinfections = getDataSum(filterForDate(reinfectionsDist, date));
          firstEpisodes = getDataSum(filterForDate(firstEpisodesDist, date));
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        }
      } else {
        // This block caters for when date filter is chosen but no filtration data in cache

        // fetch all case distribution over time.
        const { data: caseDist = [] } = await AppService.getCases({
          areaName,
          cumValue: false,
          newCases: true,
        });

        // fetch all reinfection distribution over time.
        const { data: reinfectionsDist } = await AppService.getReinfections({
          cumValue: false,
          newCases: true,
        });

        // fetch all first episodes distribution over time.
        const { data: firstEpisodesDist } = await AppService.getFirstEpisodes({
          cumValue: false,
          newCases: true,
          areaName,
        });

        // filter the fetched data distribution to get the accumulatiom of the collected data over the date range selected
        total = getDataSum(filterForDate(caseDist, date));
        reinfections = getDataSum(filterForDate(reinfectionsDist, date));
        firstEpisodes = getDataSum(filterForDate(firstEpisodesDist, date));

        // extract the new case rate through the cache or fetch
        if (caseState?.overview?.rate) {
          rate = caseState?.overview?.rate || caseState?.newData?.rate;
        } else {
          const { data: caseRate } = await AppService.getCases({
            areaName,
            cumValue: true,
            rate: true,
          });
          rate = caseRate[0]?.value;
        }

        // save the fetched case data in the cache
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

      // return the extracted and formatted cards data
      return { total, reinfections, firstEpisodes, rate };
    } catch (error) {
      console.log(error.stack);
    } finally {
      setLoading(false);
    }
  };

  // returns data for all charts rendered on cases page
  const getCasesChartData = async (date = "", refetch = false) => {
    setLoading(true);
    let caseTypes = {},
      byAge = [],
      byRegion = [],
      monthlyCases = [];
    try {
      // if all api data used in rendering all the case charts have been fecthed and cached locally,
      if (caseState?.cumData && !refetch) {
        // extracts the cached data from the case state
        const {
          cumFirstEpisodesDist,
          cumReinfectionsDist,
          cumAgeDist,
          cumAge,
        } = caseState.cumData || {};

        // format the  first infections and reinfecitons data into monthly series
        caseTypes = {
          "First Episode": formatDataToMonthAgg(cumFirstEpisodesDist),
          Reinfections: formatDataToMonthAgg(cumReinfectionsDist),
        };
        // format for cases by age, cases by region and cumulative monthly cases
        byAge = formatAgecases(cumAgeDist);
        byRegion = formatByRegion(cumAge);
        monthlyCases = formatDataToMonthAgg(cumAge, false);
      } else {
        // this block handles first time api call and then sets the fetched data in the context store

        // fetch the renfections data
        const { data: cumReinfectionsDist } = await AppService.getReinfections({
          cumValue: false,
          areaName,
        });

        // fetch first episodes data
        const { data: cumFirstEpisodesDist } =
          await AppService.getFirstEpisodes({
            cumValue: false,
            areaName,
          });

        // fetch all data set for age demography since the start of covid
        const { data: cumAgeDist = [] } = await AppService.getCases({
          areaName,
          cumValue: false,
          ageDemo: true,
        });

        // all data sets of covid new cases
        const { data: cumAge = [] } = await AppService.getCases({
          areaName,
          cumValue: false,
          nation: true,
          newCases: true,
        });

        //format the fetched data to being usuable on the Cases page
        caseTypes = {
          "First Episode": formatDataToMonthAgg(cumFirstEpisodesDist),
          Reinfections: formatDataToMonthAgg(cumReinfectionsDist),
        };
        byAge = formatAgecases(cumAgeDist);
        byRegion = formatByRegion(cumAge);
        monthlyCases = formatDataToMonthAgg(cumAge, false);

        // set the fetched data in the context store
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
      // return the chart data
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

  // returns data for all cards rendered on deaths page
  const getDeathsOverview = async (date = "", refetch = false) => {
    setLoading(true);
    let total = {},
      within60 = {},
      within28 = {},
      rate = {};
    try {
      // check if data should be refetched or the deaths data state is empty
      if ((!deathState?.overview && !deathState?.newData && !date) || refetch) {
        // fetch and extract the total number of deaths
        const { data: deaths } = await AppService.getDeaths({
          areaName,
          cumValue: true,
        });
        total = deaths[0]?.value;

        // fetch and extract the number of deaths after 28 days of testing positive
        const { data: cum28 } = await AppService.getDeaths({
          areaName,
          cumValue: true,
          within28: true,
        });
        within28 = cum28[0]?.value;

        // fetch and extract the number of deaths after 60 days of testing positive
        const { data: cum60 } = await AppService.getDeaths({
          areaName,
          cumValue: true,
          within60: true,
        });
        within60 = cum60[0]?.value;

        // fetcha and extract the most recent death rate
        const { data: deathRate } = await AppService.getDeaths({
          areaName,
          cumValue: true,
          rate: true,
        });
        rate = deathRate[0]?.value;

        // save fetched values in state
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
        // This block takes care of when the deaths data cache contains the overview data set in the previous block

        // fetch and set data from the cache if there's no date filter selection
        if (!date) {
          total = deathState?.overview?.total;
          within28 = deathState?.overview?.within28;
          within60 = deathState?.overview?.within60;
          rate = deathState?.overview?.rate;
        } else {
          // if a filter date has been selected

          // fetch data from the cache and format the date range data
          const { deathsDist, within28Dist, within60Dist } = deathState.newData;

          total = getDataSum(filterForDate(deathsDist, date));
          within28 = getDataSum(filterForDate(within28Dist, date));
          within60 = getDataSum(filterForDate(within60Dist, date));
          rate = deathState?.overview?.rate;
        }
      } else {
        // This block caters for when date filter is chosen but no filtration data in cache

        // fetch new death reports the start of covid
        const { data: deathsDist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          newDeaths: true,
        });

        // fetch death within 28 days of testing positive data distribution
        const { data: within28Dist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          within28: true,
        });

        // fetch death within 60 days of testing positive data distribution
        const { data: within60Dist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          within28: true,
        });

        // cumulate the values over the date filter range for the various datapoints
        total = getDataSum(filterForDate(deathsDist, date));
        within28 = getDataSum(filterForDate(within28Dist, date));
        within60 = getDataSum(filterForDate(within60Dist, date));
        if (deathState?.overview?.rate) {
          rate = deathState?.overview?.rate;
        } else {
          const { data: deathRate } = await AppService.getDeaths({
            areaName,
            cumValue: true,
            rate: true,
          });
          rate = deathRate[0]?.value;
        }

        // save the fetched data in the store
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

      //return the cards data
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

  //returns data for all charts rendered on deaths page
  const getDeathsChartData = async (date = "", refetch = false) => {
    setLoading(true);
    let deaths = [],
      byAge = [],
      within28 = [],
      within28Demo = [],
      within60 = [],
      within60Demo = [];
    try {
      // if all api data used in rendering all the deaths charts have been fetched and cached locally,
      if (deathState?.cumData && !refetch) {
        // extracts the cached data from the deaths state
        const {
          deathsDist,
          within28DemoDist,
          within28Dist,
          within60Dist,
          within60DemoDist,
        } = deathState?.cumData;

        // format all the extracted data to how its consumed on the charts page
        deaths = formatDataToMonthAgg(deathsDist, false);
        within28Demo = formatByAge(within28DemoDist, "deaths");
        within28 = formatDataToMonthAgg(within28Dist, false);
        within60Demo = formatByAge(within60DemoDist, "deaths");
        within60 = formatDataToMonthAgg(within60Dist, false);
      } else {
        // this block handles first time api call and then sets the fetched data in the context store

        // gets the distribution of deaths over the covid period
        const { data: deathsDist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          newDeaths: true,
        });

        // gets the distribution of deaths of people who died 28 days after testing positive over the covid period
        const { data: within28Dist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          within28: true,
        });

        // gets the distribution of deaths of people who died 60 days after testing positive over the covid period
        const { data: within60Dist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          within60: true,
        });

        // the age demography of people who have died within the 28 days of contracting the virus
        const { data: within28DemoDist } = await AppService.getDeaths({
          areaName,
          cumValue: false,
          demo: true,
          within28: true,
        });
        const { data: within60DemoDist } = [];

        // format the data as will be used on the charts page
        deaths = formatDataToMonthAgg(deathsDist, false);
        within28Demo = formatByAge(within28DemoDist, "deaths");
        within28 = formatDataToMonthAgg(within28Dist, false);
        within60Demo = formatByAge(within60DemoDist, "deaths");
        within60 = formatDataToMonthAgg(within60Dist, false);

        // save the fetched data in the deaths store
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

      //return the charts data
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

  //extracts, formats and returns data for all cards rendered on healthcare page
  const getHealthcareOverview = async (date = "", refetch = false) => {
    setLoading(true);
    let total = {},
      ventilationBeds = {},
      inHospital = {},
      rate = {};
    try {
      // check if data should be refetched or the healthcare data state is empty
      if (
        (!healthcareState?.overview && !healthcareState?.newData && !date) ||
        refetch
      ) {
        // fetch and extract the total number of admissions
        const { data: healthcare } = await AppService.getHealthcare({
          areaName,
          cumValue: true,
        });
        total = healthcare[0]?.value;

        // fetch and extract the total number of admissions on ventilation beds
        const { data: ventilation } = await AppService.getHealthcare({
          areaName,
          cumValue: true,
          ventilation: true,
        });
        ventilationBeds = ventilation[0]?.value;

        // fetch and extract the current admisison rate
        const { data: healthcareRate } = await AppService.getHealthcare({
          areaName,
          cumValue: true,
          rate: true,
        });
        rate = healthcareRate[0]?.value;

        // fetch and extract all COVID-19 patients currently in hospital
        const { data: hospital } = await AppService.getHealthcare({
          areaName,
          cumValue: true,
          hospital: true,
        });
        inHospital = hospital[0]?.value;

        // save the fetched accumulation details in the healthcare store
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
        // This block takes care of when the healthcare data cache contains the overview data set in the previous block

        // fetch and set data from the cache if there's no date filter selection
        if (!date) {
          total = healthcareState?.overview?.total;
          ventilationBeds = healthcareState?.overview?.ventilationBeds;
          inHospital = healthcareState?.overview?.inHospital;
          rate = healthcareState?.overview?.rate;
        } else {
          // if a filter date has been selected

          // fetch data from the cache and format the date range data
          const { healthcareDist } = healthcareState.newData || {};
          total = getDataSum(filterForDate(healthcareDist, date));
          ventilationBeds = healthcareState?.overview?.ventilationBeds;
          inHospital = healthcareState?.overview?.inHospital;
          rate = healthcareState?.overview?.rate;
        }
      } else {
        // fetch all new admissions entries over the period.
        const { data: healthcareDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          newAdm: true,
        });

        // fetch all new ventilation admissions entries over the period.
        const { data: ventilationDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          ventilation: true,
          newAdm: true,
        });

        // fetch the hospital intake record
        const { data: hospitalDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          hospital: true,
          newAdm: true,
        });

        // fetch the age demography data over the years
        const { data: ageDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          age: true,
        });

        // filter the fetched data distribution to get the collected data over the date range selected
        total = getDataSum(filterForDate(healthcareDist, date));
        ventilationBeds = getDataSum(filterForDate(ventilationDist, date));
        inHospital = healthcareState?.overview?.inHospital;
        rate = healthcareState?.overview?.rate;

        // save the fetched data into the healthcare state
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

      // return the formatted card data
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

  // extract, formats and returns all the formatted data to render charts on healthcare page
  const getHealthcareChartData = async (date = "", refetch = false) => {
    setLoading(true);
    // initialize the return value variables
    let allAds = [],
      ventilationBed = [],
      inHospital = [],
      byAge = [];
    try {
      // if all api data used in rendering all the healthcare charts have been fetched and cached locally,
      if ((healthcareState?.cumData || healthcareState?.newData) && !refetch) {
        // extracts the cached data from the healthcare state state
        const { healthcareDist, ventilationDist, hospitalDist, ageDist } =
          healthcareState.cumData || healthcareState.newData;

        // format all the extracted data to how its consumed on the healthcare charts page
        allAds = formatDataToMonthAgg(healthcareDist, false);
        ventilationBed = formatDataToMonthAgg(ventilationDist, false);
        inHospital = formatDataToMonthAgg(hospitalDist, false);
        byAge = formatByAge(ageDist, "value", true);
      } else {
        // fetch all admissions entries over the period.
        const { data: healthcareDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          Adm: true,
        });

        // fetch all new ventilation admissions entries over the period.
        const { data: ventilationDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          ventilation: true,
          newAdm: true,
        });

        // fetch the hospital patients over time with age demography
        const { data: hospitalDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          hospital: true,
          newAdm: true,
        });

        // fetch all admissions entries with age demography over the period.
        const { data: ageDist } = await AppService.getHealthcare({
          areaName,
          cumValue: false,
          age: true,
        });

        // format all the data
        allAds = formatDataToMonthAgg(healthcareDist, false);
        ventilationBed = formatDataToMonthAgg(ventilationDist, false);
        inHospital = formatDataToMonthAgg(hospitalDist, false);
        byAge = formatByAge(ageDist, "value", true);

        // save the fetched data in healthcare state
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

      // return the generated data
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
    getVaccinationChartData,
    getCasesOverview,
    getCasesChartData,
    getDeathsOverview,
    getDeathsChartData,
    getHealthcareOverview,
    getHealthcareChartData,
  };
};

export default useApiRequest;
