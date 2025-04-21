// import React from 'react'
// import { useTranslations } from '../utils/i18n';
// import { getInterventionsTable } from '../db/research';
// import Head from 'next/head';
// import InterventionsPage from '../components/InterventionsPage';



// function InterventionsTable({ interventionsData }) {
//     const { t } = useTranslations();

//     return (
//         <>
//           <Head>
//             <title>{`${t('interventions.title')} - deDiabetes`}</title>
//             <meta 
//               name="description" 
//               content={t('interventions.description')} 
//             />
//             <link rel="icon" href="/dd_favicon.png" />
//           </Head>
          
//           <InterventionsPage interventionsData={interventionsData} />
//         </>
//       );

// }

// export default InterventionsTable




// export async function getStaticProps({ locale }) {
//   try {
//     // Map URL locales to database locales
//     const databaseLocales = {
//       'en': 'en-us',
//       'es': 'es-es'
//     };
    
//     const dbLocale = databaseLocales[locale] || locale;
//     const interventionsData = await getInterventionsTable(dbLocale);

//     return {
//       props: {
//         interventionsData
//       },
//       revalidate: 3600
//     };
//   } catch (error) {
//     console.error('Error fetching interventions data');
//     return {
//       props: {
//         interventionsData: []
//       },
//       revalidate: 3600
//     };
//   }
// }

























// // pages/admin/interventions.jsx
// import React from 'react';
// import Head from 'next/head';

// import GenericAdminTable from '../components/GenericAdminTable';
// import { getInterventionsTableForAdmin } from '../db/research';

// export default function AdminInterventions({ data }) {
//   const columns = [
//     { key: 'intervention',     label: 'interventions.tableHeaders.intervention' },
//     { key: 'intervention_text', label: 'admin.tableHeaders.interventionText' },
//     { key: 'doi',              label: 'admin.tableHeaders.doi' },
//   ];

//   return (
//     <>
//       <Head>
//         <title>Admin – Interventions</title>
//       </Head>
//       <h1 className="text-3xl font-bold mb-6">Admin: Interventions</h1>
//       <GenericAdminTable columns={columns} data={data} />
//     </>
//   );
// }

// export async function getStaticProps({ locale }) {
//   const databaseLocales = { en: 'en-us', es: 'es-es' };
//   const lang = databaseLocales[locale] || locale;
//   const data = await getInterventionsTableForAdmin(lang);

//   return {
//     props: { data },
//     revalidate: 3600,
//   };
// }












// pages/admin/interventions.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Pagination from './../components/ui/pagination';
import useThrottle from './../utils/useThrottle';
import * as research from './../db/research';
import GenericAdminTable from '../components/GenericAdminTable';

export default function AdminInterventions({ data }) {
  const router = useRouter();
  const { page: qp = '1' } = router.query;
  const currentPage = Math.max(1, parseInt(qp, 10) || 1);

  // search state + throttle
  const [search, setSearch] = useState('');
  const throttledSearch = useThrottle(search, 300);


   // Whenever the search term changes, strip out "page"
   useEffect(() => {
    if (throttledSearch) {
      // 1) Build a new URL object with NO query params
      const newPath = { pathname: router.pathname };
      
      // 2) Replace (or push) with shallow routing
      router.replace(newPath, undefined, { shallow: true });
    }
  }, [throttledSearch, router]);


  // filter by intervention or text
  const filtered = useMemo(() => {
    if (!throttledSearch) return data;
    const term = throttledSearch.toLowerCase();
    return data.filter(
      row =>
        row.intervention.toLowerCase().includes(term) ||
        row.intervention_text.toLowerCase().includes(term) 
        || row. title.toLowerCase().includes(term)
    );
  }, [data, throttledSearch]);

  // pagination
  const ROWS_PER_PAGE = 10;
  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const pageData = filtered.slice(
    (currentPage - 1) * ROWS_PER_PAGE,
    currentPage * ROWS_PER_PAGE
  );

  const columns = [
    { key: 'title',        label: 'admin.tableHeaders.title' },
    { key: 'doi',              label: 'admin.tableHeaders.doi'                    },
    { key: 'intervention',     label: 'interventions.tableHeaders.intervention'     },
    { key: 'intervention_text', label: 'admin.tableHeaders.interventionText'        },
  ];

  return (
    <>
      <Head>
        <title>Admin – Interventions</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Admin: Interventions</h1>

      {/* Search box */}
      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search interventions…"
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <GenericAdminTable columns={columns} data={pageData} />

      {/* Pagination */}
      <Pagination totalPages={totalPages} />
    </>
  );
}

export async function getStaticProps({ locale }) {
  const databaseLocales = { en: 'en-us', es: 'es-es' };
  const lang = databaseLocales[locale] || locale;
  const data = await research.getInterventionsTableForAdmin(lang);

  return {
    props: { data },
    revalidate: 3600,
  };
}
