import React, { useState } from 'react';
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useColorScheme } from '../hooks/useColorScheme';
import DrugModal from './DrugModal';

const DRUGS = [
  {
    name: 'Metformin Hydrochloride',
    info: `Metformin hydrochloride 26-Jul-2018\nDRUG ACTION Metformin exerts its effect mainly by decreasing gluconeogenesis and by increasing peripheral utilisation of glucose; since it acts only in the presence of endogenous insulin it is effective only if there are some residual functioning pancreatic islet cells.\nINDICATIONS AND DOSE\nType 2 diabetes mellitus [monotherapy or in combination with other antidiabetic drugs (including insulin)]\n▶ BY MOUTH USING IMMEDIATE-RELEASE MEDICINES\n▶ Child 10–17 years (specialist use only): Initially 500 mg once daily, dose to be adjusted according to response at intervals of at least 1 week, maximum daily dose to be given in 2–3 divided doses; maximum 2 g per day\n▶ Adult: Initially 500 mg once daily for at least 1 week, dose to be taken with breakfast, then 500 mg twice daily for at least 1 week, dose to be taken with breakfast and evening meal, then 500 mg 3 times a day, dose to be taken with breakfast, lunch and evening meal; maximum 2 g per day\n▶ BY MOUTH USING MODIFIED-RELEASE MEDICINES\n▶ Adult: Initially 500 mg once daily, then increased if necessary up to 2 g once daily, dose increased gradually, every 10–15 days, dose to be taken with evening meal, alternatively increased to 1 g twice daily, dose to be taken with meals, alternative dose only to be used if control not achieved with once daily dose regimen. If control still not achieved then change to standard release tablets\nType 2 diabetes mellitus [reduction in risk or delay of onset]\n▶ BY MOUTH USING MODIFIED-RELEASE MEDICINES\n▶ Adult 18–74 years: Initially 500 mg once daily, then increased if necessary up to 2 g once daily, dose increased gradually, every 10–15 days, dose to be taken with evening meal, for further information on risk factors—consult product literature\nPolycystic ovary syndrome\n▶ BY MOUTH USING IMMEDIATE-RELEASE MEDICINES\n▶ Adult: Initially 500 mg once daily for 1 week, dose to be taken with breakfast, then 500 mg twice daily for 1 week, dose to be taken with breakfast and evening meal, then 1.5–1.7 g daily in 2–3 divided doses\nUNLICENSED USE\n▶ In adults g Based on clinical experience of increased side-effects, maximum dose for metformin immediate-release medicines in BNF Publications differs from product licence. l Not licensed for polycystic ovary syndrome.\nCONTRA-INDICATIONS Acute metabolic acidosis (including lactic acidosis and diabetic ketoacidosis)\nCAUTIONS Risk factors for lactic acidosis\nCAUTIONS, FURTHER INFORMATION\n▶ Risk factors for lactic acidosis Manufacturer advises caution in chronic stable heart failure (monitor cardiac function), and concomitant use of drugs that can acutely impair renal function; interrupt treatment if dehydration occurs, and avoid in conditions that can acutely worsen renal function, or cause tissue hypoxia.\n▶ Elderly Prescription potentially inappropriate (STOPP criteria) if eGFR less than 30 mL/minute/1.73 m2 (risk of lactic acidosis). See also Prescribing in the elderly p. 33.\nINTERACTIONS → Appendix 1: metformin\nSIDE-EFFECTS\n▶ Common or very common Abdominal pain . appetite decreased . diarrhoea (usually transient). gastrointestinal disorder. nausea .taste altered . vomiting\n▶ Rare or very rare Hepatitis . lactic acidosis (discontinue). skin reactions . vitamin B12 absorption decreased\nSIDE-EFFECTS, FURTHER INFORMATION Gastro-intestinal side-effects are initially common with metformin, and may persist in some patients, particularly when very high doses are given. A slow increase in dose may improve tolerability.\nPREGNANCY Can be used in pregnancy for both pre-existing and gestational diabetes. Women with gestational diabetes should discontinue treatment after giving birth.\nBREAST FEEDING May be used during breast-feeding in women with pre-existing diabetes.\nHEPATIC IMPAIRMENT Withdraw if tissue hypoxia likely.\nRENAL IMPAIRMENT\n▶ In adults Manufacturer advises avoid if eGFR is less than 30 mL/minute/1.73 m2.\n▶ In children Manufacturer advises avoid if estimated glomerular filtration rate is less than 30 mL/minute/1.73 m2.\nDose adjustments ▶ In children Manufacturer advises consider dose reduction in moderate impairment.\n▶ In adults Manufacturer advises reduce dose in moderate impairment—consult product literature.\nMONITORING REQUIREMENTS Determine renal function before treatment and at least annually (at least twice a year in patients with additional risk factors for renal impairment, or if deterioration suspected).\nPRESCRIBING AND DISPENSING INFORMATION\n▶ In adults Patients taking up to 2 g daily of the standard-release metformin may start with the same daily dose of metformin modified release; not suitable if dose of standard-release tablets more than 2 g daily.\nPATIENT AND CARER ADVICE Manufacturer advises that patients and their carers should be informed of the risk of lactic acidosis and told to seek immediate medical attention if symptoms such as dyspnoea, muscle cramps, abdominal pain, hypothermia, or asthenia occur.\nMedicines for Children leaflet: Metformin for diabetes`,
    conditions: [
      {
        label: 'Type 2 diabetes (child 10–17y, immediate-release)',
        baseDose: 500,
        unit: 'mg',
        patientType: 'child',
        note: 'Initially 500 mg once daily, max 2 g/day in 2–3 divided doses',
      },
      {
        label: 'Type 2 diabetes (adult, immediate-release)',
        baseDose: 500,
        unit: 'mg',
        patientType: 'adult',
        note: 'Initially 500 mg once daily, titrate up to max 2 g/day in 2–3 divided doses',
      },
      {
        label: 'Type 2 diabetes (adult, modified-release)',
        baseDose: 500,
        unit: 'mg',
        patientType: 'adult',
        note: 'Initially 500 mg once daily, up to 2 g once daily or 1 g twice daily',
      },
      {
        label: 'Polycystic ovary syndrome (adult, immediate-release)',
        baseDose: 500,
        unit: 'mg',
        patientType: 'adult',
        note: 'Initially 500 mg once daily, titrate up to 1.5–1.7 g daily in 2–3 divided doses',
      }
    ],
  },
  {
    name: 'Prednisolone',
    info: `\nDRUG ACTION Prednisolone exerts predominantly glucocorticoid effects with minimal mineralocorticoid effects.\nINDICATIONS AND DOSE\nAcute exacerbation of chronic obstructive pulmonary disease (if increased breathlessness interferes with daily activities)\n▶ BY MOUTH\n▶ Adult: 30 mg daily for 7–14 days\nSevere croup (before transfer to hospital)| Mild croup that might cause complications (before transfer to hospital)\n▶ BY MOUTH\n▶ Child: 1–2 mg/kg\nMild to moderate acute asthma (when oral corticosteroid taken for more than a few days)| Severe or life-threatening acute asthma (when oral corticosteroid taken for more than a few days)\n▶ BY MOUTH\n▶ Child 1 month–11 years: 2 mg/kg once daily (max. per dose 60 mg) for up to 3 days, longer if necessary\nMild to moderate acute asthma | Severe or life-threatening acute asthma\n▶ BY MOUTH\n▶ Child 1 month–11 years: 1–2 mg/kg once daily (max. per dose 40 mg) for up to 3 days, longer if necessary\n▶ Child 12–17 years: 40–50 mg daily for at least 5 days\n▶ Adult: 40–50 mg daily for at least 5 days\nSuppression of inflammatory and allergic disorders\n▶ BY MOUTH\n▶ Adult: Initially 10–20 mg daily, dose preferably taken in the morning after breakfast, can often be reduced within a few days but may need to be continued for several weeks or months; maintenance 2.5–15 mg daily, higher doses may be needed; cushingoid side-effects increasingly likely with doses above 7.5 mg daily\n▶ BY INTRAMUSCULAR INJECTION\n▶ Adult: 25–100 mg 1–2 times a week, as prednisolone acetate\nSuppression of inflammatory and allergic disorders (initial dose in severe disease)\n▶ BY MOUTH\n▶ Adult: Initially up to 60 mg daily, dose preferably taken in the morning after breakfast, can often be reduced within a few days but may need to be continued for several weeks or months\nIdiopathic thrombocytopenic purpura\n▶ BY MOUTH\n▶ Adult: 1 mg/kg daily, gradually reduce dose over several weeks\nUlcerative colitis | Crohn’s disease\n▶ BY MOUTH\n▶ Adult: Initially 20–40 mg daily until remission occurs, followed by reducing doses, up to 60 mg daily, may be used in some cases, doses preferably taken in the morning after breakfast\nNeuritic pain or weakness heralding rapid onset of permanent nerve damage (during reversal reactions multibacillary leprosy)\n▶ BY MOUTH\n▶ Adult: Initially 40–60 mg daily, dose to be instituted at once\nGeneralised myasthenia gravis (when given on alternate days)\n▶ BY MOUTH\n▶ Adult: Initially 10 mg once daily on alternate days, then increased in steps of 10 mg once daily on alternate days, increased to 1–1.5 mg/kg once daily on alternate days (max. per dose 100 mg)\nGeneralised myasthenia gravis in ventilated patients (when given on alternate days)\n▶ BY MOUTH\n▶ Adult: Initially 1.5 mg/kg once daily on alternate days (max. per dose 100 mg)\nGeneralised myasthenia gravis (when giving daily)\n▶ BY MOUTH\n▶ Adult: Initially 5 mg daily, increased in steps of 5 mg daily. maintenance 60–80 mg daily, alternatively maintenance 0.75–1 mg/kg daily, ventilated patients may be started on 1.5 mg/kg (max. 100 mg) on alternate days\nOcular myasthenia\n▶ BY MOUTH\n▶ Adult: Usual dose 10–40 mg once daily on alternate days, reduce to minimum effective dose\nReduction in rate of joint destruction in moderate to severe rheumatoid arthritis of less than 2 years’ duration\n▶ BY MOUTH\n▶ Adult: 7.5 mg daily\nPolymyalgia rheumatica\n▶ BY MOUTH\n▶ Adult: 10–15 mg daily until remission of disease activity; maintenance 7.5–10 mg daily, reduce gradually to maintenance dose. Many patients require treatment for at least 2 years and in some patients it may be necessary to continue long term low-dose corticosteroid treatment\nGiant cell (temporal) arteritis\n▶ BY MOUTH\n▶ Adult: 40–60 mg daily until remission of disease activity, the higher dose being used if visual symptoms occur; maintenance 7.5–10 mg daily, reduce gradually to maintenance dose. Many patients require treatment for at least 2 years and in some patients it may be necessary to continue long term low-dose corticosteroid treatment\nPolyarteritis nodosa | Polymyositis | Systemic lupus erythematosus\n▶ BY MOUTH\n▶ Adult: Initially 60 mg daily, to be reduced gradually; maintenance 10–15 mg daily\nSymptom control of anorexia in palliative care\n▶ BY MOUTH\n▶ Adult: 15–30 mg daily\nPneumocystis pneumonia in moderate to severe infections associated with HIV infection\n▶ BY MOUTH\n▶ Adult: 50–80 mg daily for 5 days, the dose is then reduced to complete 21 days of treatment, corticosteroid treatment should ideally be started at the same time as the anti-pneumocystis therapy and certainly no later than 24–72 hours afterwards. The corticosteroid should be withdrawn before anti-pneumocystis treatment is complete\nShort-term prophylaxis of episodic cluster headache as monotherapy or in combination with verapamil during verapamil titration\n▶ BY MOUTH\n▶ Adult: 60–100 mg once daily for 2–5 days, then reduced in steps of 10 mg every 2–3 days until prednisolone is discontinued\nProctitis\n▶ BY RECTUM USING RECTAL FOAM\n▶ Adult: 1 metered application 1–2 times a day for 2 weeks, continued for further 2 weeks if good response, to be inserted into the rectum, 1 metered application contains 20 mg prednisolone\n▶ BY RECTUM USING SUPPOSITORIES\n▶ Adult: 5 mg twice daily, to be inserted in to the rectum morning and night, after a bowel movement\nDistal ulcerative colitis\n▶ BY RECTUM USING RECTAL FOAM\n▶ Adult: 1 metered application 1–2 times a day for 2 weeks, continued for further 2 weeks if good response, to be inserted into the rectum, 1 metered application contains 20 mg prednisolone\nRectal complications of Crohn’s disease\n▶ BY RECTUM USING SUPPOSITORIES\n▶ Adult: 5 mg twice daily, to be inserted in to the rectum morning and night, after a bowel movement\nRectal and rectosigmoidal ulcerative colitis | Rectal and rectosigmoidal Crohn’s disease\n▶ BY RECTUM USING ENEMA\n▶ Adult: 20 mg daily for 2–4 weeks, continued if response good, to be used at bedtime\nIMPORTANT SAFETY INFORMATION\nSAFE PRACTICE\n▶ With systemic use Prednisolone has been confused with propranolol; care must be taken to ensure the correct drug is prescribed and dispensed.\nCONTRA-INDICATIONS\n▶ With rectal use Abdominal or local infection . bowel perforation . extensive fistulas . intestinal obstruction . recent intestinal anastomoses\nCAUTIONS\n▶ With rectal use Systemic absorption may occur with rectal preparations\n▶ With systemic use Duchenne’s muscular dystrophy (possible transient rhabdomyolysis and myoglobinuria following strenuous physical activity). systemic sclerosis (increased incidence of scleroderma renal crisis with a daily dose of 15 mg or more)\nINTERACTIONS → Appendix 1: corticosteroids\nSIDE-EFFECTS\n▶ With intramuscular use Diarrhoea . dizziness . hiccups . Kaposi’s sarcoma . myocardial rupture (following recent myocardial infarction). scleroderma renal crisis . vomiting\n▶ With oral use Diarrhoea . dizziness . dyslipidaemia . lipomatosis . protein catabolism . scleroderma renal crisis\nPREGNANCY As it crosses the placenta 88% of prednisolone is inactivated.\nMonitoring ▶ With systemic use Pregnant women with fluid retention should be monitored closely.\nBREAST FEEDING Prednisolone appears in small amounts in breast milk but maternal doses of up to 40 mg daily are unlikely to cause systemic effects in the infant.\nMonitoring ▶ With systemic use Infant should be monitored for adrenal suppression if mother is taking a dose higher than 40 mg.\nMONITORING REQUIREMENTS\n▶ With systemic use Manufacturer advises monitor blood pressure and renal function (s-creatinine) routinely in patients with systemic sclerosis—increased incidence of scleroderma renal crisis`,
    conditions: [
      {
        label: 'Acute asthma (child 1mo–11y)',
        baseDose: 2,
        unit: 'mg/kg',
        patientType: 'child',
        note: '2 mg/kg once daily (max 60 mg) for up to 3 days',
      },
      {
        label: 'Acute asthma (child 1mo–11y, lower range)',
        baseDose: 1,
        unit: 'mg/kg',
        patientType: 'child',
        note: '1–2 mg/kg once daily (max 40 mg) for up to 3 days',
      },
      {
        label: 'Acute asthma (12–17y)',
        baseDose: 45,
        unit: 'mg',
        patientType: 'adolescent',
        note: '40–50 mg daily for at least 5 days',
      },
      {
        label: 'Acute asthma (adult)',
        baseDose: 45,
        unit: 'mg',
        patientType: 'adult',
        note: '40–50 mg daily for at least 5 days',
      }
    ],
  },
  { name: 'Amoxicillin', info: 'Broad-spectrum penicillin antibiotic.', calc: { baseDose: 20, unit: 'mg/kg' } },
  { name: 'Ceftriaxone', info: 'Third-generation cephalosporin.', calc: { baseDose: 50, unit: 'mg/kg' } },
  // ...add all drugs here
];


