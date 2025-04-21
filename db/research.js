import { getAllDocuments, getDocumentByUID } from '../lib/mongodb';

// export async function getInterventionsTableForAdmin(lang = 'en-us') {
//   // 1) Fetch all research docs
//   const researchDocs = await getAllDocuments('research', lang);

//   // 2) Collect all intervention UIDs
//   const allInterventionUids = new Set();
//   researchDocs.forEach(doc => {
//     if (!doc.data?.body) return;
//     doc.data.body
//       .filter(slice => slice.slice_type === 'interventions')
//       .forEach(slice => {
//         const iUid = slice.primary?.intervention?.uid;
//         if (iUid) allInterventionUids.add(iUid);
//       });
//   });

//   // 3) Fetch intervention docs by UID
//   const interventionDocs = await Promise.all(
//     Array.from(allInterventionUids).map(uid => getDocumentByUID('interventions', uid, lang))
//   );

//   // 4) Build lookup map: uid -> name
//   const interventionMap = interventionDocs.reduce((map, doc) => {
//     if (doc?.uid) {
//       const nameText = doc.data?.name?.[0]?.text || '';
//       map[doc.uid] = nameText;
//     }
//     return map;
//   }, {});

//   // 5) Assemble flat rows
//   const rows = [];
//   researchDocs.forEach(doc => {
//     if (!doc.data?.body) return;
//     const doi = doc.data?.doi || '';

//     doc.data.body
//       .filter(slice => slice.slice_type === 'interventions')
//       .forEach(slice => {
//         const uid = slice.primary?.intervention?.uid || '';
//         const fallbackText = slice.primary?.intervention_text?.[0]?.text || '';
//         const name = uid ? (interventionMap[uid] || fallbackText) : fallbackText;

//         rows.push({
//           intervention: name,
//           intervention_uid: uid,
//           doi
//         });
//       });
//   });

//   return rows;
// }


// export async function getOutcomesTableForAdmin(lang = 'en-us') {
//   // 1) Fetch all research docs
//   const researchDocs = await getAllDocuments('research', lang);

//   // 2) Collect all outcome UIDs
//   const allOutcomeUids = new Set();
//   researchDocs.forEach(doc => {
//     if (!doc.data?.body) return;
//     doc.data.body
//       .filter(slice => slice.slice_type === 'interventions')
//       .forEach(slice => {
//         slice.items.forEach(item => {
//           const oUid = item.outcomes1?.uid;
//           if (oUid) allOutcomeUids.add(oUid);
//         });
//       });
//   });

//   // 3) Fetch outcome docs by UID
//   const outcomeDocs = await Promise.all(
//     Array.from(allOutcomeUids).map(uid => getDocumentByUID('outcomes', uid, lang))
//   );

//   // 4) Build lookup map: uid -> title text
//   const outcomeMap = outcomeDocs.reduce((map, doc) => {
//     if (doc?.uid) {
//       const titleText = doc.data?.title?.[0]?.text || '';
//       map[doc.uid] = titleText;
//     }
//     return map;
//   }, {});

//   // 5) Assemble flat rows
//   const rows = [];
//   researchDocs.forEach(doc => {
//     if (!doc.data?.body) return;
//     const doi = doc.data?.doi || '';

//     doc.data.body
//       .filter(slice => slice.slice_type === 'interventions')
//       .forEach(slice => {
//         slice.items.forEach(item => {
//           const uid = item.outcomes1?.uid || '';
//           const fallbackText = item.outcome_text?.[0]?.text || '';
//           const name = uid ? (outcomeMap[uid] || fallbackText) : fallbackText;

//           rows.push({
//             outcome: name,
//             outcome_uid: uid,
//             doi
//           });
//         });
//       });
//   });

//   return rows;
// }





// export async function getInterventionsTable(lang = 'en-us') {
//     // Get all research documents
//     const researchDocs = await getAllDocuments('research', lang);

//     // Structure to store aggregated results
//     const interventionResults = new Map();

//     // Process each document
//     researchDocs.forEach(doc => {
//         if (!doc.data?.body) return;

