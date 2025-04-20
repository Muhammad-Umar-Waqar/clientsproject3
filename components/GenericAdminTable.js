// import React, { useState } from 'react';
// import Footer from './Footer';
// import { useTranslations } from '../utils/i18n';
// import { useDarkMode } from '../utils/DarkModeContext';

// /**
//  * A reusable admin table component for both Interventions and Outcomes.
//  * 
//  * Props:
//  * - data: Array of objects (rows)
//  * - columns: Array of { header: string, accessor: string }
//  */
// const GenericAdminTable = ({ data = [], columns = [] }) => {
//   const [search, setSearch] = useState('');
//   const { t } = useTranslations();
//   const { isDarkMode } = useDarkMode();

//   // Filter rows by any string column
//   const filtered = data.filter(row =>
//     columns.some(col =>
//       String(row[col.accessor] || '')
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     )
//   );

//   if (!data.length) {
//     return (
//       <>
//         <h1 className="text-3xl font-bold mb-8">{t('adminTable.title')}</h1>
//         <div className="text-center py-8">
//           <p className="text-muted-foreground">{t('researchTable.noData')}</p>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <h1 className="text-3xl font-bold mb-8">{t('adminTable.title')}</h1>
//       <div className="mb-4 flex justify-between">
//         <input
//           type="text"
//           placeholder={t('researchTable.search')}
//           className="border p-2 rounded"
//           value={search}
//           onChange={e => setSearch(e.target.value)}
//         />
//       </div>
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="border-b border-input">
//               {columns.map(col => (
//                 <th
//                   key={col.accessor}
//                   className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"
//                 >
//                   {col.header}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {filtered.map((row, rowIndex) => (
//               <tr key={rowIndex} className="border-b border-input hover:bg-accent/50">
//                 {columns.map(col => (
//                   <td key={col.accessor} className="px-6 py-4">
//                     {row[col.accessor]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default GenericAdminTable;















// components/AdminTable.jsx
import React from 'react';
import { useTranslations } from '../utils/i18n';

export default function GenericAdminTable({ columns, data }) {
  const { t } = useTranslations();

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-input">
            {columns.map(col => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground"
              >
                {t(col.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-input hover:bg-accent/50"
              >
                {columns.map(col => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render
                      ? col.render(row)
                      : // default: just spit out the field
                        row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-muted-foreground"
              >
                {t('adminTable.noData')}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
