// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import { useTranslations } from '../utils/i18n';
// import { getDocumentByUID, getAllDocuments } from '../lib/mongodb';
// import ResearchTemplate from '../components/ResearchTemplate';
// import ResearchSEO from '../components/research/ResearchSEO';
// import ResearchSkeleton from '../components/research/ResearchSkeleton';
// import NotFoundState from '../components/research/NotFoundState';
// import { mapResearchData } from '../lib/research/research-mapper';


// export default function Page({ post, type, research  }) {
//   // console.log("RESEARCH<<", research)
//   const router = useRouter();
//   const { t, locale } = useTranslations();
//   // console.log("[uid].js", post);
//   // Show loading state if page is being generated
//   if (router.isFallback) {
//     return <ResearchSkeleton />;
//   }

//   // Show 404 if post not found
//   if (!post) {
//     return (
//       <>
//         <Head>
//           <title>{t('notFound.metaTitle')}</title>
//           <meta name="description" content={t('notFound.metaDescription')} />
//         </Head>
//         <NotFoundState />
//       </>
//     );
//   }

//   // console.log('ResearchFrom[uid].js', research)
//     // If it's a research post, transform the data and use ResearchTemplate
//   if (type === 'research') {
//     // const research = mapResearchData(post);
//     return (
//       <div className="min-h-screen bg-background">
//         <ResearchSEO
//           title={research.title}
//           description={research.summary}
//           publishedAt={post.first_publication_date}
//           updatedAt={post.last_publication_date}
//           author={{
//             name: post.data?.author?.name || 'Dediabetes',
//             uid: post.data?.author?.uid || 'dediabetes'
//           }}
//           authorImage={post.data?.author?.headshot?.url}
//           featuredImage={post.data?.featured_image?.url}
//           domains={research.domains || []}
//         />
//         <ResearchTemplate {...research} />
//       </div>
//     );
//   }

//   // Regular page content
//   return (
//     <>
//       <Head>
//         <title>{post.data?.title?.[0]?.text || 'Page'}</title>
//         <meta name="description" content={post.data?.description || ''} />
//       </Head>

//       <article className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-6">
//           {post.data?.title?.[0]?.text || 'Page'}
//         </h1>
        
//         {post.data?.featured_image && (
//           <div className="mb-8">
//             <img 
//               src={post.data?.featured_image.url} 
//               alt={post.data?.featured_image.alt || ''} 
//               className="w-full h-auto rounded-lg"
//             />
//           </div>
//         )}

//         <div className="prose max-w-none">
//           {Array.isArray(post.data?.content) && post.data?.content.map((block, index) => {
//             const textContent = block?.[0]?.text || block?.text || '';
            
//             if (block.type === 'paragraph') {
//               return <p key={index}>{textContent}</p>;
//             }
//             if (block.type === 'heading1') {
//               return <h1 key={index} className="text-3xl font-bold my-4">{textContent}</h1>;
//             }
//             if (block.type === 'heading2') {
//               return <h2 key={index} className="text-2xl font-bold my-3">{textContent}</h2>;
//             }
//             if (block.type === 'heading3') {
//               return <h3 key={index} className="text-xl font-bold my-2">{textContent}</h3>;
//             }
//             return null;
//           })}
//         </div>

//         <div className="mt-8 text-sm text-gray-500">
//           <time dateTime={post.first_publication_date}>
//             {new Date(post.first_publication_date).toLocaleDateString(locale)}
//           </time>
//         </div>
//       </article>
//     </>
//   );
// }

// export async function getStaticPaths({ locales }) {
//   const paths = [];
  
//   // Map URL locales to database locales
//   const databaseLocales = {
//     'en': 'en-us',
//     'es': 'es-es'
//   };
  
//   for (const locale of locales) {
//     const dbLocale = databaseLocales[locale] || locale;
    
//     // Get all pages
//     const pages = await getAllDocuments('page', dbLocale);
//     const pagePaths = pages.map((page) => ({
//       params: { uid: page.uid },
//       locale,
//     }));
    