//         // Find intervention slices
//         const interventionSlices = doc.data.body.filter(slice =>
//             slice.slice_type === 'interventions'
//         );

//         interventionSlices.forEach(slice => {
//             const interventionName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Intervention';

//             // Process each outcome
//             slice.items.forEach(item => {
//                 const outcomeName = item.outcome_text?.[0]?.text;
//                 if (!outcomeName) return;

//                 const key = `${interventionName}|||${outcomeName}`;

//                 if (!interventionResults.has(key)) {
//                     interventionResults.set(key, {
//                         intervention: interventionName,
//                         outcome: outcomeName,
//                         totalStudies: 0,
//                         effectivenessPoints: 0,
//                         biasPoints: 0,
//                         studySizeSum: 0
//                     });
//                 }

//                 const result = interventionResults.get(key);

//                 // Convert study size to points
//                 let studySizePoints = 1; // Small by default
//                 const studySize = doc.data?.size_group?.[0]?.study_size || '';
//                 if (studySize.includes('Medium')) studySizePoints = 2;
//                 else if (studySize.includes('Large')) studySizePoints = 3;

//                 // Add effectiveness points
//                 const effectivenessRank = item.rank_value || 0;
//                 result.effectivenessPoints += (effectivenessRank * studySizePoints);

//                 // Add bias points
//                 const biasLevel = doc.data?.bias_overall || 'Low';
//                 let biasPoints = 1; // Low
//                 if (biasLevel === 'Some Concerns') biasPoints = 2;
//                 else if (biasLevel === 'High') biasPoints = 3;
//                 else if (biasLevel === 'Very High') biasPoints = 4;

//                 result.biasPoints += (biasPoints * studySizePoints);
//                 result.studySizeSum += studySizePoints;
//                 result.totalStudies++;
//             });
//         });
//     });

//     // Calculate and format final results
//     const interventionsMap = new Map();

//     interventionResults.forEach(result => {
//         // Calculate weighted effectiveness average
//         const weightedEffectiveness = Math.round(result.effectivenessPoints / result.studySizeSum);
//         let effectivenessLabel = 'Low';
//         if (weightedEffectiveness === 2) effectivenessLabel = 'Med';
//         else if (weightedEffectiveness >= 3) effectivenessLabel = 'High';

//         // Calculate weighted bias average
//         const weightedBias = Math.round(result.biasPoints / result.studySizeSum);
//         let biasLabel = 'Low';
//         if (weightedBias === 2) biasLabel = 'Some Concerns';
//         else if (weightedBias === 3) biasLabel = 'High';
//         else if (weightedBias >= 4) biasLabel = 'Very High';

//         // Create or update intervention entry
//         if (!interventionsMap.has(result.intervention)) {
//             interventionsMap.set(result.intervention, {
//                 intervention: result.intervention,
//                 outcomes: []
//             });
//         }

//         // Add outcome to intervention
//         const interventionEntry = interventionsMap.get(result.intervention);
//         interventionEntry.outcomes.push({
//             name: result.outcome,
//             effectiveness: effectivenessLabel,
//             studies: result.totalStudies,
//             bias: biasLabel
//         });
//     });

//     // Convert Map to array
//     return Array.from(interventionsMap.values());
// }

// export async function getOutcomesTable(lang = 'en-us') {
//     // Get all research documents
//     const researchDocs = await getAllDocuments('research', lang);

//     // Structure to store aggregated results
//     const outcomeResults = new Map();

//     // Process each document
//     researchDocs.forEach(doc => {
//         if (!doc.data?.body) return;

//         // Find intervention slices
//         const interventionSlices = doc.data.body.filter(slice =>
//             slice.slice_type === 'interventions'
//         );

//         interventionSlices.forEach(slice => {
//             const interventionName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Intervention';

//             // Process each outcome
//             slice.items.forEach(item => {
//                 const outcomeName = item.outcome_text?.[0]?.text;
//                 if (!outcomeName) return;

//                 const key = `${outcomeName}|||${interventionName}`;