export default function DrugReferenceScreen() {
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const openDrug = (drug: any) => {
    setSelectedDrug(drug);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedDrug(null);
  };

  // Dynamic colors
  const bg = isDark ? '#181a20' : '#f4f7fb';
  const headerBg = 'transparent';
  const headerColor = isDark ? '#90caf9' : '#1976d2';
  const itemBg = 'transparent';
  const itemPressed = isDark ? '#22304a' : '#e3f2fd';
  const textColor = isDark ? '#fff' : '#1976d2';
  const separatorColor = isDark ? '#23262f' : '#e3eaf2';
  const inputBg = isDark ? '#23262f' : '#f4f7fb';
  const inputText = isDark ? '#fff' : '#222';
  const inputBorder = isDark ? '#333' : '#ccc';

  const filteredDrugs = DRUGS.filter(d => d.name.toLowerCase().includes(search.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={[styles.outer, { backgroundColor: bg }]}> 
      <View style={[styles.stickyHeader, { backgroundColor: headerBg, borderColor: 'transparent', shadowColor: 'transparent', elevation: 0 }]}> 
        <Text style={[styles.header, { color: headerColor, textAlign: 'left' }]}>Drug Reference</Text>
        <TextInput
          style={[styles.searchBar, { backgroundColor: inputBg, color: inputText, borderColor: inputBorder }]}
          placeholder="Search drugs..."
          placeholderTextColor={isDark ? '#888' : '#888'}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
  data={filteredDrugs}
  keyExtractor={item => item.name}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => openDrug(item)}
            style={({ pressed }) => [
              styles.listItem,
              { backgroundColor: itemBg, borderWidth: 0 },
              pressed && { backgroundColor: itemPressed },
            ]}
            android_ripple={{ color: isDark ? '#22304a' : '#e3f2fd' }}
          >
            <Text style={[styles.drugName, { color: textColor, textAlign: 'left' }]}>{item.name}</Text>
          </Pressable>
        )}
        ItemSeparatorComponent={() => <View style={[styles.separator, { backgroundColor: separatorColor }]} />}
      />
      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
        {selectedDrug && (
          <DrugModal drug={selectedDrug} onClose={closeModal} />
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    marginTop: 10,
    marginBottom: 10,
    marginHorizontal: 0,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    alignSelf: 'stretch',
  },
  outer: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  stickyHeader: {
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? 36 : 20,
    paddingBottom: 12,
    borderBottomWidth: 0,
    borderColor: 'transparent',
    zIndex: 2,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: 0 },
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1976d2',
    letterSpacing: 0.5,
    textAlign: 'left',
  },
  // listWrapper removed
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  listItem: {
    paddingVertical: 0,
    paddingHorizontal: 28,
    backgroundColor: 'transparent',
    borderWidth: 0,
    justifyContent: 'center',
  },
  listItemPressed: {
    backgroundColor: '#e3f2fd',
  },
  drugName: {
    fontSize: 19,
    color: '#1976d2',
    fontWeight: '600',
    letterSpacing: 0.2,
    textAlign: 'left',
  },
  separator: {
    height: 0,
    backgroundColor: 'transparent',
    marginLeft: 28,
    marginRight: 0,
  },
});