//     // Get all research posts and create paths for both root and /research/ URLs
//     const researchPosts = await getAllDocuments('research', dbLocale);
//     // console.log("researchPosts at pages/[uid].js", researchPosts);
//     const researchPaths = researchPosts.flatMap((post) => [
//       {
//         params: { uid: post.uid },
//         locale,
//       },
//       {
//         params: { uid: `research/${post.uid}` },
//         locale,
//       }
//     ]);
    
//     paths.push(...pagePaths, ...researchPaths);
//   }

//   return {
//     paths,
//     fallback: true, // Enable fallback for new pages
//   };
// }

// export async function getStaticProps({ params, locale }) {
//   try {
//     // Map URL locales to database locales
//     const databaseLocales = {
//       'en': 'en-us',
//       'es': 'es-es'
//     };

//     const uid = params.uid;
//     const dbLocale = databaseLocales[locale] || locale;
    
//     // Handle research path
//     const isResearchPath = params.uid.startsWith('research/');
//     const cleanUid = isResearchPath ? params.uid.replace('research/', '') : params.uid;

//     // Try to find the document as a research post first
//     let post = await getDocumentByUID('research', cleanUid, dbLocale);
   
//     // console.log("POST RETURNED", post);

//         // 1a) pull out every outcomes1.uid
//     const allOutcomeUids = (post.data?.body || [])
//     .flatMap(section =>
//       (section.items || []).map(item => item.outcomes1?.uid)
//     ).filter(Boolean);

//     const allInterventionsUids = (post.data?.body || [])
//     .flatMap(section => {
//       const primaries = Array.isArray(section.primary)
//         ? section.primary
//         : section.primary
//           ? [section.primary]
//           : [];
//       return primaries.map(p => p.intervention?.uid).filter(Boolean);
//     });
  

//     // 1b) dedupe
//     const uniqueOutcomeUids = Array.from(new Set(allOutcomeUids));
//     const uniqueInterventionUids = Array.from(new Set(allInterventionsUids));

//     const outcomeDocs = await Promise.all(
//       uniqueOutcomeUids.map((uid) =>
//         getDocumentByUID('outcomes', uid, dbLocale)
//       )
//     );

//     const interventionDocs = await Promise.all(
//       uniqueInterventionUids.map((uid) =>
//         getDocumentByUID('interventions', uid, dbLocale)
//       )
//     );
 

//     const interventionMap = interventionDocs.reduce((map, doc) => {
//       if (doc && doc.uid) map[doc.uid] = doc;
//       return map;
//     }, {});

    

//     const outcomeMap = outcomeDocs.reduce((map, doc) => {
//       if (doc && doc.uid) map[doc.uid] = doc;
//       return map;
//     }, {});

//     // console.log("allOutcomeUids", allOutcomeUids);
//     // console.log("outcomeMap", outcomeMap);
//     // console.log("interventionMap", interventionMap);


//     if (post) {
//       // build the fully-hydrated research object
//       const research = mapResearchData(post, outcomeMap, interventionMap);
      
//       // Check if we should redirect to the alternate language version
//       if (post.alternate_languages?.length > 0) {
//         const currentLang = post.lang;
//         const requestedLang = dbLocale;
        
//         // If the post we found is not in the requested language
//         if (currentLang !== requestedLang) {
//           // Find the alternate version in the requested language
//           const alternateVersion = post.alternate_languages.find(alt => alt.lang === requestedLang);
//           if (alternateVersion) {
//             // Redirect to the alternate version, maintaining the research/ prefix if present
//             const redirectPath = isResearchPath ? 
//               `/${locale}/research/${alternateVersion.uid}` : 
//               `/${locale}/${alternateVersion.uid}`;
            
//             return {
//               redirect: {
//                 destination: redirectPath,
//                 permanent: false
//               }
//             };
//           }
//         }
//       }

//       // If found in /research/ path, redirect to root path (commented out as per existing code)
//       // if (isResearchPath) {
//       //   return {
//       //     redirect: {
//       //       destination: `/${locale}/${cleanUid}`,
//       //       permanent: true,
//       //     },
//       //   };
//       // }
      
//       return {
//         props: {
//           post,
//           type: 'research',
//           research,
//         },
//         revalidate: 60,
//       };
//     }