//                 if (!outcomeResults.has(key)) {
//                     outcomeResults.set(key, {
//                         outcome: outcomeName,
//                         intervention: interventionName,
//                         totalStudies: 0,
//                         effectivenessPoints: 0,
//                         biasPoints: 0,
//                         studySizeSum: 0
//                     });
//                 }

//                 const result = outcomeResults.get(key);

//                 // Convert study size to points
//                 let studySizePoints = 1; // Small by default
//                 const studySize = doc.data?.size_group?.[0]?.study_size || '';
//                 if (studySize.includes('Medium')) studySizePoints = 2;
//                 else if (studySize.includes('Large')) studySizePoints = 3;

//                 // Add effectiveness points
//                 const effectivenessRank = item.rank_value || 0;
//                 result.effectivenessPoints += (effectivenessRank * studySizePoints);

//                 // Add bias points
//                 const biasLevel = doc.data?.bias_overall || 'Low';
//                 let biasPoints = 1; // Low
//                 if (biasLevel === 'Some Concerns') biasPoints = 2;
//                 else if (biasLevel === 'High') biasPoints = 3;
//                 else if (biasLevel === 'Very High') biasPoints = 4;

//                 result.biasPoints += (biasPoints * studySizePoints);
//                 result.studySizeSum += studySizePoints;
//                 result.totalStudies++;
//             });
//         });
//     });

//     // Calculate and format final results
//     const outcomesMap = new Map();

//     outcomeResults.forEach(result => {
//         // Calculate weighted effectiveness average
//         const weightedEffectiveness = Math.round(result.effectivenessPoints / result.studySizeSum);
//         let effectivenessLabel = 'Low';
//         if (weightedEffectiveness === 2) effectivenessLabel = 'Med';
//         else if (weightedEffectiveness >= 3) effectivenessLabel = 'High';

//         // Calculate weighted bias average
//         const weightedBias = Math.round(result.biasPoints / result.studySizeSum);
//         let biasLabel = 'Low';
//         if (weightedBias === 2) biasLabel = 'Some Concerns';
//         else if (weightedBias === 3) biasLabel = 'High';
//         else if (weightedBias >= 4) biasLabel = 'Very High';

//         // Create or update outcome entry
//         if (!outcomesMap.has(result.outcome)) {
//             outcomesMap.set(result.outcome, {
//                 outcome: result.outcome,
//                 interventions: []
//             });
//         }

//         // Add intervention to outcome
//         const outcomeEntry = outcomesMap.get(result.outcome);
//         outcomeEntry.interventions.push({
//             name: result.intervention,
//             effectiveness: effectivenessLabel,
//             studies: result.totalStudies,
//             bias: biasLabel
//         });
//     });

//     // Convert Map to array
//     return Array.from(outcomesMap.values());
// }




