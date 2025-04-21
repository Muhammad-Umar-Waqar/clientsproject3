// import { formatTextWithSpans } from '../content-parser';

// export function mapResearchData(post) {
//   return {
//     title: post.data?.title?.[0]?.text,
//     publisher: post.data?.publisher?.[0]?.text,
//     publishDate: post.data?.publication_year,
//     domains: post.data?.domain_group?.map(d => d.domain_text?.map(t => t.text)).filter(Boolean) || [],
//     summary: post.data?.tldr?.map(t => t.text).join('\n') || '',
//     studyDesign: {
//       interventions: post.data?.body?.map(section => 
//         section.primary?.intervention_text?.map(t => t.text)
//       ).flat().filter(Boolean) || [],
//       studyType: post.data?.study_type_group?.map(t => t.study_type) || [],
//       outcomes: post.data?.body?.map(section => 
//         section.items?.map(item => 
//           item.outcome_text?.map(t => t.text)
//         )
//       ).flat(2).filter(Boolean) || [],
//       outcomes1: post.data?.body
//       ?.map(section =>
//         section.items?.map(item => item.outcomes1?.uid)
//       )
//       .flat(2).filter(Boolean) || [],
//       duration: post.data?.duration_group?.map(d => d.study_duration) || [],
//       size: post.data?.size_group?.map(s => s.study_size) || []
//     },
//     studyPopulation: {
//       ageRange: post.data?.age_group?.map(a => a.age) || [],
//       sex: post.data?.sex_group?.map(s => s.sex) || [],
//       geography: post.data?.region_group?.map(r => r.region) || [],
//       others: post.data?.other_char_group?.map(c => c.other_characteristics) || []
//     },
//     methodology: post.data?.methodology?.map(m => m.text) || [],
//     interventions: post.data?.intervention?.map(i => i.text) || [],
//     keyFindings: post.data?.key_findings?.map(k => k.text) || [],
//     comparison: post.data?.comparison_with_other_studies?.map(c => formatTextWithSpans(c.text, c.spans)) || [],
//     biasScore: post.data?.bias_overall,
//     effectivenessAnalysis: post.data?.body?.map(section => ({
//       intervention: section.primary?.intervention_text?.map(t => t.text) || [],
//       items: section.items?.map(item => ({
//         outcome: item.outcome_text?.map(t => t.text) || [],
//         effectiveness: item.effectiveness,
//         explanation: item.explanation?.map(e => e.text) || []
//       })) || []
//     })) || [],
//     journalReference: post.data?.journal_reference_ama?.map(r => formatTextWithSpans(r.text, r.spans)) || [],
//     headerImage: post.data?.screenshot_study_header?.url,
//     expertCards: post.data?.mentions_group?.filter(m => m.source === 'Expert')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || [],
//     onlineCards: post.data?.mentions_group?.filter(m => m.source === 'Online')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || [],
//     redditCards: post.data?.mentions_group?.filter(m => m.source === 'Reddit')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || [],
//     studyCards: post.data?.mentions_group?.filter(m => m.source === 'Studies')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || [],
//     xCards: post.data?.mentions_group?.filter(m => m.source === 'X')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || [],
//     youtubeCards: post.data?.mentions_group?.filter(m => m.source === 'YouTube')?.map(m => ({
//       title: m.title1?.[0]?.text || '',
//       author: m.name?.[0]?.text || '',
//       outboundLink: m.link?.url
//     })) || []
//   };
// }
















import { formatTextWithSpans } from '../content-parser';

