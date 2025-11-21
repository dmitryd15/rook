import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useTheme } from '../../context/ThemeContext';
// Remove this line if expo-linear-gradient is not installed
// import { LinearGradient } from 'expo-linear-gradient';
import Schedule from '@/components/schedule';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  const { theme, setTheme } = useTheme();
  // const { logout } = useAuth();
  const [time, setTime] = useState(new Date());
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [upcomingShift, setUpcomingShift] = useState<null | {
    ward: string;
    shiftStart: string;
    shiftEnd: string;
  }>(null);

  // Real-time pending tasks count from AsyncStorage (same as todo page)
  const updatePendingCount = useCallback(async () => {
    let count = 0;
    try {
      const keys = await AsyncStorage.getAllKeys();
      const patientKeys = keys.filter(k => k.startsWith('patient_'));
      const stores = await AsyncStorage.multiGet(patientKeys);
      for (const [, value] of stores) {
        if (value) {
          const data = JSON.parse(value);
          if (Array.isArray(data.todos)) {
            count += data.todos.filter((t: any) => !t.completed).length;
          }
        }
      }
    } catch {}
    setPendingCount(count);
  }, []);

  useFocusEffect(
    useCallback(() => {
      updatePendingCount();
      const interval = setInterval(updatePendingCount, 5000);
      return () => clearInterval(interval);
    }, [updatePendingCount])
  );
  const [rotationToday, setRotationToday] = useState<null | {
  ward: string;
  shiftStart: string;
  shiftEnd: string;
  calendarEventId?: string;
  }>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [accountHolderName, setAccountHolderName] = useState(''); // <-- use state for name
  const navigation = useNavigation();
  const route = useRoute();

  // Fetch account holder name from AsyncStorage (used in settings)
  useEffect(() => {
    const fetchName = async () => {
      try {
        const userRaw = await AsyncStorage.getItem('user');
        if (userRaw) {
          const user = JSON.parse(userRaw);
          setAccountHolderName(user.name || '');
        } else {
          setAccountHolderName('');
        }
      } catch {
        setAccountHolderName('');
      }
    };
    fetchName();
  }, []);

  // --- Medical facts array ---
  const medicalFacts: string[] = [
    "Aspirin in children with viral illness can cause Reye’s syndrome; avoid.",
    "Chlorpromazine can cause corneal deposits; monitor eyes with long-term use.",
    "Haloperidol can cause extrapyramidal symptoms; monitor for dystonia and parkinsonism.",
    "Olanzapine can cause weight gain; monitor BMI regularly.",
    "Risperidone can cause hyperprolactinemia; monitor prolactin if symptomatic.",
    "Quetiapine can cause sedation; caution in elderly patients.",
    "Ziprasidone prolongs QT interval; obtain baseline ECG.",
    "Aripiprazole has lower metabolic risk; useful in obese patients.",
    "Buspirone is a non-benzodiazepine anxiolytic; avoid with MAOIs.",
    "Diazepam is a benzodiazepine; risk of dependence with prolonged use.",
    "Lorazepam is safer in liver disease; preferred in elderly.",
    "Midazolam is a short-acting benzodiazepine; monitor for respiratory depression.",
    "Zolpidem is a non-benzodiazepine hypnotic; caution with next-day sedation.",
    "Ramelteon is a melatonin receptor agonist; low abuse potential.",
    "Morphine causes histamine release; may cause hypotension and pruritus.",
    "Fentanyl is highly potent; avoid in opioid-naïve patients.",
    "Codeine is a prodrug activated by CYP2D6; avoid in ultra-rapid metabolizers.",
    "Methadone can prolong QT interval; monitor ECG during long-term use.",
    "Buprenorphine is a partial opioid agonist; can precipitate withdrawal if given with full agonists.",
    "Naloxone is an opioid antagonist; short half-life may require repeat dosing.",
    "Naltrexone is used for opioid and alcohol dependence; avoid in acute hepatitis.",
    "Acetaminophen overdose causes hepatotoxicity; treat with N-acetylcysteine.",
    "Ibuprofen is an NSAID that can cause renal impairment; avoid in dehydration.",
    "Naproxen has longer half-life than ibuprofen; increased GI risk.",
    "Celecoxib is a COX-2 inhibitor; avoid in sulfa allergy.",
    "Atenolol is a selective beta-1 blocker that should be used cautiously in diabetics as it can mask hypoglycemia symptoms.",
    "Rifampin induces hepatic enzymes, decreasing the efficacy of oral contraceptives.",
    "Amikacin is an aminoglycoside that can cause ototoxicity and nephrotoxicity.",
    "Verapamil can exacerbate heart block in patients with conduction abnormalities.",
    "Captopril can cause a persistent dry cough due to increased bradykinin levels.",
    "Zidovudine is associated with bone marrow suppression, leading to anemia and neutropenia.",
    "Diltiazem is both a calcium channel blocker and antianginal agent, also used in rate control for atrial fibrillation.",
    "Piperacillin-tazobactam is a broad-spectrum antibiotic effective against Pseudomonas aeruginosa.",
    "Methyldopa is safe for use in hypertension during pregnancy but can cause hemolytic anemia.",
    "Furosemide increases calcium excretion, making it useful in hypercalcemia management.",
    "Ipratropium is an inhaled anticholinergic used for COPD, not for acute asthma relief.",
    "Linezolid can cause serotonin syndrome when combined with SSRIs.",
    "Metformin should be withheld before contrast dye administration due to risk of lactic acidosis.",
    "Phenytoin induces CYP450 enzymes, reducing effectiveness of many drugs.",
    "Lactulose traps ammonia in the gut, useful in hepatic encephalopathy.",
    "Nifedipine is a dihydropyridine calcium channel blocker causing reflex tachycardia.",
    "Colchicine can cause dose-dependent diarrhea as a common side effect.",
    "Indomethacin can close a patent ductus arteriosus in neonates.",
    "Erythromycin prolongs the QT interval, increasing risk for torsades de pointes.",
    "Diazepam is long-acting and should be avoided in elderly due to fall risk.",
    "Spironolactone is potassium-sparing and can cause gynecomastia in men.",
    "Allopurinol inhibits xanthine oxidase, preventing uric acid formation.",
    "Glipizide can cause hypoglycemia, especially in elderly or those with irregular eating habits.",
    "Diphenhydramine has strong sedative effects due to CNS penetration.",
    "Clonidine withdrawal can lead to rebound hypertension.",
    "Ceftriaxone is excreted via the biliary route and can cause biliary sludging in neonates.",
    "Probenecid inhibits renal excretion of penicillin, prolonging its action.",
    "Ranitidine reduces gastric acid by blocking H2 receptors in the stomach lining.",
    "Tamsulosin is selective for alpha-1A receptors in the prostate, reducing BPH symptoms without significant blood pressure drop.",
    "Acyclovir can cause crystalluria if not adequately hydrated.",
    "Clozapine carries risk for agranulocytosis, requiring regular CBC monitoring.",
    "Valproic acid can cause hepatotoxicity, especially in children under two.",
    "Ketorolac should not be used for more than 5 days due to GI and renal toxicity risk.",
    "Amphotericin B causes significant nephrotoxicity via renal vasoconstriction.",
    "Azithromycin has a long half-life, allowing once-daily dosing.",
    "Levothyroxine absorption is reduced by iron and calcium supplements.",
    "Omeprazole inhibits CYP2C19, affecting metabolism of clopidogrel.",
    "Bisoprolol is cardioselective and useful in heart failure with reduced ejection fraction.",
    "Trimethoprim-sulfamethoxazole can cause Stevens–Johnson syndrome.",
    "Minocycline causes blue-gray discoloration of the skin with long-term use.",
    "Propofol infusion syndrome is rare but potentially fatal, involving metabolic acidosis and cardiac failure.",
    "Lorazepam is preferred in liver impairment due to minimal hepatic metabolism.",
    "Selegiline is an MAO-B inhibitor used in Parkinson’s disease.",
    "Clopidogrel is a prodrug requiring CYP2C19 activation.",
    "Methotrexate can cause folate deficiency and megaloblastic anemia.",
    "Pioglitazone is contraindicated in patients with heart failure due to fluid retention.",
    "Sucralfate forms a protective barrier on ulcers but should not be given with antacids.",
    "Oxytocin can cause water intoxication due to ADH-like effects.",
    "Salmeterol should not be used as monotherapy in asthma due to increased risk of death.",
    "Warfarin’s effect is monitored by INR, with a therapeutic range usually 2–3.",
    "Nitroglycerin requires a nitrate-free interval to prevent tolerance.",
    "Digoxin toxicity is more likely with hypokalemia.",
    "Terbinafine can cause hepatotoxicity, requiring liver function monitoring.",
    "Chlorpromazine can cause photosensitivity reactions.",
    "Theophylline levels are increased by ciprofloxacin due to CYP1A2 inhibition.",
    "Amiodarone can cause thyroid dysfunction due to high iodine content.",
    "Clindamycin is associated with C. difficile colitis.",
    "Imipenem is given with cilastatin to prevent renal metabolism.",
    "Penicillin allergy can cross-react with cephalosporins in 5–10% of patients.",
    "Gabapentin is renally excreted and requires dose adjustment in CKD.",
    "Raloxifene acts as estrogen agonist in bone, antagonist in breast/uterus.",
    "Pravastatin is not extensively metabolized by CYP450, reducing drug interactions.",
    "Mannitol is contraindicated in active intracranial bleeding.",
    "Hydroxychloroquine can cause retinal toxicity with prolonged use.",
    "Desmopressin is used in central diabetes insipidus and von Willebrand disease type 1.",
    "Eplerenone is more selective than spironolactone, reducing gynecomastia risk.",
    "Pregabalin can cause weight gain and peripheral edema.",
    "Doxorubicin causes dose-dependent cardiomyopathy via free radical damage.",
    "Cisplatin can cause ototoxicity and nephrotoxicity, preventable with amifostine.",
    "Vincristine causes peripheral neuropathy but little bone marrow suppression.",
    "Paclitaxel stabilizes microtubules, preventing cell division.",
    "Bleomycin causes pulmonary fibrosis as a dose-limiting toxicity.",
    "Etanercept increases risk for reactivation of latent tuberculosis.",
    "Anastrozole is an aromatase inhibitor used in postmenopausal breast cancer.",
    "Methimazole is preferred over propylthiouracil except in first trimester pregnancy.",
    "Levonorgestrel is used as emergency contraception within 72 hours of unprotected sex.",
    "Mifepristone is a progesterone receptor antagonist used with misoprostol for medical abortion.",
    "Misoprostol is contraindicated in pregnancy when used for gastric ulcer prevention.",
    "Loperamide is an opioid receptor agonist acting on the gut with no CNS effects.",
    "Octreotide is used to control variceal bleeding by reducing splanchnic blood flow.",
    "Clozapine is the only antipsychotic proven to reduce suicide risk in schizophrenia, but requires regular blood monitoring due to agranulocytosis risk.",
    "Lidocaine, when given IV, can suppress ventricular arrhythmias but in toxic doses can cause seizures.",
    "Amiodarone contains iodine and can cause both hypo- and hyperthyroidism.",
    "Ketamine causes dissociative anesthesia and can increase blood pressure, unlike most anesthetics.",
    "Nitroglycerin loses potency quickly if stored improperly due to volatility.",
    "Aspirin irreversibly inhibits COX enzymes, so platelet function only recovers after new platelets form (~7–10 days).",
    "Vancomycin can cause “red man syndrome” if infused too quickly due to histamine release.",
    "Propofol is lipid-based, giving it a milky appearance; it can cause hypotension and respiratory depression.",
    "Heparin-induced thrombocytopenia paradoxically increases risk of clotting, not bleeding.",
    "Digoxin toxicity can cause xanthopsia — yellow-green vision.",
    "Metformin can cause lactic acidosis, especially in renal failure.",
    "Rifampin turns urine, sweat, and tears orange.",
    "Statins work best when taken at night because cholesterol synthesis is highest during sleep.",
    "Beta blockers can mask hypoglycemia symptoms in diabetics.",
    "Phenytoin follows zero-order kinetics at high doses — a small dose increase can cause toxicity.",
    "Cyclophosphamide can cause hemorrhagic cystitis, preventable with mesna.",
    "ACE inhibitors cause a dry cough due to bradykinin accumulation.",
    "SSRIs can cause sexual dysfunction in both men and women.",
    "Atropine dilates pupils and can precipitate acute angle-closure glaucoma in predisposed patients.",
    "Aminoglycosides can cause ototoxicity and nephrotoxicity — both risks increase with loop diuretics.",
    "Warfarin’s effect is monitored with INR, but it’s also influenced by vitamin K intake.",
    "Ethambutol can cause optic neuritis, leading to red-green color blindness.",
    "Sildenafil was initially developed for angina before its erectile dysfunction effect was discovered.",
    "Diazepam has a very long half-life due to active metabolites.",
    "Methadone is long-acting and used for opioid maintenance therapy, but prolongs QT interval.",
    "Chloramphenicol can cause “gray baby syndrome” in neonates due to immature liver metabolism.",
    "Allopurinol inhibits xanthine oxidase and can increase azathioprine toxicity.",
    "Mannitol, an osmotic diuretic, can worsen pulmonary edema in heart failure.",
    "Isotretinoin is teratogenic even at very small doses.",
    "Clozapine can cause severe constipation leading to bowel obstruction.",
    "Erythromycin can cause severe GI upset due to motilin receptor activation.",
    "Furosemide can cause metabolic alkalosis and hypokalemia.",
    "Spironolactone can cause gynecomastia due to anti-androgen effects.",
    "Lithium levels rise dangerously with dehydration or NSAID use.",
    "Methotrexate inhibits dihydrofolate reductase and is used in low doses for rheumatoid arthritis.",
    "Buspirone is an anxiolytic without sedation or addiction potential, but takes weeks to work.",
    "Daptomycin is inactivated by lung surfactant and thus useless for pneumonia.",
    "Zidovudine can cause macrocytic anemia in HIV patients.",
    "Ginkgo biloba can increase bleeding risk when combined with anticoagulants.",
    "Tacrolimus and cyclosporine cause nephrotoxicity via vasoconstriction of renal arterioles.",
    "Carbamazepine can cause SIADH, leading to hyponatremia.",
    "Omeprazole can increase risk of Clostridioides difficile infection.",
    "Propranolol can worsen asthma by blocking β2 receptors in the lungs.",
    "Haloperidol can cause acute dystonia within hours of the first dose.",
    "Naltrexone blocks opioid receptors and reduces alcohol craving.",
    "Aspirin toxicity can cause mixed respiratory alkalosis and metabolic acidosis.",
    "Isoniazid can cause peripheral neuropathy, preventable with vitamin B6.",
    "Amphotericin B can cause severe infusion reactions with chills and fever.",
    "Sulfonylureas increase insulin secretion regardless of glucose level — risking hypoglycemia.",
    "NSAIDs can worsen kidney function by inhibiting prostaglandin-mediated vasodilation in afferent arterioles.",
    "Colchicine treats acute gout but can cause severe diarrhea.",
    "Bupropion lowers seizure threshold but causes minimal sexual side effects.",
    "Nitrous oxide can inactivate vitamin B12 with prolonged exposure.",
    "Hydralazine is safe in pregnancy but can cause lupus-like syndrome.",
    "Theophylline toxicity can cause seizures and fatal arrhythmias.",
    "Acetaminophen overdose depletes glutathione, leading to hepatic necrosis.",
    "Penicillin allergy cross-reacts with cephalosporins in ~10% of patients.",
    "Gentamicin, an aminoglycoside, binds to the 30S ribosomal subunit causing misreading of mRNA; ototoxicity and nephrotoxicity are notable risks, especially with loop diuretics.",
    "Metronidazole causes DNA strand breaks in anaerobes and certain protozoa; alcohol ingestion during therapy can cause a disulfiram-like reaction.",
    "Clindamycin inhibits the 50S ribosomal subunit, suppressing protein synthesis; it’s notorious for causing C. difficile colitis.",
    "Linezolid is an oxazolidinone antibiotic that inhibits bacterial protein synthesis by preventing 50S/30S complex formation; can cause serotonin syndrome if combined with SSRIs.",
    "Aztreonam, a monobactam, is effective against gram-negative aerobes and safe in penicillin-allergic patients due to no cross-reactivity.",
    "Daptomycin disrupts bacterial cell membranes by creating ion channels; it is inactivated by pulmonary surfactant and thus ineffective for pneumonia.",
    "Tigecycline, a glycylcycline, is a broad-spectrum agent useful in multi-drug-resistant infections; binds the 30S subunit but is more resistant to efflux pumps than tetracyclines.",
    "Amphotericin B binds ergosterol in fungal membranes, forming pores that leak ions; infusion can cause chills and hypotension (“shake and bake” reaction).",
    "Voriconazole inhibits fungal ergosterol synthesis via cytochrome P450-dependent 14α-demethylase; visual disturbances are a unique side effect.",
    "Caspofungin, an echinocandin, inhibits β-(1,3)-D-glucan synthesis, disrupting fungal cell wall; active against Candida and Aspergillus.",
    "Flucytosine is converted to 5-fluorouracil inside fungal cells, inhibiting DNA/RNA synthesis; often combined with amphotericin B for cryptococcal meningitis.",
    "Oseltamivir is a neuraminidase inhibitor that prevents release of influenza virions; must be given within 48 hours of symptom onset for best effect.",
    "Acyclovir is phosphorylated by viral thymidine kinase, inhibiting HSV/VZV DNA polymerase; crystalluria can occur if patient is dehydrated.",
    "Ribavirin inhibits inosine monophosphate dehydrogenase, reducing guanosine triphosphate synthesis; used for RSV and hepatitis C (in combination).",
    "Sofosbuvir inhibits HCV RNA-dependent RNA polymerase; it must be used with other antivirals to prevent resistance.",
    "Remdesivir, developed for Ebola, is a nucleotide analog that inhibits viral RNA polymerase; authorized for COVID-19 in certain settings.",
    "Ivermectin binds to glutamate-gated chloride channels in parasites, causing paralysis and death; used for onchocerciasis (“river blindness”).",
    "Praziquantel increases calcium permeability in trematodes and cestodes, causing spastic paralysis; used for schistosomiasis.",
    "Mebendazole inhibits microtubule synthesis in helminths; best absorbed with fatty food.",
    "Isotretinoin is a retinoid used for severe nodulocystic acne; teratogenic, requiring strict pregnancy prevention (iPLEDGE program).",
    "Doxycycline binds the 30S ribosome, inhibiting protein synthesis; it chelates calcium and can stain teeth in children.",
    "Minocycline has good CNS penetration among tetracyclines and is sometimes used for acne due to lipophilicity.",
    "Chloramphenicol inhibits the 50S ribosomal peptidyl transferase; causes gray baby syndrome due to immature UDP-glucuronyl transferase.",
    "Rifampin inhibits bacterial DNA-dependent RNA polymerase; it induces cytochrome P450 enzymes, reducing efficacy of oral contraceptives.",
    "Rifabutin has similar activity to rifampin but less P450 induction, making it preferred in HIV patients on protease inhibitors.",
    "Isoniazid inhibits mycolic acid synthesis in Mycobacterium tuberculosis; neurotoxicity is prevented with pyridoxine (vitamin B6).",
    "Pyrazinamide is converted to pyrazinoic acid in acidic environments, disrupting mycobacterial cell membrane metabolism.",
    "Ethambutol inhibits arabinosyl transferase, impairing mycobacterial cell wall; optic neuritis is a key side effect.",
    "Streptomycin, an aminoglycoside, was one of the first effective TB drugs but is now reserved for resistant cases due to toxicity.",
    "Penicillin G is active against gram-positive cocci and some gram-negative cocci; destroyed by gastric acid, so given IV/IM.",
    "Benzathine penicillin is a long-acting IM form, used in syphilis.",
    "Nafcillin is penicillinase-resistant due to bulky side chains; useful for MSSA.",
    "Piperacillin has broad coverage including Pseudomonas, but is penicillinase-sensitive and requires a β-lactamase inhibitor.",
    "Amoxicillin has better oral bioavailability than ampicillin and covers some gram-negative organisms.",
    "Ampicillin is associated with rash when given during mononucleosis.",
    "Cephalexin is a first-generation cephalosporin with activity against gram-positive cocci and E. coli.",
    "Ceftriaxone, a third-generation cephalosporin, penetrates the CNS and is used for meningitis and gonorrhea.",
    "Ceftazidime covers Pseudomonas but has less gram-positive coverage.",
    "Cefepime, a fourth-generation cephalosporin, has broad gram-positive and gram-negative coverage, including Pseudomonas.",
    "Ceftaroline is a fifth-generation cephalosporin that binds penicillin-binding proteins, including PBP2a, allowing MRSA coverage; it retains activity against many gram-negative pathogens.",
    "Imipenem is a carbapenem that inhibits bacterial cell wall synthesis; it’s combined with cilastatin to block renal dehydropeptidase and prevent drug inactivation.",
    "Meropenem, a carbapenem, is stable to renal dehydropeptidase and avoids the seizures sometimes seen with imipenem.",
    "Ertapenem is a long-acting carbapenem given once daily; it lacks activity against Pseudomonas and Acinetobacter.",
    "Zanamivir inhibits influenza neuraminidase, blocking virion release; inhaled form may cause bronchospasm in asthmatics.",
    "Baloxavir marboxil inhibits influenza cap-dependent endonuclease, blocking viral mRNA synthesis; single-dose therapy is effective.",
    "Acyclovir is phosphorylated by viral thymidine kinase, then inhibits viral DNA polymerase; can cause crystalline nephropathy if not hydrated.",
    "Valacyclovir is the prodrug of acyclovir with better oral bioavailability; shares nephrotoxicity risk.",
    "Ganciclovir inhibits CMV DNA polymerase after activation by viral kinase; dose-limiting effect is bone marrow suppression.",
    "Valganciclovir is an oral prodrug of ganciclovir; shares myelosuppression and teratogenic risks.",
    "Foscarnet directly inhibits viral DNA polymerase and reverse transcriptase; nephrotoxicity and electrolyte disturbances are common.",
    "Cidofovir inhibits viral DNA polymerase without requiring viral kinase activation; probenecid is co-administered to reduce nephrotoxicity.",
    "Ribavirin inhibits inosine monophosphate dehydrogenase, depleting GTP; teratogenic and contraindicated in pregnancy.",
    "Sofosbuvir inhibits HCV NS5B RNA-dependent RNA polymerase, preventing viral replication; headache and fatigue are common.",
    "Ledipasvir inhibits HCV NS5A, blocking replication and assembly; well-tolerated but may cause fatigue.",
    "Remdesivir is an adenosine analog that inhibits viral RNA-dependent RNA polymerase; approved for severe COVID-19.",
    "Lamivudine inhibits HIV reverse transcriptase by acting as a cytidine analog; well-tolerated but resistance develops quickly if used alone.",
    "Emtricitabine is a cytidine analog NRTI with once-daily dosing; can cause hyperpigmentation of palms/soles.",
    "Zidovudine (AZT) inhibits HIV reverse transcriptase; bone marrow suppression is dose-limiting.",
    "Abacavir is a guanosine analog NRTI; hypersensitivity reaction occurs in HLA-B*5701-positive patients.",
    "Tenofovir inhibits HIV reverse transcriptase as an adenosine analog; can cause renal toxicity and decreased bone density.",
    "Efavirenz is an NNRTI that binds HIV reverse transcriptase noncompetitively; vivid dreams and CNS effects are notable.",
    "Nevirapine is an NNRTI with risk of severe hepatotoxicity and rash, including Stevens-Johnson syndrome.",
    "Ritonavir is a protease inhibitor and strong CYP3A4 inhibitor; causes GI upset and hypertriglyceridemia.",
    "Lopinavir inhibits HIV protease, preventing viral polyprotein cleavage; boosted with ritonavir for higher levels.",
    "Atazanavir is a protease inhibitor causing indirect hyperbilirubinemia and jaundice without liver injury.",
    "Enfuvirtide binds gp41, blocking HIV fusion with host cell membrane; injection site reactions are common.",
    "Maraviroc binds CCR5 on host cells, preventing HIV gp120 attachment; only works for CCR5-tropic strains.",
    "Isoniazid inhibits mycolic acid synthesis in Mycobacterium tuberculosis; neurotoxicity prevented by pyridoxine.",
    "Rifampin inhibits DNA-dependent RNA polymerase in mycobacteria; induces CYP450 and colors body fluids orange.",
    "Ethambutol inhibits arabinosyl transferase, impairing mycobacterial cell wall synthesis; optic neuritis is a key risk.",
    "Pyrazinamide is converted to pyrazinoic acid, lowering mycobacterial pH; hepatotoxicity and hyperuricemia may occur.",
    "Streptomycin binds the 30S ribosomal subunit in mycobacteria; ototoxic and nephrotoxic.",
    "Bedaquiline inhibits mycobacterial ATP synthase; black-box warning for QT prolongation.",
    "Doxycycline binds the 30S ribosomal subunit, blocking tRNA attachment; contraindicated in children under 8 and pregnancy due to teeth discoloration.",
    "Minocycline is a tetracycline with high lipid solubility; vestibular toxicity can occur.",
    "Tetracycline chelates divalent cations, reducing absorption with milk or antacids; photosensitivity is common.",
    "Azithromycin binds the 50S ribosomal subunit, inhibiting translocation; long half-life allows once-daily dosing.",
    "Clarithromycin is a macrolide with CYP3A4 inhibition; metallic taste and QT prolongation are risks.",
    "Erythromycin increases GI motility via motilin receptor agonism; diarrhea is common.",
    "Chloramphenicol inhibits the 50S ribosomal subunit, blocking peptidyl transferase; risk of aplastic anemia and gray baby syndrome.",
    "Aztreonam is a monobactam that binds PBP3 in gram-negative aerobes, safe in severe β-lactam allergy due to minimal cross-reactivity.",
    "Vancomycin inhibits cell wall synthesis by binding D-Ala-D-Ala termini in peptidoglycan; rapid infusion can cause “red man syndrome.”",
    "Teicoplanin is a glycopeptide similar to vancomycin with longer half-life, permitting once-daily dosing for serious gram-positive infections.",
    "Daptomycin inserts into bacterial membranes, causing depolarization and cell death; it should not be used for pneumonia due to surfactant inactivation.",
    "Linezolid prevents formation of the 70S initiation complex in gram-positive bacteria; long courses may cause optic neuropathy and thrombocytopenia.",
    "Tedizolid is a newer oxazolidinone with once-daily dosing and similar MRSA activity as linezolid, but fewer gastrointestinal effects.",
    "Chloramphenicol inhibits the 50S ribosomal subunit’s peptidyltransferase activity; bone marrow suppression and gray baby syndrome limit its use.",
    "Clindamycin binds the 50S subunit, blocking peptide translocation; it is well-known for predisposing to C. difficile colitis.",
    "Azithromycin is a macrolide that binds the 50S ribosome, preventing protein synthesis; it has a long tissue half-life, allowing short-course therapy.",
    "Clarithromycin inhibits bacterial protein synthesis at the 50S subunit; it is active against H. pylori and interacts via CYP3A4 inhibition.",
    "Erythromycin, an older macrolide, stimulates motilin receptors, leading to prokinetic effects but also gastrointestinal cramps.",
    "Fidaxomicin is a macrocyclic antibiotic that inhibits RNA polymerase in C. difficile, offering narrow",
    "Vancomycin inhibits bacterial cell wall synthesis by binding D-Ala-D-Ala; red man syndrome can be prevented by slow infusion and antihistamines.",
    "Linezolid binds the 50S ribosomal subunit, preventing initiation complex formation; can cause serotonin syndrome when combined with SSRIs.",
    "Clindamycin inhibits the 50S ribosomal subunit; associated with C. difficile overgrowth.",
    "Daptomycin depolarizes bacterial cell membranes via potassium efflux; inactivated by pulmonary surfactant, so not used for pneumonia.",
    "Tetracyclines bind the 30S ribosomal subunit and block tRNA binding; contraindicated in children due to teeth discoloration.",
    "Chloramphenicol inhibits the 50S ribosomal subunit; gray baby syndrome occurs due to immature UDP-glucuronyl transferase.",
    "Gentamicin is an aminoglycoside that causes irreversible ototoxicity and nephrotoxicity; synergistic with β-lactams.",
    "Ceftriaxone, a third-generation cephalosporin, is used for gonorrhea, meningitis, and Lyme disease; biliary sludging is a possible side effect.",
    "Imipenem is a carbapenem β-lactam resistant to most β-lactamases; must be co-administered with cilastatin to prevent renal degradation.",
    "Aztreonam is a monobactam useful for Gram-negative infections in patients with penicillin allergy; no cross-reactivity with β-lactams.",
    "Metronidazole forms free radicals in anaerobes and protozoa; disulfiram-like reaction with alcohol.",
    "Isoniazid inhibits mycolic acid synthesis in M. tuberculosis; slow acetylators are at higher risk for neurotoxicity.",
    "Rifampin inhibits bacterial DNA-dependent RNA polymerase; induces CYP450 and turns body fluids orange.",
    "Ethambutol inhibits arabinosyltransferase in mycobacterial cell walls; optic neuritis with red-green color blindness is a risk.",
    "Pyrazinamide is active in acidic pH of macrophages; hepatotoxicity and hyperuricemia are common side effects.",
    "Albendazole binds β-tubulin in helminths, inhibiting microtubule polymerization; contraindicated in pregnancy.",
    "Praziquantel increases calcium permeability in trematodes and cestodes, causing paralysis and death.",
    "Chloroquine concentrates in parasite food vacuoles, preventing heme detoxification; resistance in P. falciparum is widespread.",
    "Artemether-lumefantrine is first-line for P. falciparum malaria in many regions; artemisinins produce free radicals inside the parasite.",
    "Amphotericin B binds ergosterol in fungal membranes, creating pores; nephrotoxicity is dose-limiting.",
    "Fluconazole inhibits fungal CYP450-dependent 14α-demethylase; drug of choice for Candida infections in immunocompetent hosts.",
    "Voriconazole is used for Aspergillus; visual disturbances and hallucinations may occur.",
    "Caspofungin inhibits fungal β-1,3-glucan synthesis, disrupting cell wall integrity.",
    "Nystatin binds ergosterol, forming pores; too toxic for systemic use, so used topically or as oral rinse for thrush.",
    "Ketoconazole inhibits steroid synthesis at high doses; gynecomastia may result.",
    "Aspirin irreversibly inhibits COX-1 and COX-2, decreasing TXA₂ and prostaglandins; causes Reye syndrome in children with viral illness.",
    "Clopidogrel blocks P2Y₁₂ ADP receptors on platelets, preventing activation of GPIIb/IIIa; used post-stent to prevent thrombosis.",
    "Heparin activates antithrombin III, decreasing factor IIa and Xa activity; protamine sulfate reverses its effects.",
    "Warfarin inhibits vitamin K epoxide reductase, decreasing factors II, VII, IX, X; reversed with vitamin K and PCC in bleeding emergencies.",
    "Dabigatran is a direct thrombin inhibitor; no need for INR monitoring, but reversed with idarucizumab.",
    "Alteplase converts plasminogen to plasmin, breaking fibrin clots; contraindicated in recent surgery or hemorrhagic stroke.",
    "Nitroglycerin releases NO in smooth muscle, increasing cGMP and causing vasodilation; tolerance develops with continuous use.",
    "Sildenafil inhibits PDE-5, increasing cGMP in corpus cavernosum; dangerous with nitrates due to severe hypotension.",
    "Propranolol is a non-selective β-blocker; contraindicated in asthma due to bronchoconstriction.",
    "Metoprolol is β₁-selective; overdose may be treated with glucagon.",
    "Verapamil blocks L-type calcium channels in the heart; constipation is a common side effect.",
    "Amlodipine is a dihydropyridine calcium channel blocker; causes peripheral edema.",
    "Furosemide inhibits Na-K-2Cl symporter in thick ascending limb; ototoxicity is possible.",
    "Hydrochlorothiazide inhibits Na-Cl symporter in DCT; causes hypercalcemia and hypokalemia.",
    "Spironolactone is an aldosterone antagonist; antiandrogenic effects include gynecomastia.",
    "Isoniazid inhibits mycolic acid synthesis in Mycobacterium tuberculosis; hepatotoxicity and peripheral neuropathy (preventable with pyridoxine) are key adverse effects.",
    "Rifampin inhibits bacterial DNA-dependent RNA polymerase; causes orange discoloration of body fluids and induces cytochrome P450 enzymes.",
    "Ethambutol inhibits arabinosyl transferase, impairing mycobacterial cell wall synthesis; can cause optic neuritis with red-green color blindness.",
    "Pyrazinamide is converted to pyrazinoic acid in acidic environments inside macrophages; hepatotoxicity and hyperuricemia are notable adverse effects.",
    "Acyclovir is phosphorylated by viral thymidine kinase, inhibiting viral DNA polymerase; crystalline nephropathy can occur if hydration is inadequate.",
    "Ganciclovir inhibits CMV DNA polymerase after phosphorylation by viral kinase; myelosuppression is a common dose-limiting effect.",
    "Foscarnet is a pyrophosphate analog that directly inhibits viral DNA polymerase; nephrotoxicity and electrolyte disturbances are major risks.",
    "Praziquantel increases calcium permeability in schistosomes and other flukes, causing paralysis; safe in most helminth infections except ocular cysticercosis.",
    "Albendazole binds β-tubulin in helminths, inhibiting microtubule formation; avoid in early pregnancy due to teratogenic risk.",
    "Mebendazole has the same mechanism as albendazole but with broader GI absorption issues; commonly used for pinworm and hookworm infections.",
    "Ivermectin binds glutamate-gated chloride channels in parasites, causing paralysis; widely used for onchocerciasis (“river blindness”).",
    "Atovaquone inhibits mitochondrial electron transport in protozoa and Pneumocystis; often combined with proguanil for malaria prophylaxis.",
    "Proguanil inhibits protozoal dihydrofolate reductase, impairing DNA synthesis; mild GI upset is the main side effect.",
    "Chloroquine concentrates in parasite food vacuoles, preventing heme detoxification; resistance is widespread in P. falciparum due to efflux pumps.",
    "Mefloquine disrupts parasite heme polymerization; neuropsychiatric effects limit its use in some patients.",
    "Artesunate generates free radicals within malaria parasites; safe in pregnancy and highly effective against severe falciparum malaria.",
    "Sulfadiazine inhibits dihydroteroate synthase in protozoa; used with pyrimethamine for toxoplasmosis but can cause crystalluria and hypersensitivity.",
    "Ranitidine was withdrawn in many countries due to NDMA contamination.",
    "SGLT2 inhibitors cause glycosuria, increasing risk of genital infections.",
    "Cisplatin can cause hearing loss, especially high-frequency.",
    "Prazosin can cause severe first-dose hypotension.",
    "Lamotrigine can cause Stevens-Johnson syndrome if titrated too quickly.",
    "Terfenadine, an old antihistamine, caused fatal arrhythmias and was removed from market.",
    "Glucagon can treat beta blocker overdose by increasing cAMP in the heart.",
    "Clofazimine can cause skin discoloration ranging from red to brown-black.",
    "Azithromycin has a very long tissue half-life, allowing short treatment courses.",
    "Thiazides reduce urinary calcium excretion, useful in kidney stone prevention.",
    "Misoprostol can induce abortion by causing uterine contractions.",
    "Flumazenil reverses benzodiazepine sedation but can trigger seizures in chronic users.",
    "Octreotide treats variceal bleeding by reducing portal blood flow.",
    "Minoxidil, a hair growth drug, was originally an antihypertensive.",
    "Desmopressin treats central diabetes insipidus by acting as a V2 receptor agonist.",
    "Valproic acid can cause neural tube defects in pregnancy.",
    "Orlistat causes oily stools by blocking fat absorption.",
    "Phenazopyridine turns urine bright orange-red.",
    "Ketorolac is a potent NSAID used for short-term severe pain — limited by GI bleeding risk.",
    "Levodopa’s effectiveness decreases over years due to progressive neuronal loss.",
    "Clozapine can cause myocarditis early in treatment.",
    "Methyldopa is safe in pregnancy and used for hypertension.",
    "Linezolid can cause serotonin syndrome if combined with SSRIs.",
    "Naloxone has a very short half-life — repeated dosing may be needed for long-acting opioids.",
  ];

  // Helper to add or update today's rotation in AsyncStorage