// Added the logic of Fetching UIDS
export async function getInterventionsTable(lang = 'en-us') {
    // 1) Fetch all research docs
    const researchDocs = await getAllDocuments('research', lang);
  
    // 2) Collect all UIDs
    const allOutcomeUids = [];
    const allInterventionUids = [];
    researchDocs.forEach(doc => {
      if (!doc.data?.body) return;
      const slices = doc.data.body.filter(s => s.slice_type === 'interventions');
      slices.forEach(slice => {
        // intervention ref
        const iUid = slice.primary?.intervention?.uid;
        if (iUid) allInterventionUids.push(iUid);
        // outcomes refs
        slice.items.forEach(item => {
          const oUid = item.outcomes1?.uid;
          if (oUid) allOutcomeUids.push(oUid);
        });
      });
    });
  
    // 3) Dedupe
    const uniqueOutcomeUids = Array.from(new Set(allOutcomeUids));
    const uniqueInterventionUids = Array.from(new Set(allInterventionUids));
  
    // 4) Fetch referenced docs
    const outcomeDocs = await Promise.all(
      uniqueOutcomeUids.map(uid => getDocumentByUID('outcomes', uid, lang))
    );
    const interventionDocs = await Promise.all(
      uniqueInterventionUids.map(uid => getDocumentByUID('interventions', uid, lang))
    );
  
    // 5) Build lookup maps
    const outcomeMap = outcomeDocs.reduce((map, d) => {
      if (d?.uid) map[d.uid] = d;
      return map;
    }, {});
    const interventionMap = interventionDocs.reduce((map, d) => {
      if (d?.uid) map[d.uid] = d;
      return map;
    }, {});
  

 
    // 6) Aggregate
    const interventionResults = new Map();

  

    researchDocs.forEach(doc => {
      if (!doc.data?.body) return;
      const slices = doc.data.body.filter(s => s.slice_type === 'interventions');
  
      slices.forEach(slice => {
        // determine name via UID or fallback
        const iUid = slice.primary?.intervention?.uid;
        let interventionName = iUid
          ? interventionMap[iUid]?.data?.name?.[0]?.text
          : undefined;

          console.log('InterventioNamebyUID: ', interventionName)
         
        if (!interventionName) {
          interventionName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Intervention';
        }
  
        slice.items.forEach(item => {
          // outcome name via UID or fallback
          const oUid = item.outcomes1?.uid;
          let outcomeName = oUid
            ? outcomeMap[oUid]?.data?.title?.[0]?.text
            : undefined;
          if (!outcomeName) {
            outcomeName = item.outcome_text?.[0]?.text;
          }
          if (!outcomeName) return;
  
          const key = `${interventionName}|||${outcomeName}`;
          if (!interventionResults.has(key)) {
            interventionResults.set(key, {
              intervention: interventionName,
              outcome: outcomeName,
              totalStudies: 0,
              effectivenessPoints: 0,
              biasPoints: 0,
              studySizeSum: 0
            });
          }
  
          const result = interventionResults.get(key);
  
          // study size points
          let studySizePoints = 1;
          const studySize = doc.data?.size_group?.[0]?.study_size || '';
          if (studySize.includes('Medium')) studySizePoints = 2;
          else if (studySize.includes('Large')) studySizePoints = 3;
  
          // add effectiveness
          const effRank = item.rank_value || 0;
          result.effectivenessPoints += effRank * studySizePoints;
  
          // bias
          const biasLevel = doc.data?.bias_overall || 'Low';
          let biasPoints = 1;
          if (biasLevel === 'Some Concerns') biasPoints = 2;
          else if (biasLevel === 'High') biasPoints = 3;
          else if (biasLevel === 'Very High') biasPoints = 4;
          result.biasPoints += biasPoints * studySizePoints;
  
          result.studySizeSum += studySizePoints;
          result.totalStudies++;
        });
      });
    });
  
    // 7) Build final structure
    const interventionsMap = new Map();
    interventionResults.forEach(r => {
      const avgEff = Math.round(r.effectivenessPoints / r.studySizeSum);
      let effLabel = 'Low';
      if (avgEff === 2) effLabel = 'Med';
      else if (avgEff >= 3) effLabel = 'High';
  
      const avgBias = Math.round(r.biasPoints / r.studySizeSum);
      let biasLabel = 'Low';
      if (avgBias === 2) biasLabel = 'Some Concerns';
      else if (avgBias === 3) biasLabel = 'High';
      else if (avgBias >= 4) biasLabel = 'Very High';
  
      if (!interventionsMap.has(r.intervention)) {
        interventionsMap.set(r.intervention, {
          intervention: r.intervention,
          outcomes: []
        });
      }
      interventionsMap.get(r.intervention).outcomes.push({
        name: r.outcome,
        effectiveness: effLabel,
        studies: r.totalStudies,
        bias: biasLabel
      });
    });
  
    return Array.from(interventionsMap.values());
  }
  
  export async function getOutcomesTable(lang = 'en-us') {
    // 1) Fetch all research docs
    const researchDocs = await getAllDocuments('research', lang);
  
    // 2) Collect UIDs
    const allOutcomeUids = [];
    const allInterventionUids = [];
    researchDocs.forEach(doc => {
      if (!doc.data?.body) return;
      const slices = doc.data.body.filter(s => s.slice_type === 'interventions');
      slices.forEach(slice => {
        const iUid = slice.primary?.intervention?.uid;
        if (iUid) allInterventionUids.push(iUid);
        slice.items.forEach(item => {
          const oUid = item.outcomes1?.uid;
          if (oUid) allOutcomeUids.push(oUid);
        });
      });
    });
  
    const uniqueOutcomeUids = Array.from(new Set(allOutcomeUids));
    const uniqueInterventionUids = Array.from(new Set(allInterventionUids));
  
    const outcomeDocs = await Promise.all(
      uniqueOutcomeUids.map(uid => getDocumentByUID('outcomes', uid, lang))
    );
    const interventionDocs = await Promise.all(
      uniqueInterventionUids.map(uid => getDocumentByUID('interventions', uid, lang))
    );
  
    const outcomeMap = outcomeDocs.reduce((m, d) => { if (d?.uid) m[d.uid] = d; return m; }, {});
    const interventionMap = interventionDocs.reduce((m, d) => { if (d?.uid) m[d.uid] = d; return m; }, {});
  
    // 3) Aggregate by outcome
    const outcomeResults = new Map();
    researchDocs.forEach(doc => {
      if (!doc.data?.body) return;
      const slices = doc.data.body.filter(s => s.slice_type === 'interventions');
      slices.forEach(slice => {
        const iUid = slice.primary?.intervention?.uid;
        let interventionName = iUid
          ? interventionMap[iUid]?.data?.name?.[0]?.text
          : undefined;
        if (!interventionName) {
          interventionName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Intervention';
        }
  
        slice.items.forEach(item => {
          const oUid = item.outcomes1?.uid;
          let outcomeName = oUid
            ? outcomeMap[oUid]?.data?.title?.[0]?.text
            : undefined;
          if (!outcomeName) {
            outcomeName = item.outcome_text?.[0]?.text;
          }
          if (!outcomeName) return;
  
          const key = `${outcomeName}|||${interventionName}`;
          if (!outcomeResults.has(key)) {
            outcomeResults.set(key, {
              outcome: outcomeName,
              intervention: interventionName,
              totalStudies: 0,
              effectivenessPoints: 0,
              biasPoints: 0,
              studySizeSum: 0
            });
          }
  
          const res = outcomeResults.get(key);
          let studySizePoints = 1;
          const studySize = doc.data?.size_group?.[0]?.study_size || '';
          if (studySize.includes('Medium')) studySizePoints = 2;
          else if (studySize.includes('Large')) studySizePoints = 3;
  
          const effRank = item.rank_value || 0;
          res.effectivenessPoints += effRank * studySizePoints;
  
          const biasLevel = doc.data?.bias_overall || 'Low';
          let biasPts = 1;
          if (biasLevel === 'Some Concerns') biasPts = 2;
          else if (biasLevel === 'High') biasPts = 3;
          else if (biasLevel === 'Very High') biasPts = 4;
          res.biasPoints += biasPts * studySizePoints;
  
          res.studySizeSum += studySizePoints;
          res.totalStudies++;
        });
      });
    });
  
    // 4) Build final array
    const outcomesMap = new Map();
    outcomeResults.forEach(r => {
      const avgEff = Math.round(r.effectivenessPoints / r.studySizeSum);
      let effLabel = 'Low';
      if (avgEff === 2) effLabel = 'Med';
      else if (avgEff >= 3) effLabel = 'High';
  
      const avgBias = Math.round(r.biasPoints / r.studySizeSum);
      let biasLabel = 'Low';
      if (avgBias === 2) biasLabel = 'Some Concerns';
      else if (avgBias === 3) biasLabel = 'High';
      else if (avgBias >= 4) biasLabel = 'Very High';
  
      if (!outcomesMap.has(r.outcome)) {
        outcomesMap.set(r.outcome, { outcome: r.outcome, interventions: [] });
      }
      outcomesMap.get(r.outcome).interventions.push({
        name: r.intervention,
        effectiveness: effLabel,
        studies: r.totalStudies,
        bias: biasLabel
      });
    });
  
    return Array.from(outcomesMap.values());
  }