//     // If not a research post, try as a regular page
//     post = await getDocumentByUID('page', uid, dbLocale);
    
//     // If still not found, try the other locale
//     if (!post) {
//       const otherLocale = locale === 'es' ? 'en-us' : 'es-es';
//       // Try research post in other locale first
//       post = await getDocumentByUID('research', cleanUid, otherLocale);
//       if (post) {
//         // Check alternate languages for research post in other locale
//         if (post.alternate_languages?.length > 0) {
//           const alternateVersion = post.alternate_languages.find(alt => alt.lang === dbLocale);
//           if (alternateVersion) {
//             // Redirect to the alternate version, maintaining the research/ prefix if present
//             const redirectPath = isResearchPath ? 
//               `/${locale}/research/${alternateVersion.uid}` : 
//               `/${locale}/${alternateVersion.uid}`;
            
//             return {
//               redirect: {
//                 destination: redirectPath,
//                 permanent: false
//               }
//             };
//           }
//         }

//         return {
//           props: {
//             post,
//             type: 'research',
//             research,
//           },
//           revalidate: 60,
//         };
//       }
      
//       // Then try page in other locale
//       post = await getDocumentByUID('page', uid, otherLocale);
      
//       // Check alternate languages for regular page
//       if (post?.alternate_languages?.length > 0) {
//         const alternateVersion = post.alternate_languages.find(alt => alt.lang === dbLocale);
//         if (alternateVersion) {
//           return {
//             redirect: {
//               destination: `/${locale}/${alternateVersion.uid}`,
//               permanent: false
//             }
//           };
//         }
//       }
//     }

//     if (!post) {
//       return { notFound: true };
//     }

//     return {
//       props: {
//         post,
//         type: 'page',
//       },
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error('Error fetching page:', error);
//     return {
//       notFound: true,
//     };
//   }
// }



























// CODE2



// import { useRouter } from 'next/router';
// import Head from 'next/head';
// import { useTranslations } from '../utils/i18n';
// import { getDocumentByUID, getAllDocuments } from '../lib/mongodb';
// import ResearchTemplate from '../components/ResearchTemplate';
// import ResearchSEO from '../components/research/ResearchSEO';
// import ResearchSkeleton from '../components/research/ResearchSkeleton';
// import NotFoundState from '../components/research/NotFoundState';
// import { mapResearchData } from '../lib/research/research-mapper';

// export default function Page({ post, type }) {
//   const router = useRouter();
//   const { t, locale } = useTranslations();

//   // Show loading state if page is being generated
//   if (router.isFallback) {
//     return <ResearchSkeleton />;
//   }

//   // Show 404 if post not found
//   if (!post) {
//     return (
//       <>
//         <Head>
//           <title>{t('notFound.metaTitle')}</title>
//           <meta name="description" content={t('notFound.metaDescription')} />
//         </Head>
//         <NotFoundState />
//       </>
//     );
//   }

// console.log("POST>{IOD}1:", post);
//   // If it's a research post, transform the data and use ResearchTemplate
//   if (type === 'research') {
//     const research = mapResearchData(post);

//     return (
//       <div className="min-h-screen bg-background">
//         <ResearchSEO
//           title={research.title}
//           description={research.summary}
//           publishedAt={post.first_publication_date}
//           updatedAt={post.last_publication_date}
//           author={{
//             name: post.data.author?.name || 'Dediabetes',
//             uid: post.data.author?.uid || 'dediabetes'
//           }}
//           authorImage={post.data.author?.headshot?.url}
//           featuredImage={post.data.featured_image?.url}
//           domains={research.domains || []}
//         />
//         <ResearchTemplate {...research} />
//       </div>
//     );
//   }

//   // Regular page content
//   return (
//     <>
//       <Head>
//         <title>{post.data.title?.[0]?.text || 'Page'}</title>
//         <meta name="description" content={post.data.description || ''} />
//       </Head>

//       <article className="max-w-4xl mx-auto px-4 py-8">
//         <h1 className="text-4xl font-bold mb-6">
//           {post.data.title?.[0]?.text || 'Page'}
//         </h1>
        