const setTodayRotation = async (ward, shiftStart, shiftEnd) => {
  const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  let timetable = [];
  try {
    const timetableRaw = await AsyncStorage.getItem('timetable');
    if (timetableRaw) {
      timetable = JSON.parse(timetableRaw);
    }
  } catch {}
  // Remove any existing entry for today
  timetable = timetable.filter((entry) => !(entry.date && entry.date.startsWith(todayStr)));
  // Add new entry for today
  timetable.push({ date: todayStr, ward, shiftStart, shiftEnd });
  await AsyncStorage.setItem('timetable', JSON.stringify(timetable));
};

  // Helper to get a random fact index different from the current one
  const getRandomFactIndex = useCallback(() => {
    if (medicalFacts.length <= 1) return 0;
    let idx = Math.floor(Math.random() * medicalFacts.length);
    // Avoid repeating the same fact
    if (idx === factIndex) idx = (idx + 1) % medicalFacts.length;
    return idx;
  }, [medicalFacts.length, factIndex]);

  // Load fact index from storage or set new on mount (app open)
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('medicalFactIndex');
      const storedTime = await AsyncStorage.getItem('medicalFactTime');
      const now = Date.now();
      if (stored && storedTime) {
        const elapsed = now - Number(storedTime);
        if (elapsed > 30 * 60 * 1000) {
          // More than 30 min passed, pick new fact
          const idx = getRandomFactIndex();
          setFactIndex(idx);
          await AsyncStorage.setItem('medicalFactIndex', String(idx));
          await AsyncStorage.setItem('medicalFactTime', String(now));
        } else {
          setFactIndex(Number(stored));
        }
      } else {
        // First launch, pick random
        const idx = getRandomFactIndex();
        setFactIndex(idx);
        await AsyncStorage.setItem('medicalFactIndex', String(idx));
        await AsyncStorage.setItem('medicalFactTime', String(now));
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only on mount

  // Timer to refresh fact every 30 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const idx = getRandomFactIndex();
      setFactIndex(idx);
      await AsyncStorage.setItem('medicalFactIndex', String(idx));
      await AsyncStorage.setItem('medicalFactTime', String(Date.now()));
    }, 30 * 60 * 1000); // 30 minutes
    return () => clearInterval(interval);
  }, [getRandomFactIndex]);

  // Handler for refresh button
  const handleRefresh = async () => {
    const idx = getRandomFactIndex();
    setFactIndex(idx);
    await AsyncStorage.setItem('medicalFactIndex', String(idx));
    await AsyncStorage.setItem('medicalFactTime', String(Date.now()));
    await fetchRotationToday(); // instantly refresh rotation
    setTime(new Date()); // instantly refresh time
  };

  // Fetch today's rotation from device calendar
  const fetchRotationToday = useCallback(async () => {
    try {
      const scheduleRaw = await AsyncStorage.getItem('schedule_list');
      if (!scheduleRaw) {
        setRotationToday(null);
        setUpcomingShift(null);
        return;
      }
      const schedule = JSON.parse(scheduleRaw);
      const today = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
      // Get all rotations for today
      const todaysRotations = schedule.filter(
        (entry: any) => entry.type === 'rotation' && entry.date === todayStr
      );
      let latest = null;
      if (todaysRotations.length > 0) {
        // Prefer the one with the latest createdAt, else last in array
        latest = todaysRotations.reduce((a: any, b: any) => {
          if (a && b && a.createdAt && b.createdAt) {
            return a.createdAt > b.createdAt ? a : b;
          }
          return b;
        });
      }
      if (latest) {
        setRotationToday({
          ward: latest.ward,
          shiftStart: latest.start || latest.shiftStart || '',
          shiftEnd: latest.end || latest.shiftEnd || '',
        });

        // --- Find next day's shift for Upcoming Shift ---
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowStr = `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}`;
        const tomorrowRotations = schedule
          .filter((entry: any) => entry.type === 'rotation' && entry.date === tomorrowStr)
          .sort((a: any, b: any) => {
            // Sort by start time if available
            const aStart = a.start || a.shiftStart || '';
            const bStart = b.start || b.shiftStart || '';
            return aStart.localeCompare(bStart);
          });
        if (tomorrowRotations.length > 0) {
          const next = tomorrowRotations[0];
          setUpcomingShift({
            ward: next.ward,
            shiftStart: next.start || next.shiftStart || '',
            shiftEnd: next.end || next.shiftEnd || '',
          });
        } else {
          setUpcomingShift(null);
        }
      } else {
        // No shift for today: look for the next shift in the future
        const now = new Date();
        const futureRotations = schedule
          .filter((entry: any) => entry.type === 'rotation')
          .map((entry: any) => {
            const [h, m, ampm] = (entry.start || entry.shiftStart || '').match(/(\d{1,2}):(\d{2}) ?([AP]M)?/i) || [];
            let hour = h ? parseInt(h, 10) : 0;
            let min = m ? parseInt(m, 10) : 0;
            if (ampm) {
              if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12;
              if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0;
            }
            const startDate = new Date(entry.date + 'T00:00:00');
            startDate.setHours(hour, min, 0, 0);
            return { ...entry, startDate };
          })
          .filter((entry: any) => entry.startDate > now)
          .sort((a: any, b: any) => a.startDate.getTime() - b.startDate.getTime());
        if (futureRotations.length > 0) {
          const next = futureRotations[0];
          setUpcomingShift({
            ward: next.ward,
            shiftStart: next.start || next.shiftStart || '',
            shiftEnd: next.end || next.shiftEnd || '',
          });
        } else {
          setUpcomingShift(null);
        }
        setRotationToday(null);
      }
    } catch {
      setRotationToday(null);
      setUpcomingShift(null);
    }
  }, []);

  // --- Real-time sync: update rotation on focus, on schedule_list changes, and every second ---
  useFocusEffect(
    useCallback(() => {
      fetchRotationToday();
      // Listen for navigation events to refresh on return
      const unsubscribe = navigation.addListener('focus', () => {
        fetchRotationToday();
      });
      // Listen for changes to schedule_list in AsyncStorage
      const origSetItem = AsyncStorage.setItem;
      AsyncStorage.setItem = async function(key, value, ...args) {
        const result = await origSetItem.apply(this, [key, value, ...args]);
        if (key === 'schedule_list') {
          fetchRotationToday();
        }
        return result;
      };
      // Live polling every second for real-time sync
      const interval = setInterval(fetchRotationToday, 1000);
      return () => {
        unsubscribe();
        AsyncStorage.setItem = origSetItem;
        clearInterval(interval);
      };
    }, [fetchRotationToday, navigation])
  );

  // Fetch pending tasks count from AsyncStorage (same as ToDoPage)
  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const todoData = await AsyncStorage.getItem('todos');
        const todos = todoData ? JSON.parse(todoData) : [];
        // Count items where status is 'pending', 'not done', or 'incomplete' (case-insensitive)
        const pending = todos.filter(
          (t: any) =>
            t.status &&
            ['pending', 'not done', 'incomplete'].includes(
              String(t.status).trim().toLowerCase()
            )
        ).length;
        setPendingCount(pending);
      } catch (e) {
        setPendingCount(0);
      }
    };
    fetchPendingCount();
    // Optionally, refresh every minute
    const interval = setInterval(fetchPendingCount, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleManagePatients = () => {
    router.push('/(tabs)/patients');
  };
  const handleMySchedule = () => {
    setShowScheduleModal(true);
  };
  const handleExit = () => {
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Exit', style: 'destructive', onPress: () => BackHandler.exitApp() },
      ]
    );
  };
  const handlePendingTasks = () => {
    router.push('/(tabs)/todo');
  };

  const currentFact = medicalFacts[factIndex];

  // If expo-linear-gradient is not available, use a View with a fallback background color
  return (
      <View style={[styles.gradientBackground, theme === 'dark' && { backgroundColor: '#181A20' }]}> 
        <View style={[styles.container, theme === 'dark' && { backgroundColor: '#181A20' }]}> 
          <View style={styles.topRow}>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh} activeOpacity={0.7}>
              <Text style={styles.refreshIcon}>⟳</Text>
            </TouchableOpacity>
            <View style={styles.clockBox}>
              <Text style={[styles.clock, theme === 'dark' && { color: '#fff' }]}>
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Text>
              <Text style={[styles.date, theme === 'dark' && { color: '#fff' }]}>
                {time.toLocaleDateString()}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: -46 }}>
            <ThemeToggle
              isDark={theme === 'dark'}
              onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            />
          </View>
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeText, theme === 'dark' && { color: '#fff' }]}> 
              Welcome{accountHolderName ? ` ${accountHolderName}` : ''}
            </Text>
            <Text style={[styles.subtitle, theme === 'dark' && { color: '#aaa' }]}> 
              Streamline your patient care workflow.
            </Text>
          </View>
          <View style={[styles.rotationContainer, theme === 'dark' && { backgroundColor: '#181A20' }]}> 
            {rotationToday ? (
              <View style={[styles.rotationBoxRow, theme === 'dark' && { backgroundColor: '#23242a', borderColor: '#333' }]}> 
                <Text style={[styles.rotationIcon, theme === 'dark' && { color: '#fff' }]}>🏥</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.rotationText, theme === 'dark' && { color: '#fff' }]}> 
                    Ward: <Text style={[styles.rotationValue, theme === 'dark' && { color: '#fff' }]}>{rotationToday.ward}</Text>
                  </Text>
                  <Text style={[styles.rotationText, theme === 'dark' && { color: '#fff' }]}> 
                    Shift: <Text style={[styles.rotationValue, theme === 'dark' && { color: '#fff' }]}> 
                      {(() => {
                        // Robustly parse 12-hour (AM/PM) or 24-hour times
                        function parseTime(str: string, baseDate: Date) {
                          if (!str) return null;
                          // Try 12-hour format: "hh:mm AM/PM"
                          const ampmMatch = str.match(/^(\d{1,2}):(\d{2}) ?([AP]M)$/i);
                          if (ampmMatch) {
                            let hour = parseInt(ampmMatch[1], 10);
                            const min = parseInt(ampmMatch[2], 10);
                            const ampm = ampmMatch[3].toUpperCase();
                            if (ampm === 'PM' && hour !== 12) hour += 12;
                            if (ampm === 'AM' && hour === 12) hour = 0;
                            const d = new Date(baseDate);
                            d.setHours(hour, min, 0, 0);
                            return d;
                          }
                          // Try 24-hour format: "HH:mm"
                          const parts = str.split(':');
                          if (parts.length === 2) {
                            const hour = parseInt(parts[0], 10);
                            const min = parseInt(parts[1], 10);
                            if (!isNaN(hour) && !isNaN(min)) {
                              const d = new Date(baseDate);
                              d.setHours(hour, min, 0, 0);
                              return d;
                            }
                          }
                          return null;
                        }
                        const today = new Date();
                        const start = parseTime(rotationToday.shiftStart, today);
                        const end = parseTime(rotationToday.shiftEnd, today);
                        const format = (d: Date | null) =>
                          d
                            ? d.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              }).replace(':00 ', ' ').replace('AM', 'a.m.').replace('PM', 'p.m.')
                            : '--';
                        return `${format(start)} - ${format(end)}`;
                      })()}
                    </Text>
                  </Text>
                  <Text style={[styles.rotationText, theme === 'dark' && { color: '#fff' }]}> 
                    Status: <Text style={[styles.rotationValue, theme === 'dark' && { color: '#fff' }]}> 
                      {(() => {
                        function parseTime(str: string, baseDate: Date) {
                          if (!str) return null;
                          const ampmMatch = str.match(/^(\d{1,2}):(\d{2}) ?([AP]M)$/i);
                          if (ampmMatch) {
                            let hour = parseInt(ampmMatch[1], 10);
                            const min = parseInt(ampmMatch[2], 10);
                            const ampm = ampmMatch[3].toUpperCase();
                            if (ampm === 'PM' && hour !== 12) hour += 12;
                            if (ampm === 'AM' && hour === 12) hour = 0;
                            const d = new Date(baseDate);
                            d.setHours(hour, min, 0, 0);
                            return d;
                          }
                          const parts = str.split(':');
                          if (parts.length === 2) {
                            const hour = parseInt(parts[0], 10);
                            const min = parseInt(parts[1], 10);
                            if (!isNaN(hour) && !isNaN(min)) {
                              const d = new Date(baseDate);
                              d.setHours(hour, min, 0, 0);
                              return d;
                            }
                          }
                          return null;
                        }
                        const now = new Date();
                        const today = new Date();
                        const start = parseTime(rotationToday.shiftStart, today);
                        let end = parseTime(rotationToday.shiftEnd, today);
                        // --- Fix for overnight shifts ---
                        if (start && end && end <= start) {
                          // End time is on the next day
                          end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
                        }
                        if (start && end) {
                          if (now >= start && now <= end) {
                            const ms = end.getTime() - now.getTime();
                            const hours = Math.floor(ms / (1000 * 60 * 60));
                            const minutes = Math.floor((ms / (1000 * 60)) % 60);
                            return `${hours}h ${minutes}m remaining`;
                          } else if (now < start) {
                            return `Upcoming`;
                          } else {
                            return "Shift ended";
                          }
                        }
                        return '--';
                      })()}
                    </Text>
                  </Text>
                  {/* Upcoming Shift line inside current shift box */}
                  <View style={{ marginTop: 4 }}>
                    {upcomingShift &&
                      (
                        !rotationToday ||
                        upcomingShift.ward !== rotationToday.ward ||
                        upcomingShift.shiftStart !== rotationToday.shiftStart ||
                        upcomingShift.shiftEnd !== rotationToday.shiftEnd
                      ) ? (
                      <Text style={[styles.rotationText, theme === 'dark' && { color: '#fff' }]}>
                        Upcoming Shift:{" "}
                        <Text style={[styles.rotationValue, theme === 'dark' && { color: '#fff' }]}>
                          {upcomingShift.ward}
                        </Text>
                        {"  "}
                        <Text style={[styles.rotationValue, theme === 'dark' && { color: '#fff' }]}>
                          {(() => {
                            function parseTime(str: string, baseDate: Date) {
                              if (!str) return null;
                              const ampmMatch = str.match(/^(\d{1,2}):(\d{2}) ?([AP]M)$/i);
                              if (ampmMatch) {
                                let hour = parseInt(ampmMatch[1], 10);
                                const min = parseInt(ampmMatch[2], 10);
                                const ampm = ampmMatch[3].toUpperCase();
                                if (ampm === 'PM' && hour !== 12) hour += 12;
                                if (ampm === 'AM' && hour === 12) hour = 0;
                                const d = new Date(baseDate);
                                d.setHours(hour, min, 0, 0);
                                return d;
                              }
                              const parts = str.split(':');
                              if (parts.length === 2) {
                                const hour = parseInt(parts[0], 10);
                                const min = parseInt(parts[1], 10);
                                if (!isNaN(hour) && !isNaN(min)) {
                                  const d = new Date(baseDate);
                                  d.setHours(hour, min, 0, 0);
                                  return d;
                                }
                              }
                              return null;
                            }
                            const today = new Date();
                            const start = parseTime(upcomingShift.shiftStart, today);
                            const end = parseTime(upcomingShift.shiftEnd, today);
                            const format = (d: Date | null) =>
                              d
                                ? d.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    hour12: true,
                                  }).replace(':00 ', ' ').replace('AM', 'a.m.').replace('PM', 'p.m.')
                                : '--';
                            return `${format(start)} - ${format(end)}`;
                          })()}
                        </Text>
                      </Text>
                    ) : (
                      <Text style={[styles.rotationText, theme === 'dark' && { color: '#fff' }]}>
                        You will be off tomorrow
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
              <View style={[styles.rotationBoxRow, theme === 'dark' && { backgroundColor: '#23242a', borderColor: '#333' }]}> 
                <Text style={[styles.rotationIcon, theme === 'dark' && { color: '#fff' }]}>✨</Text>
                <Text style={[styles.offText, theme === 'dark' && { color: '#fff' }]}> 
                  You are off today, enjoy!
                </Text>
              </View>
            )}
          </View>
          <View style={[styles.medicalFactsContainer, theme === 'dark' && { backgroundColor: '#181A20' }]}> 
            <View style={[styles.medicalFactsBox, theme === 'dark' && { backgroundColor: '#23242a', borderColor: '#333' }]}> 
              <View style={styles.medicalFactsHeader}>
                <Text style={[styles.bulbIcon, theme === 'dark' && { color: '#fff' }]}>💡</Text>
                <Text style={[styles.medicalFactsTitle, theme === 'dark' && { color: '#fff' }]}>Medical Facts</Text>
              </View>
              <Text style={[styles.medicalFactText, theme === 'dark' && { color: '#fff' }]}>
                {currentFact}
              </Text>
              <Text style={[styles.factsNote, theme === 'dark' && { color: '#aaa' }]}>
                <Text style={{ fontStyle: 'italic' }}>New facts every 30 minutes</Text>
              </Text>
            </View>
          </View>
          {/* Pending Tasks Widget */}
          <View style={[styles.widgetRow, { flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center' }]}> 
            <TouchableOpacity style={[styles.pendingWidget, theme === 'dark' && { backgroundColor: '#23242a' }]} onPress={handlePendingTasks} activeOpacity={0.8}>
              <Text style={[styles.widgetTitleStyled, theme === 'dark' && { color: '#fff' }]}>Pending Tasks</Text>
              <Text style={[styles.widgetNumberStyled, theme === 'dark' && { color: '#fff' }]}>{pendingCount}</Text>
            </TouchableOpacity>
          </View>
          {/* Action Widgets Row */}
          <View style={[styles.actionWidgetsRowModern]}>
            {/* Manage Patients */}
            <TouchableOpacity
              style={[
                styles.actionWidgetModern,
                styles.actionWidgetModernSmall,
                { backgroundColor: theme === 'dark' ? '#23242a' : '#f7faff' },
              ]}
              onPress={handleManagePatients}
              activeOpacity={0.85}
            >
              <Ionicons name="people-outline" size={28} color={theme === 'dark' ? '#90caf9' : '#1976d2'} />
              <Text style={[styles.actionLabelModern, { color: theme === 'dark' ? '#fff' : '#1976d2' }]}>
                Manage Patients
              </Text>
            </TouchableOpacity>
            {/* My Schedule */}
            <TouchableOpacity
              style={[
                styles.actionWidgetModern,
                styles.actionWidgetModernSmall,
                { backgroundColor: theme === 'dark' ? '#23242a' : '#f7faff' },
              ]}
              onPress={handleMySchedule}
              activeOpacity={0.85}
            >
              <Ionicons name="calendar-outline" size={28} color={theme === 'dark' ? '#90caf9' : '#1976d2'} />
              <Text style={[styles.actionLabelModern, { color: theme === 'dark' ? '#fff' : '#1976d2' }]}>
                My Schedule
              </Text>
            </TouchableOpacity>
            {/* Exit */}
            <TouchableOpacity
              style={[
                styles.actionWidgetModern,
                styles.actionWidgetModernSmall, // Make Exit button small too
                { backgroundColor: theme === 'dark' ? '#23242a' : '#fff3f3' },
              ]}
              onPress={handleExit}
              activeOpacity={0.85}
            >
              <Ionicons name="exit-outline" size={28} color={theme === 'dark' ? '#ff8a80' : '#d32f2f'} />
              <Text style={[styles.actionLabelModern, { color: theme === 'dark' ? '#ff8a80' : '#d32f2f' }]}>
                Exit
              </Text>
            </TouchableOpacity>
          </View>
          {/* Schedule Modal (opened from My Schedule widget) */}
          <Modal visible={showScheduleModal} animationType="slide" transparent={false} onRequestClose={() => setShowScheduleModal(false)}>
            <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#0b0d0f' : '#fff' }}>
              <View style={{ paddingTop: 48, paddingHorizontal: 8, flexDirection: 'row', justifyContent: 'flex-end' }}>
                <TouchableOpacity onPress={() => setShowScheduleModal(false)} style={{ padding: 12 }}>
                  <Ionicons name="close" size={28} color={theme === 'dark' ? '#fff' : '#333'} />
                </TouchableOpacity>
              </View>
              <Schedule />
            </View>
          </Modal>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    backgroundColor: '#f7faff', // fallback solid color if gradient is not available
  },
  container: {
    flex: 1,
    paddingTop: 48,
    paddingHorizontal: 24,
    // backgroundColor: '#fff', // remove solid background for gradient
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  refreshButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    height: 48,
    width: 48,
    backgroundColor: 'transparent',
  },
  refreshIcon: {
    fontSize: 30,
    color: '#007aff',
    fontWeight: 'bold',
  },
  clockBox: {
    backgroundColor: '#007aff',
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
    minWidth: 90,
  },
  clock: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  date: {
    fontSize: 11,
    color: '#fff',
    marginTop: 2,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  welcomeText: {
    fontSize: 28,
    color: '#007aff',
    fontWeight: '600',
  },
  accountName: {
    fontWeight: 'bold',
    color: '#007aff',
  },
  subtitle: {
    fontSize: 16,
    color: '#222',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '400',
  },
  rotationContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 4,
    width: '100%',
  },
  rotationBox: {
    backgroundColor: '#f7faff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#007aff',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  rotationBoxRow: {
    backgroundColor: '#fff', // changed from #f7faff to white
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 22,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e3eafc',
    shadowColor: '#007aff',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  rotationIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  rotationText: {
    fontSize: 16,
    color: '#222',
    marginBottom: 4,
    fontWeight: '500',
  },
  rotationValue: {
    color: '#007aff',
    fontWeight: 'bold',
  },
  offText: {
    fontSize: 18,
    color: '#007aff',
    fontWeight: '600',
    paddingVertical: 18,
    textAlign: 'left',
  },
  medicalFactsContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 0, // remove extra padding
  },
  medicalFactsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    marginLeft: 0,
    marginTop: 0,
    paddingLeft: 0,
  },
  bulbIcon: {
    fontSize: 22,
    marginRight: 6,
  },
  medicalFactsTitle: {
    fontSize: 18,
    color: '#007aff',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  medicalFactsBox: {
    backgroundColor: '#e6f0fd',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    width: '100%',
    maxWidth: 600, // increased from 480 to 600
    alignSelf: 'center',
    marginTop: 2,
    marginBottom: 2,
    borderWidth: 1.5,
    borderColor: '#b3d1fa',
    shadowColor: '#1976d2',
    shadowOpacity: 0.13,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  medicalFactText: {
    fontSize: 15,
    color: '#222',
    marginTop: 4,
    marginLeft: 0,
    marginRight: 0,
    maxWidth: '100%',
  },
  factsNote: {
    marginLeft: 0,
    marginTop: 6,
    color: '#888',
    fontSize: 13,
  },
  widgetRow: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 4,
  },
  pendingWidget: {
    backgroundColor: '#fff',
    borderRadius: 16, // revert to previous (not circular)
    paddingVertical: 18,
    paddingHorizontal: 12, // revert to previous
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#007aff',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 60, // revert to previous
    marginTop: 0,
  },
  widgetTitleStyled: {
    fontSize: 14, // keep small font size
    color: '#007aff',
    fontWeight: 'bold',
    marginBottom: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  widgetNumberStyled: {
    fontSize: 28, // keep small font size
    color: '#222',
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginTop: 2,
    textAlign: 'center',
  },
  // --- Action Widgets Row ---
  actionWidgetsRowModern: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    width: '100%',
    marginTop: 12,
    marginBottom: 18,
    gap: 16,
  },
  actionWidgetModern: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    paddingVertical: 18,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#1976d2',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    minWidth: 0,
    minHeight: 110,
    maxHeight: 110,
    borderWidth: 1,
    borderColor: '#e3eafc',
  },
  actionWidgetModernSmall: {
    minHeight: 90,
    maxHeight: 90,
    paddingVertical: 10,
  },
  actionLabelModern: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
});