// New

  export async function getInterventionsTableForAdmin(lang = 'en-us') {
    // 1) fetch all research docs
    const researchDocs = await getAllDocuments('research', lang);
  
    // 2) collect all intervention UIDs
    const uids = [];
    researchDocs.forEach(doc => {
      const slices = doc.data?.body?.filter(s => s.slice_type === 'interventions') || [];
      slices.forEach(slice => {
        const iUid = slice.primary?.intervention?.uid;
        if (iUid) uids.push(iUid);
      });
    });
    const uniqueUids = Array.from(new Set(uids));
  
    // 3) fetch intervention docs in one go
    const interventionDocs = await Promise.all(
      uniqueUids.map(uid => getDocumentByUID('interventions', uid, lang))
    );
    const interventionMap = interventionDocs.reduce((m, d) => {
      if (d?.uid) m[d.uid] = d;
      return m;
    }, {});
  
    // 4) build flat admin table
    const table = [];
    researchDocs.forEach(doc => {
      const doi = doc.data?.doi?.[0]?.text || '';
      const researchTitle = doc.data?.title?.[0]?.text || 'Untitled';
      const slices = doc.data?.body?.filter(s => s.slice_type === 'interventions') || [];
      slices.forEach(slice => {
        // use UID‐lookup title or fallback to inline text
        const iUid = slice.primary?.intervention?.uid;
        const title = iUid
          ? interventionMap[iUid]?.data?.name?.[0]?.text
          : "N/A";
        const intervention = title;
        const intervention_text = slice.primary?.intervention_text?.[0]?.text || '';
        table.push({ intervention, intervention_text, doi, title: researchTitle });
      });
    });
  
    return table;
  }
  
  export async function getOutcomesTableForAdmin(lang = 'en-us') {
    // 1) fetch all research docs
    const researchDocs = await getAllDocuments('research', lang);
  
    // 2) collect all outcome UIDs
    const uids = [];
    researchDocs.forEach(doc => {
      const slices = doc.data?.body?.filter(s => s.slice_type === 'interventions') || [];
      slices.forEach(slice => {
        slice.items.forEach(item => {
          const oUid = item.outcomes1?.uid;
          if (oUid) uids.push(oUid);
        });
      });
    });
    const uniqueUids = Array.from(new Set(uids));
  
    // 3) fetch outcome docs in one go
    const outcomeDocs = await Promise.all(
      uniqueUids.map(uid => getDocumentByUID('outcomes', uid, lang))
    );
    const outcomeMap = outcomeDocs.reduce((m, d) => {
      if (d?.uid) m[d.uid] = d;
      return m;
    }, {});
  
    // 4) build flat admin table
    const table = [];
    researchDocs.forEach(doc => {
      const doi = doc.data?.doi?.[0]?.text || '';
      const researchTitle = doc.data?.title?.[0]?.text || 'Untitled';
      const slices = doc.data?.body?.filter(s => s.slice_type === 'interventions') || [];
      slices.forEach(slice => {
        slice.items.forEach(item => {
          // use UID‐lookup title or fallback to inline text
          const oUid = item.outcomes1?.uid;
          const title = oUid
            ? outcomeMap[oUid]?.data?.title?.[0]?.text
            : "N/A";
          const outcome = title || '';
          const outcome_text = item.outcome_text?.[0]?.text || '';
          table.push({ outcome, outcome_text, doi, title: researchTitle });
        //   console.log("Outcome<>", outcome, "outcome_text<>", outcome_text, "doi<>", doi);
        });
      });
    });
  
    return table;
  }

  
