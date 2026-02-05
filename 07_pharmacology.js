// 07_pharmacology_master.js — Pharmacology Super Masterclass (NCLEX)
// VERSIÓN: PRODUCTION READY (SECURITY + PERFORMANCE + TAILWIND SAFE)
// CONTENIDO: 100% COMPLETO (Cardio, Heme, Endo, Fluids, Psych, etc.)
// REFACTOR: Implementación de mejores prácticas de ingeniería de software.
// AUTOR: REYNIER DIAZ GERONES
// FECHA: 01-21-2026

(function() {
  'use strict';

  // --- 1. CORE UTILITIES & HELPERS ---
  
  // XSS Protection
  const escapeHTML = (str) => {
    if (typeof str !== 'string') return '';
    return str.replace(/[&<>"']/g, 
      tag => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[tag]
    );
  };

  // i18n Helper
  const t = (es, en) => `<span class="lang-es">${es}</span><span class="lang-en hidden-lang">${en}</span>`;

  // Safe List Renderer
  const renderList = (items, templateFn, fallback = '') => 
    (Array.isArray(items) && items.length > 0) ? items.map(templateFn).join('') : fallback;

  // --- 2. THEME CONFIGURATION (Tailwind Safe) ---
  // Mapeo estático para evitar purgado de clases dinámicas
  const THEME_COLORS = {
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-700 dark:text-red-300',
      iconBg: 'bg-red-100 dark:bg-red-900',
      iconText: 'text-red-600',
      headerIcon: 'from-red-500 to-red-700',
      headerText: 'from-red-600 to-red-800'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-700 dark:text-blue-300',
      iconBg: 'bg-blue-100 dark:bg-blue-900',
      iconText: 'text-blue-600',
      headerIcon: 'from-blue-500 to-blue-700',
      headerText: 'from-blue-600 to-blue-800'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      text: 'text-orange-700 dark:text-orange-300',
      iconBg: 'bg-orange-100 dark:bg-orange-900',
      iconText: 'text-orange-600',
      headerIcon: 'from-orange-500 to-orange-700',
      headerText: 'from-orange-600 to-orange-800'
    },
    green: { // Mapeado a 'emerald' o 'lime' en lógica si es necesario
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-700 dark:text-green-300',
      iconBg: 'bg-green-100 dark:bg-green-900',
      iconText: 'text-green-600',
      headerIcon: 'from-green-500 to-green-700',
      headerText: 'from-green-600 to-green-800'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-700 dark:text-yellow-300',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900',
      iconText: 'text-yellow-600',
      headerIcon: 'from-yellow-500 to-yellow-700',
      headerText: 'from-yellow-600 to-yellow-800'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      text: 'text-purple-700 dark:text-purple-300',
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      iconText: 'text-purple-600',
      headerIcon: 'from-purple-500 to-purple-700',
      headerText: 'from-purple-600 to-purple-800'
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      border: 'border-cyan-200 dark:border-cyan-800',
      text: 'text-cyan-700 dark:text-cyan-300',
      iconBg: 'bg-cyan-100 dark:bg-cyan-900',
      iconText: 'text-cyan-600',
      headerIcon: 'from-cyan-500 to-cyan-700',
      headerText: 'from-cyan-600 to-cyan-800'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      border: 'border-indigo-200 dark:border-indigo-800',
      text: 'text-indigo-700 dark:text-indigo-300',
      iconBg: 'bg-indigo-100 dark:bg-indigo-900',
      iconText: 'text-indigo-600',
      headerIcon: 'from-indigo-500 to-indigo-700',
      headerText: 'from-indigo-600 to-indigo-800'
    },
    pink: {
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      border: 'border-pink-200 dark:border-pink-800',
      text: 'text-pink-700 dark:text-pink-300',
      iconBg: 'bg-pink-100 dark:bg-pink-900',
      iconText: 'text-pink-600',
      headerIcon: 'from-pink-500 to-pink-700',
      headerText: 'from-pink-600 to-pink-800'
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-900/20',
      border: 'border-rose-200 dark:border-rose-800',
      text: 'text-rose-700 dark:text-rose-300',
      iconBg: 'bg-rose-100 dark:bg-rose-900',
      iconText: 'text-rose-600',
      headerIcon: 'from-rose-500 to-rose-700',
      headerText: 'from-rose-600 to-rose-800'
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      border: 'border-emerald-200 dark:border-emerald-800',
      text: 'text-emerald-700 dark:text-emerald-300',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900',
      iconText: 'text-emerald-600',
      headerIcon: 'from-emerald-500 to-emerald-700',
      headerText: 'from-emerald-600 to-emerald-800'
    },
    teal: {
      bg: 'bg-teal-50 dark:bg-teal-900/20',
      border: 'border-teal-200 dark:border-teal-800',
      text: 'text-teal-700 dark:text-teal-300',
      iconBg: 'bg-teal-100 dark:bg-teal-900',
      iconText: 'text-teal-600',
      headerIcon: 'from-teal-500 to-teal-700',
      headerText: 'from-teal-600 to-teal-800'
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-800',
      text: 'text-amber-700 dark:text-amber-300',
      iconBg: 'bg-amber-100 dark:bg-amber-900',
      iconText: 'text-amber-600',
      headerIcon: 'from-amber-500 to-amber-700',
      headerText: 'from-amber-600 to-amber-800'
    },
    lime: {
      bg: 'bg-lime-50 dark:bg-lime-900/20',
      border: 'border-lime-200 dark:border-lime-800',
      text: 'text-lime-700 dark:text-lime-300',
      iconBg: 'bg-lime-100 dark:bg-lime-900',
      iconText: 'text-lime-600',
      headerIcon: 'from-lime-500 to-lime-700',
      headerText: 'from-lime-600 to-lime-800'
    },
    fuchsia: {
      bg: 'bg-fuchsia-50 dark:bg-fuchsia-900/20',
      border: 'border-fuchsia-200 dark:border-fuchsia-800',
      text: 'text-fuchsia-700 dark:text-fuchsia-300',
      iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-900',
      iconText: 'text-fuchsia-600',
      headerIcon: 'from-fuchsia-500 to-fuchsia-700',
      headerText: 'from-fuchsia-600 to-fuchsia-800'
    },
    slate: { // Fallback / Antidotes
      bg: 'bg-slate-50 dark:bg-slate-800',
      border: 'border-slate-200 dark:border-slate-700',
      text: 'text-slate-700 dark:text-slate-300',
      iconBg: 'bg-slate-100 dark:bg-slate-900',
      iconText: 'text-slate-600',
      headerIcon: 'from-slate-500 to-slate-700',
      headerText: 'from-slate-600 to-slate-800'
    }
  };

  // Fallback si el color no existe
  const getTheme = (colorName) => THEME_COLORS[colorName] || THEME_COLORS.blue;

  // --- 3. DATA STRUCTURES (CONTENT) ---
  
  const vitalOrgans = [
    { 
      title: t('Hígado (Metabolismo)', 'Liver (Metabolism)'),
      labs: 'ALT, AST',
      alert: t('Hepatotóxicos: Acetaminofén, Estatinas, INH, Valproato', 'Hepatotoxic: Acetaminophen, Statins, INH, Valproate'),
      color: 'orange'
    },
    { 
      title: t('Riñón (Excreción)', 'Kidney (Excretion)'),
      labs: 'Creatinine, BUN, Output >30ml/hr',
      alert: t('Nefrotóxicos: Aminoglucósidos, Vancomicina, AINEs, Contraste', 'Nephrotoxic: Aminoglycosides, Vancomycin, NSAIDs, Contrast'),
      color: 'blue'
    }
  ];

  const safetyRules = [
    { icon: 'fa-ban', color: 'red', text: t('NUNCA triturar <strong>ER, SR, XR, Capa Entérica</strong>.', 'NEVER crush <strong>ER, SR, XR, Enteric Coated</strong>.') },
    { icon: 'fa-triangle-exclamation', color: 'yellow', text: t('¿Paciente dice "Se ve diferente"? <strong>DETENTE Y VERIFICA.</strong>', 'Patient says "This looks different"? <strong>STOP & CHECK.</strong>') },
    { icon: 'fa-martini-glass-citrus', color: 'orange', text: t('<strong>NO Jugo de Toronja</strong> con Estatinas o Bloq. Calcio.', '<strong>NO Grapefruit Juice</strong> w/ Statins or CCBs.') },
    { icon: 'fa-syringe', color: 'purple', text: t('<strong>DOBLE CHEQUEO</strong> Insulina y Heparina (alto riesgo).', '<strong>DOUBLE CHECK</strong> Insulin & Heparin (high-risk).') },
    { icon: 'fa-vial', color: 'red', text: t('<strong>NUNCA IV Push</strong> Potasio (Paro cardíaco).', '<strong>NEVER IV Push</strong> Potassium (Cardiac arrest).') }
  ];

  const therapeuticLevels = [
    { drug: 'Lithium', range: '0.6 - 1.2 mEq/L', toxic: '> 1.5', note: t('Tóxico con ↓ Sodio/Deshidratación.', 'Toxic with ↓ Sodium/Dehydration.') },
    { drug: 'Digoxin', range: '0.5 - 0.9 ng/mL', toxic: '> 2.0', note: t('Tóxico con ↓ Potasio. Pulso <60 detener.', 'Toxic with ↓ Potassium. Pulse <60 hold.') },
    { drug: 'Phenytoin', range: '10 - 20 mcg/mL', toxic: '> 20', note: t('Hiperplasia Gingival. IV lento.', 'Gingival Hyperplasia. Slow IV.') },
    { drug: 'Theophylline', range: '10 - 20 mcg/mL', toxic: '> 20', note: t('Evitar cafeína. Taquicardia.', 'Avoid caffeine. Tachycardia.') },
    { drug: 'Vancomycin', range: '10 - 20 mcg/mL', toxic: '> 20', note: t('Valle antes de 4ta dosis. Sd. Hombre Rojo.', 'Trough before 4th dose. Red Man Syndrome.') },
    { drug: 'Magnesium', range: '4 - 7 mg/dL', toxic: '> 7', note: t('Antídoto: Gluconato de Calcio.', 'Antidote: Ca Gluconate.') },
    { drug: 'Warfarin (INR)', range: '2 - 3', toxic: '> 4', note: t('Válvula mecánica: 2.5 - 3.5. Vitamina K.', 'Mech Valve: 2.5 - 3.5. Vitamin K.') },
    { drug: 'aPTT (Heparin)', range: '46 - 70 sec', toxic: '> 70', note: t('1.5 - 2.5 veces el control. Protamina.', '1.5 - 2.5 times control. Protamine.') }
  ];

  const suffixesList = [
    { s: '-pril', t: 'ACE Inhibitor', a: t('Angioedema, Tos Crónica, Hiperkalemia', 'Angioedema, Chronic Cough, Hyperkalemia'), c: 'blue', display: '-pril' },
    { s: '-sartan', t: 'ARB', a: t('Hiperkalemia, Embarazo', 'Hyperkalemia, Pregnancy'), c: 'cyan', display: '-sartan' },
    { s: '-olol', t: 'Beta Blocker', a: t('Broncoespasmo, Bradicardia, Hipoglucemia', 'Bronchospasm, Bradycardia, Hypoglycemia'), c: 'indigo', display: '-olol' },
    { s: '-dipine', t: 'Ca Channel Blocker', a: t('Edema Periférico, Cefalea', 'Peripheral Edema, Headache'), c: 'purple', display: '-dipine' },
    { s: '-prazole', t: 'PPI', a: t('C. diff, Osteoporosis, Déficit B12', 'C. diff, Osteoporosis, B12 Deficiency'), c: 'orange', display: '-prazole' },
    { s: '-sone', t: 'Corticosteroid', a: t('Hiperglucemia, Infección, Cushing', 'Hyperglycemia, Infection, Cushing'), c: 'red', display: '-sone' },
    { s: '-floxacin', t: 'Fluoroquinolone', a: t('Ruptura Tendón, Neuropatía, QT largo', 'Tendon Rupture, Neuropathy, Long QT'), c: 'lime', display: '-floxacin' },
    { s: '-cycline', t: 'Tetracycline', a: t('Fotosensibilidad, Dientes (Niños)', 'Photosensitivity, Teeth (Kids)'), c: 'yellow', display: '-cycline' },
    { s: '-triptan', t: 'Triptan', a: t('Vasoconstricción, Dolor Pecho', 'Vasoconstriction, Chest Pain'), c: 'pink', display: '-triptan' }
  ];

  const medicationSystems = [
    {
      title: { es: 'Cardiovascular / Renal', en: 'Cardiovascular / Renal' },
      icon: 'fa-heart-pulse',
      color: 'red',
      drugs: [
        { 
          name: 'Nitroglycerin', 
          use: t('Angina', 'Angina'), 
          alert: t('Hipotensión severa. Fatal con Sildenafil/Viagra', 'Severe hypotension. Fatal with Sildenafil/Viagra'), 
          contra: t('Uso reciente de Sildenafil/Tadalafil', 'Recent use of Sildenafil/Tadalafil'),
          details: t('3 dosis cada 5 min. Llamar 911 a la primera.', '3 doses q5min. Call 911 after 1st.')
        },
        { 
          name: 'Furosemide', 
          use: t('Edema, Falla Cardíaca', 'Edema, Heart Failure'), 
          alert: t('Hipokalemia, Deshidratación, Ototoxicidad', 'Hypokalemia, Dehydration, Ototoxicity'), 
          contra: t('Alergia Sulfa (Precaución)', 'Sulfa Allergy (Caution)'),
          details: t('Comer potasio. IV Push lento (20mg/min).', 'Eat potassium. Slow IV Push (20mg/min).')
        },
        { 
          name: 'Spironolactone', 
          use: t('Falla Cardíaca (Ahorrador K+)', 'Heart Failure (K+ Sparing)'), 
          alert: t('Hiperkalemia', 'Hyperkalemia'), 
          contra: t('Insuficiencia renal, K+ alto', 'Renal failure, High K+'),
          details: t('EVITAR sustitutos de sal.', 'AVOID salt substitutes.')
        },
        { 
          name: 'Digoxin', 
          use: t('Falla Cardíaca, Arritmias', 'Heart Failure, Arrhythmias'), 
          alert: t('Toxicidad (Visión amarilla). Riesgo si Hipokalemia', 'Toxicity (Yellow vision). Risk if Hypokalemia'), 
          contra: t('Pulso bajo (<60)', 'Low pulse (<60)'),
          details: t('Chequear pulso apical 1 min. (HIGH ALERT)', 'Check apical pulse 1 min. (HIGH ALERT)')
        },
        { 
          name: 'Lisinopril / Losartan', 
          use: t('HTA, Falla Cardíaca', 'HTN, Heart Failure'), 
          alert: t('Angioedema (IECA), Tos, Hiperkalemia', 'Angioedema (ACE), Cough, Hyperkalemia'), 
          contra: t('Embarazo', 'Pregnancy'),
          details: t('Nefroprotectores en diabéticos.', 'Renal protective in diabetics.')
        },
        { 
          name: 'Amlodipine / Diltiazem', 
          use: t('HTA, Angina', 'HTN, Angina'), 
          alert: t('Hipotensión, Edema (Amlodipine), Bradicardia (Diltiazem)', 'Hypotension, Edema (Amlodipine), Bradycardia (Diltiazem)'), 
          contra: t('Falla cardíaca descompensada', 'Decompensated HF'),
          details: t('Evitar jugo de toronja (CCB).', 'Avoid grapefruit juice (CCB).')
        },
        { 
          name: 'Amiodarone', 
          use: t('Arritmias', 'Arrhythmias'), 
          alert: t('Toxicidad Pulmón/Tiroides', 'Lung/Thyroid Toxicity'), 
          contra: t('Bloqueo AV', 'AV Block'),
          details: t('Vida media muy larga.', 'Very long half-life.')
        },
        { 
          name: 'Adenosine', 
          use: t('TSV (Taquicardia Supraventricular)', 'SVT'), 
          alert: t('Pausa cardíaca breve (Asistolia)', 'Brief cardiac pause (Asystole)'), 
          contra: t('Bloqueo AV', 'AV Block'),
          details: t('IV Push MUY RÁPIDO + Bolo Salino.', 'Very FAST IV Push + Saline Bolus.')
        }
      ]
    },
    {
      title: { es: 'Hematología / Anticoagulantes', en: 'Hematology / Anticoagulants' },
      icon: 'fa-droplet',
      color: 'rose',
      drugs: [
        { 
          name: 'Heparin (IV/SQ)', 
          use: t('Anticoagulante Rápido', 'Rapid Anticoagulant'), 
          alert: t('Sangrado, HIT (Plaquetas bajas)', 'Bleeding, HIT (Low Platelets)'), 
          contra: t('Sangrado activo, Plaquetas <100k', 'Active bleeding, Platelets <100k'),
          details: t('Monitorear aPTT. Antídoto: Protamina.', 'Monitor aPTT. Antidote: Protamine.')
        },
        { 
          name: 'Warfarin', 
          use: t('Anticoagulante Oral (Largo plazo)', 'Oral Anticoagulant (Long term)'), 
          alert: t('Sangrado, Teratogénico', 'Bleeding, Teratogenic'), 
          contra: t('Embarazo', 'Pregnancy'),
          details: t('Monitorear INR (2-3). Antídoto: Vitamina K. Dieta verde constante.', 'Monitor INR (2-3). Antidote: Vit K. Consistent green diet.')
        },
        { 
          name: 'Enoxaparin', 
          use: t('Prevención TVP (Bajo peso molecular)', 'DVT Prevention (LMWH)'), 
          alert: t('Sangrado, HIT', 'Bleeding, HIT'), 
          contra: t('Falla renal (ajustar)', 'Renal failure (adjust)'),
          details: t('Burbuja de aire se queda en jeringa. No frotar.', 'Air bubble stays in syringe. Do not rub.')
        },
        { 
          name: 'Antiplatelets (Aspirin/Clopidogrel)', 
          use: t('Prevención Infarto/ACV', 'MI/Stroke Prevention'), 
          alert: t('Sangrado GI, Tinnitus (Aspirina)', 'GI Bleeding, Tinnitus (Aspirin)'), 
          contra: t('Úlcera péptica, Niños (Reye)', 'Peptic Ulcer, Kids (Reye)'),
          details: t('Suspender 5-7 días antes de cirugía.', 'Stop 5-7 days before surgery.')
        },
        { 
          name: 'DOACs (Rivaroxaban/Apixaban)', 
          use: t('FA no valvular, TVP', 'Non-valvular AFib, DVT'), 
          alert: t('Sangrado (Sin monitoreo INR)', 'Bleeding (No INR monitoring)'), 
          contra: t('Falla renal/hepática severa', 'Severe renal/liver failure'),
          details: t('No suspender abruptamente (Riesgo trombosis).', 'Do not stop abruptly (Clot risk).')
        }
      ]
    },
    {
      title: { es: 'Fluidos y Electrolitos (Alto Riesgo)', en: 'Fluids & Electrolytes (High Alert)' },
      icon: 'fa-flask-vial',
      color: 'yellow',
      drugs: [
        { 
          name: 'Potassium Chloride (KCl)', 
          use: t('Hipokalemia', 'Hypokalemia'), 
          alert: t('NUNCA IV PUSH (Paro Cardíaco)', 'NEVER IV PUSH (Cardiac Arrest)'), 
          contra: t('Anuria (Falla renal)', 'Anuria (Renal Failure)'),
          details: t('Max IV: 10mEq/hr periférico. Quema la vena.', 'Max IV: 10mEq/hr peripheral. Burns vein.')
        },
        { 
          name: 'Magnesium Sulfate', 
          use: t('Preeclampsia, Torsades', 'Preeclampsia, Torsades'), 
          alert: t('Pérdida reflejos (DTRs), Depresión resp.', 'Loss of DTRs, Resp depression'), 
          contra: t('Miastenia Gravis', 'Myasthenia Gravis'),
          details: t('Antídoto: Gluconato de Calcio.', 'Antidote: Calcium Gluconate.')
        },
        { 
          name: 'Calcium Gluconate', 
          use: t('Toxicidad Mg, Hiperkalemia', 'Mg Toxicity, Hyperkalemia'), 
          alert: t('Arritmias, Hipercalcemia', 'Arrhythmias, Hypercalcemia'), 
          contra: t('FVib, Hipercalcemia', 'VFib, Hypercalcemia'),
          details: t('Administrar lento. Monitor cardíaco.', 'Give slowly. Cardiac monitor.')
        },
        { 
          name: 'Hypertonic Saline (3% NaCl)', 
          use: t('Hiponatremia Severa, Edema Cerebral', 'Severe Hyponatremia, Cerebral Edema'), 
          alert: t('Desmielinización (CPM), Sobrecarga fluidos', 'Demyelination (CPM), Fluid overload'), 
          contra: t('Deshidratación celular', 'Cellular dehydration'),
          details: t('Solo UCI. Corregir Na+ lentamente.', 'ICU only. Correct Na+ slowly.')
        }
      ]
    },
    {
      title: { es: 'Endocrino', en: 'Endocrine' },
      icon: 'fa-cubes-stacked',
      color: 'blue',
      drugs: [
        { 
          name: 'Insulin (Regular, NPH, Glargine)', 
          use: t('Diabetes', 'Diabetes'), 
          alert: t('Hipoglucemia (HIGH ALERT)', 'Hypoglycemia (HIGH ALERT)'), 
          contra: t('Hipoglucemia < 70', 'Hypoglycemia < 70'),
          details: t('Regular: única IV. Glargina: No mezclar.', 'Regular: only IV. Glargine: Do not mix.')
        },
        { 
          name: 'Metformin', 
          use: t('Diabetes Tipo 2', 'Type 2 Diabetes'), 
          alert: t('Acidosis Láctica, Falla Renal', 'Lactic Acidosis, Renal Failure'), 
          contra: t('Contraste IV (48h)', 'IV Contrast (48h)'),
          details: t('Tomar con comida. Diarrea común.', 'Take with food. Diarrhea common.')
        },
        { 
          name: 'Sulfonylureas (Glipizide)', 
          use: t('Estimulante Páncreas', 'Pancreas Stimulant'), 
          alert: t('Hipoglucemia, Ganancia peso', 'Hypoglycemia, Wt gain'), 
          contra: t('Alergia Sulfa (Precaución)', 'Sulfa Allergy (Caution)'),
          details: t('Protector solar (Fotosensibilidad).', 'Sunscreen (Photosensitivity).')
        },
        { 
          name: 'SGLT-2 Inhibitors (Empagliflozin)', 
          use: t('Diabetes, Falla Cardíaca', 'Diabetes, Heart Failure'), 
          alert: t('Infecciones Urinarias (UTIs), Hipotensión', 'UTIs, Hypotension'), 
          contra: t('Falla renal severa', 'Severe renal failure'),
          details: t('Causa glucosuria (azúcar en orina).', 'Causes glucosuria (sugar in urine).')
        },
        { 
          name: 'Levothyroxine', 
          use: t('Hipotiroidismo', 'Hypothyroidism'), 
          alert: t('Taquicardia, Insomnio (Exceso)', 'Tachycardia, Insomnia (Excess)'), 
          contra: t('IAM reciente', 'Recent MI'),
          details: t('Tomar en ayunas, solo.', 'Take on empty stomach, alone.')
        },
        { 
          name: 'Corticosteroids (Prednisone)', 
          use: t('Inflamación, Autoinmune', 'Inflammation, Autoimmune'), 
          alert: t('Hiperglucemia, Infección, Cushing', 'Hyperglycemia, Infection, Cushing'), 
          contra: t('Infección fúngica', 'Fungal infection'),
          details: t('No parar de golpe. Estrés = Subir dosis.', 'Do not stop abruptly. Stress = Up dose.')
        }
      ]
    },
    {
      title: { es: 'Respiratorio', en: 'Respiratory' },
      icon: 'fa-lungs',
      color: 'cyan',
      drugs: [
        { 
          name: 'Albuterol (SABA)', 
          use: t('Rescate Asma', 'Asthma Rescue'), 
          alert: t('Taquicardia, Temblor', 'Tachycardia, Tremor'), 
          contra: t('Taquiarritmias', 'Tachyarrhythmias'),
          details: t('El ÚNICO inhalador de rescate.', 'The ONLY rescue inhaler.')
        },
        { 
          name: 'Salmeterol / Montelukast', 
          use: t('Control Largo Plazo', 'Long Term Control'), 
          alert: t('NO ES RESCATE', 'NOT RESCUE'), 
          contra: t('Crisis aguda', 'Acute attack'),
          details: t('Salmeterol siempre con esteroide.', 'Salmeterol always with steroid.')
        },
        { 
          name: 'Ipratropium (Anticolinérgico)', 
          use: t('EPOC / Asma', 'COPD / Asthma'), 
          alert: t('Boca seca, Retención urinaria', 'Dry mouth, Urinary retention'), 
          contra: t('Glaucoma, Alergia Cacahuete', 'Glaucoma, Peanut Allergy'),
          details: t('Chupar caramelos sin azúcar.', 'Suck sugar-free candy.')
        },
        { 
          name: 'Fluticasone / Budesonide', 
          use: t('Esteroide Inhalado', 'Inhaled Steroid'), 
          alert: t('Candidiasis Oral (Hongos)', 'Oral Thrush (Fungal)'), 
          contra: t('Status Asthmaticus', 'Status Asthmaticus'),
          details: t('Enjuagar boca y escupir después de uso.', 'Rinse and spit after use.')
        }
      ]
    },
    {
      title: { es: 'Gastrointestinal', en: 'Gastrointestinal' },
      icon: 'fa-stomach',
      color: 'amber',
      drugs: [
        { 
          name: 'Omeprazole (PPI)', 
          use: t('Reflujo, Úlceras', 'GERD, Ulcers'), 
          alert: t('C. diff, Osteoporosis (Largo plazo)', 'C. diff, Osteoporosis (Long term)'), 
          contra: t('Hipersensibilidad', 'Hypersensitivity'),
          details: t('Tomar 30 min antes desayuno.', 'Take 30 min before breakfast.')
        },
        { 
          name: 'Sucralfate', 
          use: t('Protector Mucosa', 'Mucosal Protectant'), 
          alert: t('Estreñimiento', 'Constipation'), 
          contra: t('Obstrucción GI', 'GI Obstruction'),
          details: t('Tomar con estómago vacío. Separa de otros meds.', 'Take on empty stomach. Separate from other meds.')
        },
        { 
          name: 'Ondansetron', 
          use: t('Antiemético', 'Antiemetic'), 
          alert: t('QT Largo (Torsades)', 'Long QT (Torsades)'), 
          contra: t('Síndrome QT largo', 'Long QT Syndrome'),
          details: t('IV lento. Cefalea es común.', 'Slow IV. Headache common.')
        },
        { 
          name: 'Metoclopramide', 
          use: t('Gastroparesia, Náusea', 'Gastroparesis, Nausea'), 
          alert: t('EPS (Diskinesia Tardía)', 'EPS (Tardive Dyskinesia)'), 
          contra: t('Obstrucción/Sangrado GI', 'GI Obstruction/Bleed'),
          details: t('Reportar movimientos involuntarios.', 'Report involuntary movements.')
        },
        { 
          name: 'Laxatives (Docusate/Senna)', 
          use: t('Estreñimiento', 'Constipation'), 
          alert: t('Deshidratación, Abuso', 'Dehydration, Abuse'), 
          contra: t('Obstrucción intestinal', 'Bowel obstruction'),
          details: t('Beber mucha agua.', 'Drink plenty of water.')
        }
      ]
    },
    {
      title: { es: 'Neuro / Dolor', en: 'Neuro / Pain' },
      icon: 'fa-brain',
      color: 'purple',
      drugs: [
        { 
          name: 'Opioids (Morphine/Hydro)', 
          use: t('Dolor Severo', 'Severe Pain'), 
          alert: t('Depresión Respiratoria (HIGH ALERT)', 'Resp Depression (HIGH ALERT)'), 
          contra: t('RR < 12', 'RR < 12'),
          details: t('Antídoto: Naloxona. Riesgo caídas.', 'Antidote: Naloxone. Fall risk.')
        },
        { 
          name: 'NSAIDs (Ibuprofen/Naproxen)', 
          use: t('Inflamación, Dolor', 'Inflammation, Pain'), 
          alert: t('Sangrado GI, Falla Renal', 'GI Bleed, Renal Failure'), 
          contra: t('Úlceras, CKD, Falla Cardíaca', 'Ulcers, CKD, Heart Failure'),
          details: t('Tomar con comida. No aspirina con niños.', 'Take with food. No aspirin for kids.')
        },
        {
          name: 'Ketorolac',
          use: t('Dolor Moderado/Severo (Corto plazo)', 'Mod/Severe Pain (Short term)'),
          alert: t('Falla Renal, Sangrado GI (Alto Riesgo)', 'Renal Failure, GI Bleed (High Risk)'),
          contra: t('Falla renal, Sangrado, >5 días', 'Renal failure, Bleeding, >5 days'),
          details: t('MÁXIMO 5 días de uso. Nefrotóxico potente.', 'MAX 5 days use. Potent nephrotoxic.')
        },
        { 
          name: 'Phenytoin', 
          use: t('Convulsiones', 'Seizures'), 
          alert: t('Hiperplasia Gingival, SJS', 'Gingival Hyperplasia, SJS'), 
          contra: t('Embarazo', 'Pregnancy'),
          details: t('Higiene dental. Rango 10-20.', 'Dental hygiene. Range 10-20.')
        },
        { 
          name: 'Valproate', 
          use: t('Convulsiones, Bipolar', 'Seizures, Bipolar'), 
          alert: t('Hepatotóxico', 'Hepatotoxic'), 
          contra: t('Falla Hepática, Embarazo', 'Liver Failure, Pregnancy'),
          details: t('Monitorizar función hepática.', 'Monitor liver function.')
        },
        { 
          name: 'Carbamazepine', 
          use: t('Convulsiones, Neuralgia', 'Seizures, Neuralgia'), 
          alert: t('Agranulocitosis (Baja defensas)', 'Agranulocytosis (Low WBC)'), 
          contra: t('Supresión médula ósea', 'Bone marrow suppression'),
          details: t('Reportar fiebre/dolor garganta.', 'Report fever/sore throat.')
        }
      ]
    },
    {
      title: { es: 'Salud Mental', en: 'Mental Health' },
      icon: 'fa-user-doctor',
      color: 'fuchsia',
      drugs: [
        { 
          name: 'SSRI (Sertraline, Fluoxetine)', 
          use: t('Depresión, Ansiedad', 'Depression, Anxiety'), 
          alert: t('Sd. Serotoninérgico, Suicidio', 'Serotonin Sd, Suicide'), 
          contra: t('IMAO (MAOI)', 'MAOI'),
          details: t('4 semanas para efecto. No parar de golpe.', '4 weeks for effect. Do not stop abruptly.')
        },
        { 
          name: 'MAOIs (Phenelzine)', 
          use: t('Depresión Resistente', 'Resistant Depression'), 
          alert: t('Crisis Hipertensiva (Tiramina)', 'Hypertensive Crisis (Tyramine)'), 
          contra: t('Quesos, Vino, Carnes curadas', 'Cheese, Wine, Cured meats'),
          details: t('Dieta estricta. Esperar 2 semanas wash-out.', 'Strict diet. 2 week wash-out period.')
        },
        { 
          name: 'Lithium', 
          use: t('Bipolar', 'Bipolar'), 
          alert: t('Toxicidad (>1.5), Temblor', 'Toxicity (>1.5), Tremor'), 
          contra: t('Deshidratación, Hiponatremia', 'Dehydration, Hyponatremia'),
          details: t('Ingesta normal de sal y agua.', 'Normal salt and water intake.')
        },
        { 
          name: 'Haloperidol (Typical)', 
          use: t('Psicosis Aguda', 'Acute Psychosis'), 
          alert: t('NMS (Fiebre/Rigidez), EPS', 'NMS (Fever/Rigidity), EPS'), 
          contra: t('Parkinson', 'Parkinson'),
          details: t('Antídoto EPS: Benztropine.', 'EPS Antidote: Benztropine.')
        },
        { 
          name: 'Clozapine (Atypical)', 
          use: t('Esquizofrenia Severa', 'Severe Schizophrenia'), 
          alert: t('Agranulocitosis (Fatal)', 'Agranulocytosis (Fatal)'), 
          contra: t('Neutropenia', 'Neutropenia'),
          details: t('Monitoreo semanal WBC obligatorio.', 'Weekly WBC monitoring required.')
        }
      ]
    },
    {
      title: { es: 'Infecciones', en: 'Infections' },
      icon: 'fa-virus',
      color: 'lime',
      drugs: [
        { 
          name: 'Penicillins / Cephalosporins', 
          use: t('Infecciones', 'Infections'), 
          alert: t('Anafilaxia, Alergia cruzada', 'Anaphylaxis, Cross allergy'), 
          contra: t('Alergia previa', 'Prior allergy'),
          details: t('Tener Epinefrina lista.', 'Have Epinephrine ready.')
        },
        { 
          name: 'Vancomycin', 
          use: t('MRSA, C. diff', 'MRSA, C. diff'), 
          alert: t('Hombre Rojo, Nefrotoxicidad', 'Red Man, Nephrotoxicity'), 
          contra: t('Alergia', 'Allergy'),
          details: t('Medir Valle (Trough). Infusión lenta.', 'Measure Trough. Slow infusion.')
        },
        { 
          name: 'Tetracyclines (Doxycycline)', 
          use: t('Acne, Lyme, ITS', 'Acne, Lyme, STI'), 
          alert: t('Fotosensibilidad, Mancha dientes', 'Photosensitivity, Teeth staining'), 
          contra: t('Embarazo, Niños <8', 'Pregnancy, Kids <8'),
          details: t('No lácteos/antiácidos. No acostarse.', 'No dairy/antacids. Do not lie down.')
        },
        { 
          name: 'Fluoroquinolones (Cipro)', 
          use: t('Infecciones, UTI', 'Infections, UTI'), 
          alert: t('Ruptura Tendón Aquiles', 'Achilles Tendon Rupture'), 
          contra: t('Tendinitis, Embarazo', 'Tendinitis, Pregnancy'),
          details: t('Evitar sol. Beber agua.', 'Avoid sun. Drink water.')
        },
        { 
          name: 'Metronidazole', 
          use: t('C. diff, Tricomoniasis', 'C. diff, Trichomoniasis'), 
          alert: t('Reacción Disulfiram (Alcohol)', 'Disulfiram Reaction (Alcohol)'), 
          contra: t('Alcohol (durante y 3 días post)', 'Alcohol (during & 3 days post)'),
          details: t('Sabor metálico normal.', 'Metallic taste normal.')
        }
      ]
    },
    {
      title: { es: 'Emergencias / Obstetricia', en: 'Emergencies / OB' },
      icon: 'fa-truck-medical',
      color: 'pink',
      drugs: [
        { 
          name: 'Epinephrine', 
          use: t('Anafilaxia, Paro', 'Anaphylaxis, Arrest'), 
          alert: t('Taquicardia, HTA', 'Tachycardia, HTN'), 
          contra: t('NINGUNA en paro/anafilaxia', 'NONE in arrest/anaphylaxis'),
          details: t('IM Muslo (Anafilaxia). IV (Paro).', 'IM Thigh (Anaphylaxis). IV (Arrest).')
        },
        { 
          name: 'Oxytocin', 
          use: t('Inducción Parto, Sangrado', 'Labor Induction, Bleeding'), 
          alert: t('Sufrimiento Fetal, Ruptura Uterina', 'Fetal Distress, Uterine Rupture'), 
          contra: t('Cesárea clásica, Placenta previa', 'Classic C-Section, Placenta previa'),
          details: t('Parar si contracciones <2 min.', 'Stop if contractions <2 min.')
        },
        { 
          name: 'RhoGAM', 
          use: t('Madre Rh Negativo', 'Rh Negative Mom'), 
          alert: t('Reacción alérgica', 'Allergic reaction'), 
          contra: t('Madre Rh Positivo', 'Rh Positive Mom'),
          details: t('Dar a las 28 sem y 72h post-parto.', 'Give at 28wks & 72h post-partum.')
        }
      ]
    }
  ];

  const antidotesList = [
    { p: 'Opioids', a: 'Naloxone', icon: '💉' },
    { p: 'Warfarin', a: 'Vit K + FFP', icon: '🩸' },
    { p: 'Heparin', a: 'Protamine Sulfate', icon: '⚗️' },
    { p: 'Benzos', a: 'Flumazenil', icon: '🧠' },
    { p: 'Acetaminophen', a: 'Acetylcysteine', icon: '💊' },
    { p: 'Digoxin', a: 'DigiFab', icon: '🛡️' },
    { p: 'Magnesium', a: 'Ca Gluconato', icon: '⚡' },
    { p: 'Anafilaxia', a: 'Epinephrine', icon: '🚨' },
    { p: 'EPS (Haldol)', a: 'Benztropine', icon: '🎭' }
  ];

  // --- 4. RENDER TEMPLATES (Separados de la lógica principal) ---

  const renderSectionHeader = (number, colorName, iconClass, titleEs, titleEn) => {
    const theme = getTheme(colorName);
    return `
      <div class="flex items-center gap-4 mb-8 pb-4 border-b ${theme.border} border-opacity-50 mt-12 first:mt-0">
        <div class="w-12 h-12 rounded-2xl bg-gradient-to-br ${theme.headerIcon} flex items-center justify-center text-white font-black text-xl shadow-lg">
          ${number}
        </div>
        <div>
          <h2 class="text-2xl font-black bg-gradient-to-r ${theme.headerText} bg-clip-text text-transparent">
            ${t(titleEs, titleEn)}
          </h2>
        </div>
      </div>
    `;
  };

  const renderSafetyRule = (r) => {
    const theme = getTheme(r.color);
    return `
      <div class="flex items-start gap-3 p-2 bg-white/80 dark:bg-gray-800/80 rounded-lg">
        <div class="w-6 h-6 rounded-full ${theme.iconBg} flex items-center justify-center flex-shrink-0 ${theme.iconText} text-xs">
          <i class="fa-solid ${r.icon}"></i>
        </div>
        <span class="text-sm text-gray-700 dark:text-gray-300 leading-tight">${r.text}</span>
      </div>
    `;
  };

  const renderOrgan = (o) => {
    const theme = getTheme(o.color);
    return `
      <div class="p-4 rounded-2xl border-l-4 ${theme.border.replace('border-opacity-50','').replace('border','border-l-4').split(' ')[0].replace('200','500')} bg-white dark:bg-gray-800 shadow-sm">
        <h4 class="font-bold text-gray-900 dark:text-white">${o.title}</h4>
        <div class="text-xs text-gray-500 mt-1">Labs: <span class="font-mono bg-gray-100 dark:bg-gray-700 px-1 rounded">${o.labs}</span></div>
        <div class="text-xs text-red-500 font-bold mt-2"><i class="fa-solid fa-triangle-exclamation"></i> ${o.alert}</div>
      </div>
    `;
  };

  const renderDrugCard = (d, sysColor) => {
    const theme = getTheme(sysColor);
    const isHighAlert = d.alert.includes('HIGH ALERT') || d.alert.includes('IV PUSH') || d.alert.includes('Fatal');

    return `
      <div class="group relative p-5 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:${theme.border.replace('200','400')} transition-all shadow-sm">
        
        ${isHighAlert ? 
          `<div class="absolute -top-3 right-4 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-md uppercase tracking-wide">HIGH ALERT</div>` 
          : ''}

        <div class="flex justify-between items-start mb-2">
          <div class="font-black text-lg text-gray-900 dark:text-white group-hover:${theme.text} transition-colors">
            ${escapeHTML(d.name)}
          </div>
        </div>
        
        <div class="mb-3">
          <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">${t('Uso:', 'Use:')}</span>
          <span class="text-sm font-medium text-gray-800 dark:text-gray-200 ml-1">${d.use}</span>
        </div>
        
        <div class="space-y-2">
          <div class="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
            <div class="flex gap-2">
              <i class="fa-solid fa-triangle-exclamation text-red-500 mt-0.5 text-xs"></i>
              <div class="text-sm text-red-700 dark:text-red-300 leading-snug font-bold">${d.alert}</div> 
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-700/20 p-2 rounded-lg border border-gray-100 dark:border-gray-700/30">
              <span class="text-xs font-bold text-gray-500 uppercase">NO USAR SI:</span>
              <div class="text-sm text-gray-700 dark:text-gray-300">${d.contra}</div>
          </div>
          
          <div class="text-xs text-gray-500 dark:text-gray-400 italic pl-2 border-l-2 border-gray-300 dark:border-gray-600 mt-2">
            ${d.details}
          </div>
        </div>
      </div>
    `;
  };

  const renderSuffixCard = (s) => {
    const theme = getTheme(s.c);
    const borderColor = theme.border.replace('border-opacity-50','').replace('border','border-l-4').split(' ')[0].replace('200','500');
    
    return `
      <div class="p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border-l-4 ${borderColor} shadow-sm hover:scale-[1.02] transition-all">
        <div class="flex justify-between items-start mb-2">
          <div class="font-black text-lg text-gray-800 dark:text-white">${s.display}</div>
          <span class="text-[10px] ${theme.iconBg} ${theme.text} px-2 py-1 rounded-full font-bold">${s.t}</span>
        </div>
        <div class="text-xs text-red-500 dark:text-red-400 font-medium flex items-start gap-1">
          <i class="fa-solid fa-triangle-exclamation mt-0.5"></i>
          <span>${s.a}</span>
        </div>
      </div>
    `;
  };

  // --- 5. MAIN REGISTER ---
  NCLEX.registerTopic({
    id: 'pharmacology',
    title: { es: 'Farmacología NCLEX®', en: 'NCLEX® Pharmacology' },
    subtitle: { es: 'Edición Completa: Heme, Neuro, Fluids & Endocrine', en: 'Full Edition: Heme, Neuro, Fluids & Endocrine' },
    icon: 'pills',
    color: 'emerald',

    render() {
      try {
        if (!medicationSystems || !Array.isArray(medicationSystems)) {
            return '<div class="p-4 bg-red-100 text-red-700">Error: Pharmacology data not loaded.</div>';
        }

        return `
          <header class="animate-fade-in flex flex-col gap-4 pb-8 mb-8 border-b border-gray-200 dark:border-gray-700">
            <h1 class="text-3xl md:text-5xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              ${t('Farmacología NCLEX®', 'NCLEX® Pharmacology')}
            </h1>
          </header>

          <div class="space-y-12 animate-slide-in-up">
            
            <section>
              ${renderSectionHeader(1, 'blue', 'fa-shield-virus', 'Seguridad y Evaluación Crítica', 'Safety & Critical Assessment')}
              
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div class="lg:col-span-1 space-y-4">
                  ${renderList(vitalOrgans, renderOrgan)}
                </div>
                <div class="lg:col-span-2 bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                  <h3 class="font-bold text-blue-900 dark:text-blue-200 mb-3">
                    <i class="fa-solid fa-check-double"></i> ${t('Reglas Críticas de Seguridad', 'Critical Safety Rules')}
                  </h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    ${renderList(safetyRules, renderSafetyRule)}
                  </div>
                </div>
              </div>
            </section>

            <section>
              ${renderSectionHeader(2, 'indigo', 'fa-chart-line', 'Niveles Terapéuticos', 'Therapeutic Levels')}
              <div class="overflow-x-auto rounded-2xl border border-gray-200/80 dark:border-gray-700/80 mb-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg">
                <table class="w-full text-sm">
                  <thead class="bg-gradient-to-r from-blue-600 to-blue-700 text-white uppercase text-xs">
                    <tr>
                      <th class="px-6 py-4 text-left">${t('Fármaco', 'Drug')}</th>
                      <th class="px-6 py-4 text-left">${t('Rango', 'Range')}</th>
                      <th class="px-6 py-4 text-left">${t('Tóxico', 'Toxic')}</th>
                      <th class="px-6 py-4 text-left hidden md:table-cell">${t('Notas Clínicas', 'Clinical Notes')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${renderList(therapeuticLevels, (i) => `
                      <tr class="border-b border-gray-100/50 dark:border-gray-700/50 hover:bg-gray-50/50 dark:hover:bg-gray-700/30">
                        <td class="px-6 py-4 font-bold text-gray-900 dark:text-white">${i.drug}</td>
                        <td class="px-6 py-4 font-mono text-green-600 dark:text-green-400">${i.range}</td>
                        <td class="px-6 py-4 text-red-500 font-bold">${i.toxic}</td>
                        <td class="px-6 py-4 text-gray-500 text-xs hidden md:table-cell">${i.note}</td>
                      </tr>
                    `)}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              ${renderSectionHeader(3, 'emerald', 'fa-tags', 'Sufijos (Cheat Sheet)', 'Suffixes (Cheat Sheet)')}
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                ${renderList(suffixesList, renderSuffixCard)}
              </div>
            </section>

            ${renderList(medicationSystems, (sys, index) => `
              <section>
                ${renderSectionHeader(index + 4, sys.color, 'fa-pills', sys.title.es, sys.title.en)}
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  ${renderList(sys.drugs, (d) => renderDrugCard(d, sys.color))}
                </div>
              </section>
            `)}

            <section>
              ${renderSectionHeader(medicationSystems.length + 4, 'slate', 'fa-flask', 'Antídotos de Emergencia', 'Emergency Antidotes')}
              <div class="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6 rounded-3xl shadow-2xl border border-gray-700/50">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  ${renderList(antidotesList, (a) => `
                    <div class="flex justify-between items-center py-2 px-3 border border-gray-700/30 rounded-lg hover:bg-white/5 bg-gray-800/50">
                      <div class="flex items-center gap-3">
                        <span class="text-xl">${a.icon}</span>
                        <span class="text-gray-300 font-medium text-sm">${a.p}</span>
                      </div>
                      <strong class="text-teal-400 text-xs uppercase tracking-wide">
                        ${a.a}
                      </strong>
                    </div>
                  `)}
                </div>
              </div>
            </section>

          </div>
        `;
      } catch (error) {
        console.error('Pharmacology render error:', error);
        return `<div class="p-6 bg-red-50 text-red-800 rounded-lg">Error rendering pharmacology module: ${error.message}</div>`;
      }
    }
  });
})();