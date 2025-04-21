// pages/admin/outcomes.jsx
import React, { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

import Pagination from './../components/ui/pagination';
import useThrottle from './../utils/useThrottle';
import { getOutcomesTableForAdmin } from './../db/research';
import GenericAdminTable from '../components/GenericAdminTable';

export default function AdminOutcomes({ data }) {
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



  // filter by outcome or text
  const filtered = useMemo(() => {
    if (!throttledSearch) return data;
    const term = throttledSearch.toLowerCase();
    return data.filter(row =>
      row.title.toLowerCase().includes(term) ||
      row.outcome.toLowerCase().includes(term) ||
      row.outcome_text.toLowerCase().includes(term)
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
    { key: 'doi',          label: 'admin.tableHeaders.doi'         },
    { key: 'outcome',      label: 'outcomes.tableHeaders.outcome'     },
    { key: 'outcome_text', label: 'admin.tableHeaders.outcomeText' },
  ];

  

  return (
    <>
      <Head>
        <title>Admin – Outcomes</title>
      </Head>

      <h1 className="text-3xl font-bold mb-6">Admin: Outcomes</h1>

      {/* Search box */}
      <div className="mb-4 max-w-md">
        <input
          type="text"
          placeholder="Search outcomes…"
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
  const data = await getOutcomesTableForAdmin(lang);

  return {
    props: { data },
    revalidate: 3600,
  };
}