//         {post.data.featured_image && (
//           <div className="mb-8">
//             <img 
//               src={post.data.featured_image.url} 
//               alt={post.data.featured_image.alt || ''} 
//               className="w-full h-auto rounded-lg"
//             />
//           </div>
//         )}

//         <div className="prose max-w-none">
//           {Array.isArray(post.data.content) && post.data.content.map((block, index) => {
//             const textContent = block?.[0]?.text || block?.text || '';
            
//             if (block.type === 'paragraph') {
//               return <p key={index}>{textContent}</p>;
//             }
//             if (block.type === 'heading1') {
//               return <h1 key={index} className="text-3xl font-bold my-4">{textContent}</h1>;
//             }
//             if (block.type === 'heading2') {
//               return <h2 key={index} className="text-2xl font-bold my-3">{textContent}</h2>;
//             }
//             if (block.type === 'heading3') {
//               return <h3 key={index} className="text-xl font-bold my-2">{textContent}</h3>;
//             }
//             return null;
//           })}
//         </div>

//         <div className="mt-8 text-sm text-gray-500">
//           <time dateTime={post.first_publication_date}>
//             {new Date(post.first_publication_date).toLocaleDateString(locale)}
//           </time>
//         </div>
//       </article>
//     </>
//   );
// }

// export async function getStaticPaths({ locales }) {
//   const paths = [];
  
//   // Map URL locales to database locales
//   const databaseLocales = {
//     'en': 'en-us',
//     'es': 'es-es'
//   };
  
//   for (const locale of locales) {
//     const dbLocale = databaseLocales[locale] || locale;
    
//     // Get all pages
//     const pages = await getAllDocuments('page', dbLocale);
//     const pagePaths = pages.map((page) => ({
//       params: { uid: page.uid },
//       locale,
//     }));
    
//     // Get all research posts and create paths for both root and /research/ URLs
//     const researchPosts = await getAllDocuments('research', dbLocale);
//     console.log("researchPosts at pages/[uid].js", researchPosts);
//     const researchPaths = researchPosts.flatMap((post) => [
//       {
//         params: { uid: post.uid },
//         locale,
//       },
//       {
//         params: { uid: `research/${post.uid}` },
//         locale,
//       }
//     ]);
    
//     paths.push(...pagePaths, ...researchPaths);
//   }

//   return {
//     paths,
//     fallback: true, // Enable fallback for new pages
//   };
// }

// export async function getStaticProps({ params, locale }) {
//   try {
//     // Map URL locales to database locales
//     const databaseLocales = {
//       'en': 'en-us',
//       'es': 'es-es'
//     };

//     const uid = params.uid;
//     const dbLocale = databaseLocales[locale] || locale;
    
//     // Handle research path
//     const isResearchPath = params.uid.startsWith('research/');
//     const cleanUid = isResearchPath ? params.uid.replace('research/', '') : params.uid;

//     // Try to find the document as a research post first
//     let post = await getDocumentByUID('research', cleanUid, dbLocale);
   
//     if (post) {
//       // Check if we should redirect to the alternate language version
//       if (post.alternate_languages?.length > 0) {
//         const currentLang = post.lang;
//         const requestedLang = dbLocale;
        
//         // If the post we found is not in the requested language
//         if (currentLang !== requestedLang) {
//           // Find the alternate version in the requested language
//           const alternateVersion = post.alternate_languages.find(alt => alt.lang === requestedLang);
//           if (alternateVersion) {
//             // Redirect to the alternate version, maintaining the research/ prefix if present
//             const redirectPath = isResearchPath ? 
//               `/${locale}/research/${alternateVersion.uid}` : 
//               `/${locale}/${alternateVersion.uid}`;
            
//             return {
//               redirect: {
//                 destination: redirectPath,
//                 permanent: false
//               }
//             };
//           }
//         }
//       }

//       // If found in /research/ path, redirect to root path (commented out as per existing code)
//       // if (isResearchPath) {
//       //   return {
//       //     redirect: {
//       //       destination: `/${locale}/${cleanUid}`,
//       //       permanent: true,
//       //     },
//       //   };
//       // }
      