export async function getMedicationsTable(lang = 'en-us') {
    // Get all research documents
    const researchDocs = await getAllDocuments('research', lang);

    // Structure to store aggregated results
    const medicationResults = new Map();

    // Process each document
    researchDocs.forEach(doc => {
        if (!doc.data?.body) return;

        // Find intervention slices that are medications
        const medicationSlices = doc.data.body.filter(slice =>
            slice.slice_type === 'interventions' &&
            slice.primary?.intervention_type === 'Medicine'
        );

        medicationSlices.forEach(slice => {
            const medicationName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Medication';

            // Process each outcome
            slice.items.forEach(item => {
                const outcomeName = item.outcome_text?.[0]?.text;
                if (!outcomeName) return;

                const key = `${medicationName}|||${outcomeName}`;

                if (!medicationResults.has(key)) {
                    medicationResults.set(key, {
                        medication: medicationName,
                        outcome: outcomeName,
                        totalStudies: 0,
                        effectivenessPoints: 0,
                        biasPoints: 0,
                        studySizeSum: 0
                    });
                }

                const result = medicationResults.get(key);

                // Convert study size to points
                let studySizePoints = 1; // Small by default
                const studySize = doc.data?.size_group?.[0]?.study_size || '';
                if (studySize.includes('Medium')) studySizePoints = 2;
                else if (studySize.includes('Large')) studySizePoints = 3;

                // Add effectiveness points
                const effectivenessRank = item.rank_value || 0;
                result.effectivenessPoints += (effectivenessRank * studySizePoints);

                // Add bias points
                const biasLevel = doc.data?.bias_overall || 'Low';
                let biasPoints = 1; // Low
                if (biasLevel === 'Some Concerns') biasPoints = 2;
                else if (biasLevel === 'High') biasPoints = 3;
                else if (biasLevel === 'Very High') biasPoints = 4;

                result.biasPoints += (biasPoints * studySizePoints);
                result.studySizeSum += studySizePoints;
                result.totalStudies++;
            });
        });
    });

    // Calculate and format final results
    const medicationsMap = new Map();

    medicationResults.forEach(result => {
        // Calculate weighted effectiveness average
        const weightedEffectiveness = Math.round(result.effectivenessPoints / result.studySizeSum);
        let effectivenessLabel = 'Low';
        if (weightedEffectiveness === 2) effectivenessLabel = 'Med';
        else if (weightedEffectiveness >= 3) effectivenessLabel = 'High';

        // Calculate weighted bias average
        const weightedBias = Math.round(result.biasPoints / result.studySizeSum);
        let biasLabel = 'Low';
        if (weightedBias === 2) biasLabel = 'Some Concerns';
        else if (weightedBias === 3) biasLabel = 'High';
        else if (weightedBias >= 4) biasLabel = 'Very High';

        // Create or update medication entry
        if (!medicationsMap.has(result.medication)) {
            medicationsMap.set(result.medication, {
                medication: result.medication,
                outcomes: []
            });
        }

        // Add outcome to medication
        const medicationEntry = medicationsMap.get(result.medication);
        medicationEntry.outcomes.push({
            name: result.outcome,
            effectiveness: effectivenessLabel,
            studies: result.totalStudies,
            bias: biasLabel
        });
    });

    // Convert Map to array
    return Array.from(medicationsMap.values());
}