export function mapResearchData(post, outcomeMap, interventionMap) {
  const outcomes1 = (post.data.body || [])
    .flatMap(section =>
      (section.items || []).map(item => item.outcomes1?.uid)
    )
    .filter(Boolean)
    .map(uid => {
      const doc = outcomeMap[uid];
      return  doc?.data?.title?.[0]?.text   || '(no title)'
});


const interventions1 = (post.data.body || [])
  .flatMap(section => {
    const primaries = Array.isArray(section.primary)
      ? section.primary
      : section.primary
        ? [section.primary]
        : [];
    return primaries
      .map(p => p.intervention?.uid)
      .filter(Boolean);
  })
  .map(uid => interventionMap[uid]?.data?.name?.[0]?.text || '(no title)');


// console.log("OUTCOMES1_", outcomes1);
// console.log("INTERVENTIONS1_", interventions1);
// console.log('datakeys:', Object.keys(post.data));
console.log('rawcopyright_license:', post.data?.copyright_license);

  return {
    title: post.data?.title?.[0]?.text,
    publisher: post.data?.publisher?.[0]?.text,
    publishDate: post.data?.publication_year,
    domains: post.data?.domain_group?.map(d => d.domain_text?.map(t => t.text)).filter(Boolean) || [],
    summary: post.data?.tldr?.map(t => t.text).join('\n') || '',
    studyDesign: {
      // interventions: post.data?.body?.map(section => 
      //   section.primary?.intervention_text?.map(t => t.text)
      // ).flat().filter(Boolean) || [] ,
      interventions: interventions1.length == 0 ? post.data?.body?.map(section => 
        section.primary?.intervention_text?.map(t => t.text)
      ).flat().filter(Boolean) || [] : interventions1,
      studyType: post.data?.study_type_group?.map(t => t.study_type) || [],
      prevOutcomes: post.data?.body?.map(section => 
        section.items?.map(item => 
          item.outcome_text?.map(t => t.text)
        )
      ).flat(2).filter(Boolean) || [],
      // outcomes1: post.data?.body
      // ?.map(section =>
      //   section.items?.map(item => item.outcomes1?.uid)
      // )
      // .flat(2).filter(Boolean) || [],
      // outcomes: post.data?.body?.map(section => 
      //           section.items?.map(item => 
      //             item.outcome_text?.map(t => t.text)
      //           )
      //         ).flat(2).filter(Boolean) || [],
      outcomes: outcomes1.length == 0 ? post.data?.body?.map(section => 
        section.items?.map(item => 
          item.outcome_text?.map(t => t.text)
        )
      ).flat(2).filter(Boolean) || [] : outcomes1,
      duration: post.data?.duration_group?.map(d => d.study_duration) || [],
      size: post.data?.size_group?.map(s => s.study_size) || []
    },
    studyPopulation: {
      ageRange: post.data?.age_group?.map(a => a.age) || [],
      sex: post.data?.sex_group?.map(s => s.sex) || [],
      geography: post.data?.region_group?.map(r => r.region) || [],
      others: post.data?.other_char_group?.map(c => c.other_characteristics) || []
    },
    methodology: post.data?.methodology?.map(m => m.text) || [],
    interventions: post.data?.intervention?.map(i => i.text) || [],
    keyFindings: post.data?.key_findings?.map(k => k.text) || [],
    comparison: post.data?.comparison_with_other_studies?.map(c => formatTextWithSpans(c.text, c.spans)) || [],
    biasScore: post.data?.bias_overall,
    effectivenessAnalysis: post.data?.body?.map(section => ({
      intervention: section.primary?.intervention_text?.map(t => t.text) || [],
      items: section.items?.map(item => ({
        outcome: item.outcome_text?.map(t => t.text) || [],
        effectiveness: item.effectiveness,
        explanation: item.explanation?.map(e => e.text) || []
      })) || []
    })) || [],
    journalReference: post.data?.journal_reference_ama?.map(r => formatTextWithSpans(r.text, r.spans)) || [],
    headerImage: post.data?.screenshot_study_header?.url,
    expertCards: post.data?.mentions_group?.filter(m => m.source === 'Expert')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    onlineCards: post.data?.mentions_group?.filter(m => m.source === 'Online')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    redditCards: post.data?.mentions_group?.filter(m => m.source === 'Reddit')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    studyCards: post.data?.mentions_group?.filter(m => m.source === 'Studies')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    xCards: post.data?.mentions_group?.filter(m => m.source === 'X')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    youtubeCards: post.data?.mentions_group?.filter(m => m.source === 'YouTube')?.map(m => ({
      title: m.title1?.[0]?.text || '',
      author: m.name?.[0]?.text || '',
      outboundLink: m.link?.url
    })) || [],
    copyright_license: post.data?.copyright_license || '',
  };
}