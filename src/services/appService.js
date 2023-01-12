import axiosInstance from "../core/api/baseAxios";

class AppService {
  // return response for cases api request
  static async getCases({ cumValue = false, ...data }) {
    // extract the arguments values
    const {
      ageDemo = false,
      ageSex = false,
      newCases = false,
      nation = false,
      rate = false,
      areaName = "",
    } = data || {};

    // construct the api request parameter structure
    const params = {
      filters: `areaType=overview`,
      latestBy: "cumCasesByPublishDate",
      structure: {
        date: "date",
        name: "areaName",
        code: "areaCode",
        value: "cumCasesByPublishDate",
      },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (ageDemo) {
      params.filters = "areaType=nation";
      params.structure.value = "newCasesBySpecimenDateAgeDemographics";
    }
    if (!cumValue && newCases) {
      params.structure.value = "newCasesByPublishDate";
    }
    if (rate) {
      params.structure.value = "newCasesByPublishDateChangePercentage";
      params.latestBy = "newCasesByPublishDateChangePercentage";
    }
    if (ageSex) {
      params.filters = "areaType=nation";
      params.structure = { femaleCases: "femaleCases", maleCases: "maleCases" };
      params.latestBy = "femaleCases";
    }
    if (nation) params.filters = "areaType=nation";
    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // return response for deaths api request
  static async getDeaths({ cumValue = false, ...data }) {
    // extract the arguments values
    const {
      rate = false,
      date = "",
      newDeaths = false,
      within28 = false,
      within60 = false,
      demo = false,
      areaName = "",
    } = data;

    // construct the api request parameter structure
    const params = {
      filters: "areaType=overview",
      latestBy: "cumOnsDeathsByRegistrationDate",
      structure: {
        date: "date",
        name: "areaName",
        value: "cumOnsDeathsByRegistrationDate",
      },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (rate) {
      params.structure.value = "cumOnsDeathsByRegistrationDateRate";
      params.latestBy = "cumOnsDeathsByRegistrationDateRate";
    }
    if (date && cumValue) params.filters += `;date=${date}`;
    if (newDeaths && !cumValue)
      params.structure.value = "newOnsDeathsByRegistrationDate";

    if (within28 && !cumValue) {
      params.structure.value = "newDeaths28DaysByDeathDate";
      params.latestBy = "newDeaths28DaysByDeathDate";
    } else if (within28 && cumValue) {
      params.structure.value = "cumDeaths28DaysByDeathDate";
      params.latestBy = "cumDeaths28DaysByDeathDate";
    }

    if (within60 && !cumValue) {
      params.structure.value = "newDeaths60DaysByDeathDate";
      params.latestBy = "newDeaths60DaysByDeathDate";
      params.filters = "areaType=nation";
    } else if (within60 && cumValue) {
      params.structure.value = "newDeaths60DaysByDeathDate";
      params.latestBy = "newDeaths60DaysByDeathDate";
      params.filters = "areaType=nation";
    }

    if (demo) {
      params.filters = "areaType=nation";

      if (within28 && !cumValue) {
        params.structure.value = "newDeaths28DaysByDeathDateAgeDemographics";
        params.latestBy = "newDeaths28DaysByDeathDateAgeDemographics";
      } else if (within60 && !cumValue) {
        params.structure.value = "newDeaths60DaysByDeathDateAgeDemographics";
        params.latestBy = "newDeaths60DaysByDeathDateAgeDemographics";
      }
    }

    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // returns response for  vaccines api request
  static async getVaccines({ cumValue = false, ...data }) {
    // extract the arguments values
    const {
      dosage = false,
      weekly = false,
      dosageIdx = "first",
      date = "",
      areaName = "",
    } = data || {};

    // conditionally set dosages structure item name options
    let dosageOptions = Object.freeze({
      first: "cumPeopleVaccinatedFirstDoseByPublishDate",
      second: "cumPeopleVaccinatedSecondDoseByPublishDate",
      third: "cumPeopleVaccinatedThirdInjectionByPublishDate",
    });

    if (!cumValue) {
      dosageOptions = Object.freeze({
        first: "newPeopleVaccinatedFirstDoseByPublishDate",
        second: "newPeopleVaccinatedSecondDoseByPublishDate",
        third: "newPeopleVaccinatedThirdInjectionByPublishDate",
      });
    }

    if (dosage && weekly) {
      dosageOptions = Object.freeze({
        first: "weeklyPeopleVaccinatedFirstDoseByVaccinationDate",
        second: "weeklyPeopleVaccinatedSecondDoseByVaccinationDate",
      });
    }

    // construct the api request parameter structure
    const params = {
      filters: "areaType=overview",
      latestBy: "cumVaccinesGivenByPublishDate",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "cumVaccinesGivenByPublishDate",
      },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (dosage) {
      params.latestBy = dosageOptions[dosageIdx];
      params.structure.value = dosageOptions[dosageIdx];
    }
    if (!cumValue && !dosage) {
      params.structure.value = "newVaccinesGivenByPublishDate";
    }
    if (date && cumValue) params.filters += `;date=${date}`;

    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // returns response for api request of vaccine age demography request
  static async getVaccineAgeDemo({
    cumValue = false,
    date = "",
    areaName = "",
  }) {
    // construct the api request parameter structure
    const params = {
      filters: "areaType=nation",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "vaccinationsAgeDemographics",
      },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // return api response for healthcare request
  static async getHealthcare({
    cumValue = false,
    date = "",
    newAdm = false,
    ventilation = false,
    hospital = false,
    nation = false,
    age = false,
    rate = false,
    areaName = "",
  }) {
    // construct the api request parameter structure
    const params = {
      filters: "areaType=overview",
      latestBy: "cumAdmissions",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "cumAdmissions",
      },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (!cumValue && nation) {
      params.filters = "areaType=nation";
    }
    if (date && cumValue) params.filters += `;date=${date}`;
    if (newAdm && !cumValue) params.structure.value = "newAdmissions";
    if (ventilation) {
      params.structure.value = "covidOccupiedMVBeds";
      params.latestBy = "covidOccupiedMVBeds";
    }
    if (hospital) {
      params.structure.value = "hospitalCases";
      params.latestBy = "hospitalCases";
    }
    if (age) {
      params.structure.value = "cumAdmissionsByAge";
      params.latestBy = "cumAdmissionsByAge";
      params.filters = "areaType=nation";
    }
    if (rate) {
      params.structure.value = "newAdmissionsChangePercentage";
      params.latestBy = "newAdmissionsChangePercentage";
    }
    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // return response for reinfections api request
  static async getReinfections({
    cumValue = false,
    date = "",
    newCases = false,
    areaName = "",
  }) {
    // construct the api request parameter structure
    const params = {
      filters: "areaType=overview",
      latestBy: "cumReinfectionsBySpecimenDate",
      structure: { date: "date", value: "cumReinfectionsBySpecimenDate" },
    };

    /******************************************************************
     * modify the paramer structure based on supplioed function arguments
     ******************************************************************/
    if (date && cumValue) params.filters += `;date=${date}`;
    if (!cumValue && newCases)
      params.structure.value = "newReinfectionsBySpecimenDate";
    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // return response for episodes api request
  static async getFirstEpisodes({
    cumValue = false,
    date = "",
    newCases = false,
    areaName = "",
  }) {
    // construct the api request parameter structure
    const params = {
      filters: "areaType=overview",
      latestBy: "cumFirstEpisodesBySpecimenDate",
      structure: { date: "date", value: "cumFirstEpisodesBySpecimenDate" },
    };

    /******************************************************************
     * modify the paramer structure based on supplied function arguments
     ******************************************************************/
    if (date && cumValue) params.filters += `;date=${date}`;
    if (!cumValue && newCases)
      params.structure.value = "newFirstEpisodesBySpecimenDate";
    if (!!areaName) {
      params.filters = `areaType=nation;areaName=${areaName}`;
    }

    /******************************************************************
     * format the endpoint point using the parameter structure
     ******************************************************************/
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    /******************************************************************
     * Make api request and send back the response
     ******************************************************************/
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }
}

export default AppService;
