import React from "react";
import tw, { styled } from "twin.macro";
import {
  FlexCol,
  FlexContainer,
  HeaderWrapper,
  PageContainer as PG,
  YSpacer,
} from "../components";
import Header from "../components/common/Header";
import { MdArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";

import CovidImg from "../assets/images/covid.svg";
import SymptomsImg from "../assets/images/symptoms.svg";
import PrImg from "../assets/images/prevention.svg";
import TreatmentImg from "../assets/images/treatment.svg";

const AppLayoutWrapper = styled.div`
  ${tw`w-full h-[100vh]`}
`;

const DashWrapper = styled(FlexContainer)`
  ${tw`bg-primarygray px-5 text-base py-2 gap-x-3`}
`;

const PageContainer = styled(PG)`
  ${tw`px-5 w-full lg:w-3/4 mx-auto mt-[5rem]`}
`;

const Title = styled.p`
  ${tw`text-solid text-2xl text-center font-bold`}
`;

const HeadText = styled.p`
  ${tw`text-lg font-bold mb-3`}
`;

const BodyText = styled.p`
  ${tw`text-base text-textgray leading-[24px]`}
`;

const ContentContainer = styled.div`
  ${tw`border p-7 my-5`}
`;

const CenterDiv = styled(FlexContainer)`
  ${tw`justify-center w-full my-10`}
`;
const Info = () => {
  return (
    <AppLayoutWrapper>
      <Header updateTime={false} />
      <DashWrapper>
        <Link to={"/"}>
          <FlexContainer className="gap-x-2">
            <MdArrowBackIos />
            <p>Return to Dashboard</p>
          </FlexContainer>
        </Link>
      </DashWrapper>
      <PageContainer>
        <Title>COVID-19</Title>
        <ContentContainer>
          {/* About section */}
          <div>
            <HeadText>About</HeadText>
            <BodyText>
              The COVID-19 pandemic, also known as the coronavirus pandemic, is
              an ongoing global pandemic of coronavirus disease 2019 (COVID-19)
              caused by severe acute respiratory syndrome coronavirus 2
              (SARS-CoV-2). The novel virus was first identified from an
              outbreak in Wuhan, China, in December 2019. Attempts to contain
              failed, allowing the virus to spread to other areas of Asia and
              later worldwide. The World Health Organization (WHO) declared the
              outbreak a public health emergency of international concern on 30
              January 2020 and a pandemic on 11 March 2020. As of 22 November
              2022, the pandemic had caused more than 638 million cases and 6.62
              million confirmed deaths, making it one of the deadliest in
              history.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              COVID-19 symptoms range from undetectable to deadly, but most
              commonly include fever, dry cough, and fatigue. Severe illness is
              more likely in elderly patients and those with certain underlying
              medical conditions. COVID-19 transmits when people breathe in air
              contaminated by droplets and small airborne particles containing
              the virus. The risk of breathing these in is highest when people
              are in close proximity, but they can be inhaled over longer
              distances, particularly indoors. Transmission can also occur if
              contaminated fluids reach the eyes, nose or mouth, and, rarely,
              via contaminated surfaces. Infected persons are typically
              contagious for 10 days, and can spread the virus even if they do
              not develop symptoms. Mutations have produced many strains
              (variants) with varying degrees of infectivity and virulence.
            </BodyText>
            <CenterDiv>
              <img src={CovidImg} />
            </CenterDiv>
            <hr />
          </div>
          {/* Background */}
          <div className="my-4">
            <HeadText>Background</HeadText>
            <BodyText>
              SARS-CoV-2 is a newly discovered virus that is closely related to
              bat coronaviruses, pangolin coronaviruses, and SARS-CoV. The first
              known outbreak started in Wuhan, Hubei, China, in November 2019.
              Many early cases were linked to people who had visited the Huanan
              Seafood Wholesale Market there, but it is possible that
              human-to-human transmission began earlier.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              The scientific consensus is that the virus is most likely of a
              zoonotic origin, from bats or another closely-related mammal.
              Despite this, the subject has generated extensive speculation
              about alternative origins. The origin controversy heightened
              geopolitical divisions, notably between the United States and
              China.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              The earliest known infected person fell ill on 1 December 2019.
              That individual did not have a connection with the later wet
              market cluster. However, an earlier case may have occurred on 17
              November. Two-thirds of the initial case cluster were linked with
              the market. Molecular clock analysis suggests that the index case
              is likely to have been infected between mid-October and
              mid-November 2019.
            </BodyText>
          </div>
          <hr />

          {/* Signs and symptoms */}
          <div className="my-4">
            <HeadText>Signs and symptoms</HeadText>
            <BodyText>
              Symptoms of COVID-19 are variable, ranging from mild symptoms to
              severe illness. Common symptoms include headache, loss of smell
              and taste, nasal congestion and runny nose, cough, muscle pain,
              sore throat, fever, diarrhoea, and breathing difficulties. People
              with the same infection may have different symptoms, and their
              symptoms may change over time.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              Three common clusters of symptoms have been identified: one
              respiratory symptom cluster with cough, sputum, shortness of
              breath, and fever; a musculoskeletal symptom cluster with muscle
              and joint pain, headache, and fatigue; a cluster of digestive
              symptoms with abdominal pain, vomiting, and diarrhoea. In people
              without prior ear, nose, and throat disorders, loss of taste
              combined with loss of smell is associated with COVID-19 and is
              reported in as many as 88% of cases.
            </BodyText>
            <CenterDiv>
              <img src={SymptomsImg} />
            </CenterDiv>
          </div>
          <hr />

          {/* Transmission section */}
          <div className="my-4">
            <HeadText>Transmission</HeadText>
            <BodyText>
              The disease is mainly transmitted via the respiratory route when
              people inhale droplets and small airborne particles (that form an
              aerosol) that infected people exhale as they breathe, talk, cough,
              sneeze, or sing. Infected people are more likely to transmit
              COVID-19 when they are physically close. However, infection can
              occur over longer distances, particularly indoors.
            </BodyText>
          </div>
          <hr />
          {/* Prevention */}
          <div className="my-4">
            <HeadText>Prevention</HeadText>
            <BodyText>
              Preventive measures to reduce the chances of infection include
              getting vaccinated, staying at home, wearing a mask in
              public,[119] avoiding crowded places, keeping distance from
              others, ventilating indoor spaces, managing potential exposure
              durations, washing hands with soap and water often and for at
              least twenty seconds, practising good respiratory hygiene, and
              avoiding touching the eyes, nose, or mouth with unwashed hands.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              Those diagnosed with COVID-19 or who believe they may be infected
              are advised by the CDC to stay home except to get medical care,
              call ahead before visiting a healthcare provider, wear a face mask
              before entering the healthcare provider's office and when in any
              room or vehicle with another person, cover coughs and sneezes with
              a tissue, regularly wash hands with soap and water and avoid
              sharing personal household items.
            </BodyText>
            <CenterDiv>
              <img src={PrImg} />
            </CenterDiv>
          </div>
          <hr />

          {/* Treatment */}
          <div className="my-4">
            <HeadText>Treatment</HeadText>
            <CenterDiv>
              <img src={TreatmentImg} />
            </CenterDiv>
            <BodyText>
              For the first two years of the pandemic, no specific and effective
              treatment or cure was available. In 2021, the European Medicines
              Agency's (EMA) Committee for Medicinal Products for Human Use
              (CHMP) approved the oral antiviral protease inhibitor, Paxlovid
              (nirmatrelvir plus AIDS drug ritonavir), to treat adult patients.
              FDA later gave it an EUA.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              Most cases of COVID-19 are mild. In these, supportive care
              includes medication such as paracetamol or NSAIDs to relieve
              symptoms (fever,[139] body aches, cough), adequate intake of oral
              fluids and rest.[136][140] Good personal hygiene and a healthy
              diet are also recommended.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              Supportive care includes treatment to relieve symptoms, fluid
              therapy, oxygen support and prone positioning, and medications or
              devices to support other affected vital organs. More severe cases
              may need treatment in hospital. In those with low oxygen levels,
              use of the glucocorticoid dexamethasone is recommended, to reduce
              mortality. Noninvasive ventilation and, ultimately, admission to
              an intensive care unit for mechanical ventilation may be required
              to support breathing. Extracorporeal membrane oxygenation (ECMO)
              has been used to address the issue of respiratory failure.
            </BodyText>
            <YSpacer margin="1rem" />
            <BodyText>
              Existing drugs such as hydroxychloroquine, lopinavir/ritonavir,
              ivermectin and so-called early treatment are not recommended by US
              or European health authorities, as there is no good evidence they
              have any useful effect. The antiviral remdesivir is available in
              the US, Canada, Australia, and several other countries, with
              varying restrictions; however, it is not recommended for use with
              mechanical ventilation, and is discouraged altogether by the World
              Health Organization (WHO), due to limited evidence of its
              efficacy.
            </BodyText>
          </div>
          <div className="mt-7">
            <p className="italic">Resources</p>
            <p>
              For more information visit{" "}
              <a
                href="https://en.wikipedia.org/wiki/COVID-19_pandemic"
                className="font-bold text-sm text-solid"
              >
                COVID-19 Pandemic WIKI Page
              </a>
            </p>
          </div>
        </ContentContainer>
      </PageContainer>
    </AppLayoutWrapper>
  );
};

export default Info;