export async function getSupplementsTable(lang = 'en-us') {
    // Get all research documents
    const researchDocs = await getAllDocuments('research', lang);

    // Structure to store aggregated results
    const supplementResults = new Map();

    // Process each document
    researchDocs.forEach(doc => {
        if (!doc.data?.body) return;

        // Find intervention slices that are supplements
        const supplementSlices = doc.data.body.filter(slice =>
            slice.slice_type === 'interventions' &&
            slice.primary?.intervention_type === 'Supplement'
        );

        supplementSlices.forEach(slice => {
            const supplementName = slice.primary?.intervention_text?.[0]?.text || 'Unknown Supplement';

            // Process each outcome
            slice.items.forEach(item => {
                const outcomeName = item.outcome_text?.[0]?.text;
                if (!outcomeName) return;

                const key = `${supplementName}|||${outcomeName}`;

                if (!supplementResults.has(key)) {
                    supplementResults.set(key, {
                        supplement: supplementName,
                        outcome: outcomeName,
                        totalStudies: 0,
                        effectivenessPoints: 0,
                        biasPoints: 0,
                        studySizeSum: 0
                    });
                }

                const result = supplementResults.get(key);

                // Convert study size to points
                let studySizePoints = 1; // Small by default
                const studySize = doc.data?.size_group?.[0]?.study_size || '';
                if (studySize.includes('Medium')) studySizePoints = 2;
                else if (studySize.includes('Large')) studySizePoints = 3;

                // Add effectiveness points
                const effectivenessRank = item.rank_value || 0;
                result.effectivenessPoints += (effectivenessRank * studySizePoints);

                // Add bias points
                const biasLevel = doc.data?.bias_overall || 'Low';
                let biasPoints = 1; // Low
                if (biasLevel === 'Some Concerns') biasPoints = 2;
                else if (biasLevel === 'High') biasPoints = 3;
                else if (biasLevel === 'Very High') biasPoints = 4;

                result.biasPoints += (biasPoints * studySizePoints);
                result.studySizeSum += studySizePoints;
                result.totalStudies++;
            });
        });
    });

    // Calculate and format final results
    const supplementsMap = new Map();

    supplementResults.forEach(result => {
        // Calculate weighted effectiveness average
        const weightedEffectiveness = Math.round(result.effectivenessPoints / result.studySizeSum);
        let effectivenessLabel = 'Low';
        if (weightedEffectiveness === 2) effectivenessLabel = 'Med';
        else if (weightedEffectiveness >= 3) effectivenessLabel = 'High';

        // Calculate weighted bias average
        const weightedBias = Math.round(result.biasPoints / result.studySizeSum);
        let biasLabel = 'Low';
        if (weightedBias === 2) biasLabel = 'Some Concerns';
        else if (weightedBias === 3) biasLabel = 'High';
        else if (weightedBias >= 4) biasLabel = 'Very High';

        // Create or update supplement entry
        if (!supplementsMap.has(result.supplement)) {
            supplementsMap.set(result.supplement, {
                supplement: result.supplement,
                outcomes: []
            });
        }

        // Add outcome to supplement
        const supplementEntry = supplementsMap.get(result.supplement);
        supplementEntry.outcomes.push({
            name: result.outcome,
            effectiveness: effectivenessLabel,
            studies: result.totalStudies,
            bias: biasLabel
        });
    });

    // Convert Map to array
    return Array.from(supplementsMap.values());
}