//       return {
//         props: {
//           post,
//           type: 'research'
//         },
//         revalidate: 60,
//       };
//     }

//     // If not a research post, try as a regular page
//     post = await getDocumentByUID('page', uid, dbLocale);
    
//     // If still not found, try the other locale
//     if (!post) {
//       const otherLocale = locale === 'es' ? 'en-us' : 'es-es';
//       // Try research post in other locale first
//       post = await getDocumentByUID('research', cleanUid, otherLocale);
//       if (post) {
//         // Check alternate languages for research post in other locale
//         if (post.alternate_languages?.length > 0) {
//           const alternateVersion = post.alternate_languages.find(alt => alt.lang === dbLocale);
//           if (alternateVersion) {
//             // Redirect to the alternate version, maintaining the research/ prefix if present
//             const redirectPath = isResearchPath ? 
//               `/${locale}/research/${alternateVersion.uid}` : 
//               `/${locale}/${alternateVersion.uid}`;
            
//             return {
//               redirect: {
//                 destination: redirectPath,
//                 permanent: false
//               }
//             };
//           }
//         }

//         return {
//           props: {
//             post,
//             type: 'research'
//           },
//           revalidate: 60,
//         };
//       }
      
//       // Then try page in other locale
//       post = await getDocumentByUID('page', uid, otherLocale);
      
//       // Check alternate languages for regular page
//       if (post?.alternate_languages?.length > 0) {
//         const alternateVersion = post.alternate_languages.find(alt => alt.lang === dbLocale);
//         if (alternateVersion) {
//           return {
//             redirect: {
//               destination: `/${locale}/${alternateVersion.uid}`,
//               permanent: false
//             }
//           };
//         }
//       }
//     }

//     if (!post) {
//       return { notFound: true };
//     }

//     return {
//       props: {
//         post,
//         type: 'page'
//       },
//       revalidate: 60,
//     };
//   } catch (error) {
//     console.error('Error fetching page:', error);
//     return {
//       notFound: true,
//     };
//   }
// }



















// Code3




import { useRouter } from 'next/router';
import Head from 'next/head';
import { useTranslations } from '../utils/i18n';
import { getDocumentByUID, getAllDocuments } from '../lib/mongodb';
import ResearchTemplate from '../components/ResearchTemplate';
import ResearchSEO from '../components/research/ResearchSEO';
import ResearchSkeleton from '../components/research/ResearchSkeleton';
import NotFoundState from '../components/research/NotFoundState';
import { mapResearchData } from '../lib/research/research-mapper';

