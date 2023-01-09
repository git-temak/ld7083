import axiosInstance from "../core/api/baseAxios";

class AppService {
  static async getCases({ cumValue = false, ...data }) {
    const { ageDemo = false, newCases = false } = data || {};
    const today = new Date();
    const todaysDate = `${
      today.getFullYear() - today.getMonth() + 1 - today.getDate()
    }`;

    const params = {
      filters: `areaType=nation`,
      latestBy: "cumCasesByPublishDate",
      structure: {
        date: "date",
        name: "areaName",
        code: "areaCode",
        value: "cumCasesByPublishDate",
      },
    };

    if (ageDemo) {
      params.structure.value = "newCasesBySpecimenDateAgeDemographics";
    }
    if (!cumValue && newCases) {
      params.structure.value = "newCasesByPublishDate";
    }
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  static async getDeaths({ cumValue = false, ...data }) {
    const { rate = false, date = "", newDeaths = false } = data;
    const params = {
      filters: "areaType=overview",
      latestBy: "cumOnsDeathsByRegistrationDate",
      structure: {
        date: "date",
        name: "areaName",
        value: "cumOnsDeathsByRegistrationDate",
      },
    };
    if (rate) params.structure.value = "cumOnsDeathsByRegistrationDateRate";
    if (date && cumValue) params.filters += `;date=${date}`;
    if (newDeaths && !cumValue)
      params.structure.value = "newOnsDeathsByRegistrationDate";

    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;
    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // overview card details
  static async getVaccines({ cumValue = false, ...data }) {
    const {
      dosage = false,
      weekly = false,
      dosageIdx = "first",
      date = "",
    } = data || {};

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
      console.log("Will use weekly points");
    }

    const params = {
      filters: "areaType=overview",
      latestBy: "cumVaccinesGivenByPublishDate",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "cumVaccinesGivenByPublishDate",
      },
    };

    if (dosage) {
      params.latestBy = dosageOptions[dosageIdx];
      params.structure.value = dosageOptions[dosageIdx];
    }
    if (!cumValue && !dosage) {
      params.structure.value = "newVaccinesGivenByPublishDate";
    }
    if (date && cumValue) params.filters += `;date=${date}`;
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  static async getVaccineAgeDemo({ cumValue = false, date = "" }) {
    const params = {
      filters: "areaType=nation",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "vaccinationsAgeDemographics",
      },
    };

    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  static async getHealthcare({ cumValue = false, date = "", newAdm = false }) {
    const params = {
      filters: "areaType=overview",
      latestBy: "cumAdmissions",
      structure: {
        date: "date",
        areaName: "areaName",
        value: "cumAdmissions",
      },
    };
    if (!cumValue) {
      params.filters = "areaType=nation";
    }
    if (date && cumValue) params.filters += `;date=${date}`;
    if (newAdm && !cumValue) params.structure.value = "newAdmissions";
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  static async getReinfections({ cumValue = false, date = "" }) {
    const params = {
      filters: "areaType=nation",
      latestBy: "cumReinfectionsBySpecimenDate",
      structure: { date: "date", value: "cumReinfectionsBySpecimenDate" },
    };
    if (date && cumValue) params.filters += `;date=${date}`;
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  static async getFirstEpisodes({ cumValue = false, date = "" }) {
    const params = {
      filters: "areaType=nation",
      latestBy: "cumFirstEpisodesBySpecimenDate",
      structure: { date: "date", value: "cumFirstEpisodesBySpecimenDate" },
    };
    if (date && cumValue) params.filters += `;date=${date}`;
    const endpoint =
      "?" +
      `filters=${params.filters}&` +
      (cumValue ? `latestBy=${params.latestBy}&` : "") +
      `structure=${JSON.stringify(params.structure)}`;

    const req = await axiosInstance.get(endpoint);
    return req?.data || req;
  }

  // Others
  // static async getHealthcare(data) {
  //   const config = {};
  //   const req = await axiosInstance.get("/", config);
  //   return req?.data || req;
  // }

  // static async getCases(data) {
  //   const config = {};
  //   const req = await axiosInstance.get("/", config);
  //   return req?.data || req;
  // }

  // static async getVaccioverviews(data) {
  //   const config = {};
  //   const req = await axiosInstance.get("/", config);
  //   return req?.data || req;
  // }

  // static async getDeaths(data) {
  //   const params = {
  //     filters: "areaType=overview",
  //     latestBy: "cumOnsDeathsByRegistrationDate",
  //     structure: {
  //       date: "date",
  //       name: "areaName",
  //       value: "cumOnsDeathsByRegistrationDate",
  //     },
  //   };

  //   const endpoint =
  //     "?" +
  //     `filters=${params.filters}&` +
  //     `structure=${JSON.stringify(params.structure)}`;

  //   const req = await axiosInstance.get(endpoint);
  //   return req?.data || req;
  // }
}

export default AppService;
