export const filterForDate = (data = [], date = "") => {
  if (!date) return data;
  return data.filter((d) => new Date(d.date) >= new Date(date));
};

export const formatHealthcare = (_healthcares) => {
  // healthcare data
  const aggHealthcares = {};
  _healthcares.forEach((h) => {
    if (h.areaName in aggHealthcares) {
      if (h.date.slice(0, 7) in aggHealthcares[h.areaName]) {
        aggHealthcares[h.areaName][h.date.slice(0, 7)] = greaterVal(
          h.value,
          aggHealthcares[h.areaName][h.date.slice(0, 7)]
        );
      } else {
        aggHealthcares[h.areaName][h.date.slice(0, 7)] = h.value;
      }
    } else {
      aggHealthcares[h.areaName] = {};
      aggHealthcares[h.areaName][h.date.slice(0, 7)] = h.value;
    }
  });
  const healthcares = {};
  Object.entries(aggHealthcares).forEach(([areaName, data]) => {
    healthcares[areaName] = Object.entries(data).map(([key, value]) => ({
      date: key,
      value,
    }));
  });
  return healthcares;
};

export const formatVaccineData = (data) => {
  const initResult = {};
  data.forEach((d) => {
    if (d.date.slice(0, 7) in initResult) {
      initResult[d.date.slice(0, 7)] += d.value;
    } else {
      initResult[d.date.slice(0, 7)] = d.value;
    }
  });

  const result = Object.entries(initResult).map(([date, value]) => ({
    date,
    value,
  }));
  return result;
};

export const formatAgecases = (ageCaseDist) => {
  const ageCases = {};
  ageCaseDist?.forEach((c) => {
    c?.value?.forEach((d) => {
      if (d.age in ageCases) ageCases[d.age] += d.cases;
      else ageCases[d.age] = d.cases;
    });
  });
  return ageCases;
};

export const getDataSum = (data) => {
  return data.reduce((acc, curr) => acc + curr.value, 0);
};

export const decToFixed = (num, dp) => {
  const strNum = num.toString();
  const dotidx = strNum.indexOf(".");
  if (dotidx < 0) return num;
  const resultStr = strNum.slice(0, dotidx + dp + 1);
  return parseFloat(resultStr);
};

export const formatVaccineDemo = (data, date, ageCum = false) => {
  if (!data) return {};
  const initResult = { firstDose: [], secondDose: [], thirdDose: [] };
  const initResult2 = {};

  const preciseData = !date ? data[0] : data.find((d) => d.date === date) || {};

  data?.forEach((c) => {
    c.value.forEach((d) => {
      if (d.age in initResult2) {
        if (c.date.slice(0, 7) in initResult2[d.age]) {
          initResult2[d.age][c.date.slice(0, 7)] = greaterVal(
            initResult2[d.age][c.date.slice(0, 7)],
            d.newPeopleVaccinatedFirstDoseByVaccinationDate +
              d.newPeopleVaccinatedSecondDoseByVaccinationDate +
              d.newPeopleVaccinatedThirdInjectionByVaccinationDate
          );
        } else {
          initResult2[d.age][c.date.slice(0, 7)] =
            d.newPeopleVaccinatedFirstDoseByVaccinationDate +
            d.newPeopleVaccinatedSecondDoseByVaccinationDate +
            d.newPeopleVaccinatedThirdInjectionByVaccinationDate;
        }
      } else {
        initResult2[d.age] = {
          [c.date.slice(0, 7)]:
            d.newPeopleVaccinatedFirstDoseByVaccinationDate +
            d.newPeopleVaccinatedSecondDoseByVaccinationDate +
            d.newPeopleVaccinatedThirdInjectionByVaccinationDate,
        };
      }
    });
  });

  const finalResult2 = {};
  Object.entries(initResult2).forEach(([areaName, data]) => {
    finalResult2[areaName] = Object.entries(data).map(([key, value]) => ({
      date: key,
      value,
    }));
  });
  if (ageCum) return finalResult2;

  preciseData?.value.forEach((d) => {
    initResult.firstDose.push({
      age: d.age,
      value: d.cumPeopleVaccinatedFirstDoseByVaccinationDate,
    });
    initResult.secondDose.push({
      age: d.age,
      value: d.cumPeopleVaccinatedSecondDoseByVaccinationDate,
    });
    initResult.thirdDose.push({
      age: d.age,
      value: d.cumPeopleVaccinatedThirdInjectionByVaccinationDate,
    });
  });
  return initResult;
};

export const formatVaccineDemoPerc = (data) => {
  const initResult = {};
  data?.forEach((c) => {
    if (!(c.date.slice(0, 7) in initResult)) {
      initResult[c.date.slice(0, 7)] = 0;
    }
    c.value.forEach((d) => {
      initResult[c.date.slice(0, 7)] +=
        d.newPeopleVaccinatedFirstDoseByVaccinationDate +
        d.newPeopleVaccinatedSecondDoseByVaccinationDate +
        d.newPeopleVaccinatedThirdInjectionByVaccinationDate;
    });
  });
  return initResult;
};

export const formatDeaths = (data) => {
  const initResult = {};
  data.forEach((d) => {
    if (d.date.slice(0, 7) in initResult) {
      initResult[d.date.slice(0, 7)] = greaterVal(
        initResult[d.date.slice(0, 7)],
        d.value
      );
    } else {
      initResult[d.date.slice(0, 7)] = d.value;
    }
  });

  const result = Object.entries(initResult).map(([date, value]) => {
    return {
      date,
      value,
    };
  });
  return result;
};

export const extractCompleteVacc = (data) => {
  const initResult = {};
  data?.forEach((c) => {
    if (!(c.date.slice(0, 7) in initResult)) {
      initResult[c.date.slice(0, 7)] = 0;
    }
    c.value.forEach((d) => {
      initResult[c.date.slice(0, 7)] = greaterVal(
        initResult[c.date.slice(0, 7)],
        d.cumPeopleVaccinatedCompleteByVaccinationDate
      );
    });
  });
  const result = Object.entries(initResult).map(([date, value]) => {
    return {
      date,
      value,
    };
  });
  return result;
};

export const greaterVal = (a, b) => (a > b ? a : b);
