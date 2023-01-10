export const filterForDate = (data = [], date = "") => {
  if (!date) return data;
  return data.filter((d) => new Date(d.date) >= new Date(date));
};

export const formatByRegion = (data, areaKey = "name") => {
  // healthcare data
  const initResult = {};
  data.forEach((h) => {
    if (h[areaKey] in initResult) {
      if (h.date.slice(0, 7) in initResult[h[areaKey]]) {
        initResult[h[areaKey]][h.date.slice(0, 7)] = greaterVal(
          h.value,
          initResult[h[areaKey]][h.date.slice(0, 7)]
        );
      } else {
        initResult[h[areaKey]][h.date.slice(0, 7)] = h.value;
      }
    } else {
      initResult[h[areaKey]] = {};
      initResult[h[areaKey]][h.date.slice(0, 7)] = h.value;
    }
  });

  const result = {};
  Object.entries(initResult).forEach(([areaName, data]) => {
    result[areaName] = Object.entries(data).map(([key, value]) => ({
      date: key,
      value,
    }));
  });
  return result;
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

export const formatByAge = (data, valueKey = "deaths", isCum = false) => {
  if (!data) return [];
  const result = {};
  data?.forEach((c) => {
    c?.value?.forEach((d) => {
      if (d.age in result)
        result[d.age] = isCum
          ? greaterVal(d[valueKey], result[d.age])
          : result[d.age] + d[valueKey];
      else result[d.age] = d[valueKey];
    });
  });
  return result;
};

export const formatAgecases = (ageCaseDist) => {
  if (!ageCaseDist) return [];
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

export const formatDataToMonthAgg = (data, isCum = true) => {
  const initResult = {};
  data.forEach((d) => {
    if (d.date.slice(0, 7) in initResult) {
      initResult[d.date.slice(0, 7)] = isCum
        ? greaterVal(initResult[d.date.slice(0, 7)], d.value)
        : initResult[d.date.slice(0, 7)] + d.value;
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

export const chartMultiSeries = (data, y = "value", x = "date") => {
  if (!data) return [];
  return {
    yval: Object.entries(data).map(([key, value]) => ({
      name: key,
      data: value.map((d) => d[y]),
    })),
    xval: [
      ...new Set(
        Object.values(data)
          .flat()
          .map((v) => v[x])
      ),
    ],
  };
};

export const greaterVal = (a, b) => (a > b ? a : b);