export async function getAllResearchStudies(lang = 'en-us') {
    const researchDocs = await getAllDocuments('research', lang);
    const studies = [];

    researchDocs.forEach(doc => {
        if (!doc.data?.body) return;

        const baseStudyInfo = {
            uid: doc.uid,
            title: doc.data?.title?.[0]?.text || 'Unknown Title',
            size: doc.data?.size_group?.[0]?.study_size || 'Unknown Size',
            bias: doc.data?.bias_overall || 'Unknown Bias'
        };

        // Process interventions
        const interventionSlices = doc.data.body.filter(slice =>
            slice.slice_type === 'interventions'
        );

        interventionSlices.forEach(slice => {
            const interventionName = slice.primary?.intervention_text?.[0]?.text;
            const interventionType = slice.primary?.intervention_type;
            
            // Determine the type based on various conditions
            let type = 'intervention';
            if (interventionType === 'Medicine') {
                type = 'medication';
            } else if (
                interventionType === 'Supplement' ||
                doc.data?.domain_group?.some(d => 
                    d.domain_text?.[0]?.text === 'Supplements' ||
                    d.domain_text?.[0]?.text === 'Dietary Supplements'
                ) ||
                interventionName?.toLowerCase().includes('supplement') ||
                interventionName?.toLowerCase().includes('vitamin') ||
                interventionName?.toLowerCase().includes('mineral')
            ) {
                type = 'supplement';
            }

            slice.items.forEach(item => {
                const outcomeName = item.outcome_text?.[0]?.text;
                if (!outcomeName || !interventionName) return;

                studies.push({
                    ...baseStudyInfo,
                    type,
                    intervention: interventionName,
                    outcome: outcomeName,
                    effectiveness: item.rank_value || 0
                });
            });
        });
    });

    return studies;
}