export default function Page({ post, type, research }) {
  const router = useRouter();
  const { t, locale } = useTranslations();

  if (router.isFallback) return <ResearchSkeleton />;
  if (!post) {
    return (
      <>
        <Head>
          <title>{t('notFound.metaTitle')}</title>
          <meta name="description" content={t('notFound.metaDescription')} />
        </Head>
        <NotFoundState />
      </>
    );
  }

  if (type === 'research') {
    return (
      <div className="min-h-screen bg-background">
        <ResearchSEO
          title={research.title}
          description={research.summary}
          publishedAt={post.first_publication_date}
          updatedAt={post.last_publication_date}
          author={{
            name: post.data.author?.name || 'Dediabetes',
            uid: post.data.author?.uid || 'dediabetes'
          }}
          authorImage={post.data.author?.headshot?.url}
          featuredImage={post.data.featured_image?.url}
          domains={research.domains || []}
        />
        <ResearchTemplate {...research} />
      </div>
    );
  }

  // Regular page fallback
  return (
    <>
      <Head>
        <title>{post.data.title?.[0]?.text || 'Page'}</title>
        <meta name="description" content={post.data.description || ''} />
      </Head>
      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">{post.data.title?.[0]?.text || 'Page'}</h1>
        {post.data.featured_image && (
          <div className="mb-8">
            <img src={post.data.featured_image.url} alt={post.data.featured_image.alt || ''} className="w-full h-auto rounded-lg" />
          </div>
        )}
        <div className="prose max-w-none">
          {Array.isArray(post.data.content) && post.data.content.map((block, idx) => {
            const text = block?.[0]?.text || block?.text || '';
            if (block.type === 'paragraph') return <p key={idx}>{text}</p>;
            if (block.type === 'heading1') return <h1 key={idx} className="text-3xl font-bold my-4">{text}</h1>;
            if (block.type === 'heading2') return <h2 key={idx} className="text-2xl font-bold my-3">{text}</h2>;
            if (block.type === 'heading3') return <h3 key={idx} className="text-xl font-bold my-2">{text}</h3>;
            return null;
          })}
        </div>
        <div className="mt-8 text-sm text-gray-500">
          <time dateTime={post.first_publication_date}>{new Date(post.first_publication_date).toLocaleDateString(locale)}</time>
        </div>
      </article>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const paths = [];
  const databaseLocales = { en: 'en-us', es: 'es-es' };

  for (const locale of locales) {
    const dbLocale = databaseLocales[locale] || locale;
    const pages = await getAllDocuments('page', dbLocale);
    pages.forEach(p => paths.push({ params: { uid: p.uid }, locale }));
    const researchPosts = await getAllDocuments('research', dbLocale);
    researchPosts.forEach(p => {
      paths.push({ params: { uid: p.uid }, locale });
      paths.push({ params: { uid: `research/${p.uid}` }, locale });
    });
  }

  return { paths, fallback: true };
}

export async function getStaticProps({ params, locale }) {
  const databaseLocales = { en: 'en-us', es: 'es-es' };
  const uid = params.uid;
  const dbLocale = databaseLocales[locale] || locale;
  const cleanUid = uid.replace(/^research\//, '');
  const isResearchPath = uid.startsWith('research/');

  // Helper to fetch with fallback locale
  async function fetchWithFallback(type, uid, primaryLang, fallbackLang) {
    let doc = await getDocumentByUID(type, uid, primaryLang);
    if (!doc) {
      doc = await getDocumentByUID(type, uid, fallbackLang);
    }
    return doc;
  }

  try {
    // Determine fallback language for missing translations
    const fallbackLocale = dbLocale.includes('es') ? 'en-us' : 'es-es';

    // Attempt to fetch research first
    let post = await fetchWithFallback('research', cleanUid, dbLocale, fallbackLocale);
    let research = null;

    if (post) {
      // Build UID lists safely
      const sections = post.data.body || [];
      const allOutcomeUids = sections.flatMap(sec => (sec.items || []).map(i => i.outcomes1?.uid).filter(Boolean));
      const allInterventionUids = sections.flatMap(sec => {
        const primaries = Array.isArray(sec.primary) ? sec.primary : sec.primary ? [sec.primary] : [];
        return primaries.map(p => p.intervention?.uid).filter(Boolean);
      });

      const uniqueOutcomeUids = [...new Set(allOutcomeUids)];
      const uniqueInterventionUids = [...new Set(allInterventionUids)];

      // Fetch related docs, allowing missing ones
      const outcomeDocs = await Promise.all(uniqueOutcomeUids.map(uid => fetchWithFallback('outcomes', uid, dbLocale, fallbackLocale)));
      const interventionDocs = await Promise.all(uniqueInterventionUids.map(uid => fetchWithFallback('interventions', uid, dbLocale, fallbackLocale)));

      const outcomeMap = outcomeDocs.reduce((m, d) => { if (d?.uid) m[d.uid] = d; return m; }, {});
      const interventionMap = interventionDocs.reduce((m, d) => { if (d?.uid) m[d.uid] = d; return m; }, {});

      research = mapResearchData(post, outcomeMap, interventionMap);

      // If requested locale missing, no redirect: we serve fallback content
      return { props: { post, type: 'research', research }, revalidate: 60 };
    }

    // Else try regular page
    const poste = await fetchWithFallback('page', cleanUid, dbLocale, fallbackLocale);
    if (!poste) return { notFound: true };

    return { props: { poste, type: 'page' }, revalidate: 60 };
  } catch (err) {
    console.error('Error in getStaticProps:', err);
    return { notFound: true };
  }
}
