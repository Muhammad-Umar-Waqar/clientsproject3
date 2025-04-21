import React, { useState } from 'react';
import { IconChevronUp, IconPhoto, IconFileTextAi, IconCrown,   } from '@tabler/icons-react';

import { useSession } from "next-auth/react";

import { useTranslations } from '../utils/i18n';

import DiscussionsSection from './DiscussionsSection';
import RelatedPosts from './RelatedPosts';
import BlogPostHeader from './BlogPostHeader';
import Footer from './Footer';
import NewsletterSection from './common/newsletter';
import { Alert } from '@mui/material';
import { useRouter } from 'next/router';
const ResearchTemplate = ({
  title = "Understanding Artificial Pancreas Systems: Results from a 24-Month Trial",
  author = "Dr. Sarah Johnson",
  publisher = "Diabetes Research Journal",
  publishDate = "January 31, 2025",
  domain,
  readTime = "8 min read",
  headerImage,
  summary = "",
  copyright_license = "",
  studyDesign = {
    interventions: [],
    outcomes: [],
    studyType: "",
    duration: "",
    size: ""
  },
  
  studyPopulation = {
    ageRange: "",
    sex: "",
    geography: [],
    others: []
  },
  methodology = "",
  interventions = "",
  keyFindings = "",
  comparison = "",
  biasScore = "",
  effectivenessAnalysis = [{
    intervention: [],
    items: []
  }],
  journalReference = {
    full: ""
  },
  expertCards = [],
  onlineCards = [],
  redditCards = [],
  studyCards = [],
  xCards = [],
  youtubeCards = [],
  relatedPosts = [],
  domains = []
}) => {

  const { data: session, status } = useSession();

  const { t, locale } = useTranslations();

  const [showBackToTop, setShowBackToTop] = useState(false);

  // Funciones auxiliares para formatear las claves de traducción
  const formatKey = (value, prefix) => {
    return value.toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/\(|\)/g, '')
      .replace(/[–-]/g, '–');  // Normaliza los guiones
  };
  
  
  // const outcomes1UidValue = getDocumentByUID('outcomes', studyDesign.outcomes.map((outcome) => (outcome)), en-us)
  // console.log("outcomes1UidValue: ", outcomes1UidValue);

  const translateValue = (value, type) => {
    if (!value) return '';
    const key = formatKey(value, type);
    return t(`research.${type}.${key}`) || value;
  };

  // Función para traducir los dominios
  const translateDomain = (domain) => {
    const domainKey = domain[0].toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/\(|\)/g, '')
      .replace(/[–-]/g, '_');
    return t(`research.domains.${domainKey}`) || domain;
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const router = useRouter();
  const handleUpgrade = () => {
    if(!session) router.push('/login');
    if(session?.user?.role == "basic") router.push('/premium');
  }



  return (
    <div className="min-h-screen bg-background">
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 p-2 sm:p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors z-50"
        >
          <IconChevronUp className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Category Tags */}
        {domains && domains.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
            {domains.map((domain, index) => (
              <span
                key={index}
                className="inline-block px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-red-700 bg-red-50 rounded-md"
              >
                {translateDomain(domain)}
              </span>
            ))}
          </div>
        )}
        <BlogPostHeader
          title={title}
          publisher={publisher}
          publishDate={publishDate}
          readTime={readTime}
        />

        {headerImage ? (
          <figure className="mb-8 sm:mb-16">
            <img
              src={headerImage}
              alt={title}
              className="w-full aspect-video object-cover rounded-lg"
            />
          </figure>
        ) : (
          <figure className="mb-8 sm:mb-16">
            <div className="w-full aspect-video bg-muted rounded-lg flex items-center justify-center">
              <IconPhoto className="w-8 h-8 sm:w-12 sm:h-12 text-muted-foreground" />
            </div>
          </figure>
        )}

        {summary && (
          <section className="whitespace-pre-wrap prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
            <h2 className="mb-4 sm:mb-6">{t('research.sections.summary')}</h2>
            <p className="">{summary}</p>
          </section>
        )}

        {(studyDesign?.interventions?.length > 0 ||
          studyDesign?.outcomes?.length > 0 ||
          studyDesign?.studyType?.length > 0 ||
          studyDesign?.duration?.length > 0 ||
          studyDesign?.size?.length > 0) && (
            <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
              <h2 className="mb-4 sm:mb-6">{t('research.sections.studyDesign')}</h2>
              <div className="bg-secondary/5 rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyDesign?.interventions?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.interventions')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyDesign.interventions.map((intervention, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                            {intervention}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {studyDesign?.studyType?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.studyType')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyDesign.studyType.map((type, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm">
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {studyDesign?.outcomes?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.outcomes')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyDesign.outcomes.map((outcome, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {(studyDesign?.duration?.length > 0 || studyDesign?.size?.length > 0) && (
                    <div className='flex flex-col gap-2'>
                      <h3 className="mb-2">{t('research.sections.durationSize')}</h3>
                      <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        {studyDesign?.duration?.map((duration, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm mr-1.5 sm:mr-2">
                            {translateValue(duration, 'duration')}
                          </span>
                        ))}
                      </div>
                      <div className='flex flex-wrap gap-1.5 sm:gap-2'>
                        {studyDesign?.size?.map((size, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-red-100 text-red-800 rounded-full text-xs sm:text-sm">
                            {translateValue(size, 'size')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

        {(studyPopulation?.ageRange?.length > 0 ||
          studyPopulation?.sex?.length > 0 ||
          studyPopulation?.geography?.length > 0 ||
          studyPopulation?.others?.length > 0) && (
            <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
              <h2 className="mb-4 sm:mb-6">{t('research.sections.studyPopulation')}</h2>
              <div className="bg-secondary/5 rounded-lg p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {studyPopulation?.ageRange?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.ageRange')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyPopulation.ageRange.map((age, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                            {translateValue(age, 'ageRange')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {studyPopulation?.sex?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.sex')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyPopulation.sex.map((sex, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-pink-100 text-pink-800 rounded-full text-xs sm:text-sm">
                            {translateValue(sex, 'sex')}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {studyPopulation?.geography?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.geography')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyPopulation.geography.map((location, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                            {location}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {studyPopulation?.others?.length > 0 && (
                    <div>
                      <h3 className="mb-2">{t('research.sections.otherCriteria')}</h3>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {studyPopulation.others.map((criterion, index) => (
                          <span key={index} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-orange-100 text-orange-800 rounded-full text-xs sm:text-sm">
                            {criterion}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

        <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
          {methodology?.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4">{t('research.sections.methodology')}</h2>
              {methodology.map((method, index) => (
                <p key={index} className=" mb-4">{method}</p>
              ))}
            </section>
          )}

          {interventions?.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4">{t('research.sections.interventions')}</h2>
              {interventions.map((intervention, index) => (
                <p key={index} className=" mb-4">{intervention}</p>
              ))}
            </section>
          )}

          {keyFindings?.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4">{t('research.sections.keyFindings')}</h2>
              {keyFindings.map((finding, index) => (
                <p key={index} className=" mb-4">{finding}</p>
              ))}
            </section>
          )}

          {comparison?.length > 0 && (
            <section className="mb-8">
              <h2 className="mb-4">{t('research.sections.comparison')}</h2>
              {comparison.map((comp, index) => (
                <p key={index} className=" mb-4" dangerouslySetInnerHTML={{ __html: comp }} />
              ))}
            </section>
          )}
        </section>

{status === "loading" ? (
          // While the session is loading, you might show a spinner or placeholder only for premium content.
          <div className="flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-dashed rounded-full animate-spin border-primary"></div>
      </div>
        ) : session && session.user.role === "premium" ? (
          // If the user is premium, show the premium content.
          <>
                  {biasScore && (
          <section className="mb-8 sm:mb-16">
            <div className="max-w-2xl mx-auto">
              <div className="bg-secondary/5 rounded-lg p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-4 justify-center">
                  <IconFileTextAi className="w-5 h-5 sm:w-6 sm:h-6" />
                  <h2 className="">{t('research.sections.biasAnalysisScore')}</h2>
                </div>
                <div className="flex justify-center">
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm">
                    {biasScore}
                  </span>
                </div>
              </div>
            </div>
          </section>
        )}

        {effectivenessAnalysis?.length > 0 && (
          <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
            <section className="mb-8">
              <div className="flex mb-4">
                <h2 className="mb-4">{t('research.sections.effectivenessAnalysis')}</h2>
              </div>
              <div className='flex flex-col gap-4'>
                {effectivenessAnalysis.map((analysis, index) => (
                  <div key={index} className="space-y-5 bg-secondary/5 rounded-lg p-4 sm:p-6">
                    {analysis?.intervention?.length > 0 && (
                      <div className="flex items-center gap-4 ">
                        <span className="text-muted-foreground">{t('research.sections.intervention')}:</span>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
                          {analysis.intervention.map((int, idx) => (
                            <span key={idx} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                              {int}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {analysis?.items?.length > 0 && analysis.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="space-y-4">
                        {/* Outcome */}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t('research.sections.outcome')}:</span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
                            {item?.outcome?.length > 0 && item.outcome.map((out, idx) => (
                              <span key={idx} className="px-2 sm:px-3 py-0.5 sm:py-1 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm">
                                {out}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Effectiveness */}
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">{t('research.sections.effectiveness')}:</span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end">
                            <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs sm:text-sm">
                              {t(`research.sections.effectivenessOptions.${item?.effectiveness?.toLowerCase() || 'low'}`)}
                            </span>
                          </div>
                        </div>
                        {/* Explanation */}
                        <div className="flex items-start justify-between">
                          <span className="text-muted-foreground">{t('research.sections.explanation')}:</span>
                          <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-end max-w-[70%] text-right">
                            {item?.explanation?.length > 0 && item.explanation.map((exp, idx) => (
                              <p key={idx} className="my-0 text-xs sm:text-sm text-gray-600">
                                {exp}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          </section>
        )}
          </>
        ) : (
          // Otherwise, show a prompt to upgrade.
          <div className="flex flex-col items-center justify-center p-8 dark:bg-transparent dark:border dark:border-gray-50  bg-gray-100 border border-gray-300 rounded-lg">
    <div className="flex items-center gap-2">
      <IconCrown className="w-12 h-12 text-yellow-500" />
      <h2 className="text-2xl font-bold text-gray-800  dark:text-gray-50 ">{t('research.sections.premium')}</h2>
    </div>
    <p className="mt-4 text-center text-gray-600 max-w-md dark:text-gray-50 ">
    {t('research.sections.unlock')}
    </p>
    <button
      onClick={() => handleUpgrade()} // or navigate to your upgrade page
      className="mt-6 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"

    >
    {t('research.sections.upgrade')}
    </button>
  </div>
        )}

        {journalReference?.length > 0 && (
          <section className="prose prose-sm sm:prose-base lg:prose-lg max-w-none mb-8 sm:mb-16">
            <section className="mb-8">
              <h2 className="mb-4">{t('research.sections.journalReference')}</h2>
              {journalReference.map((ref, index) => (
                <p key={index} className="" dangerouslySetInnerHTML={{ __html: ref }} />
              ))}
            </section>
            
            <p className="mt-4 text-sm text-gray-500">
    © {new Date().getFullYear()} deDiabetes. Licensed under <a 
      href="https://creativecommons.org/publicdomain/zero/1.0/" 
      className="text-primary hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      {copyright_license || ""}
    </a>
    </p>
          </section>
        )}

        {/* Alert Box */}
        <Alert severity="warning" variant='outlined' className="my-8 italic !prose !text-yellow-900">
          {t('research.alert_box')}
        </Alert>

        {(expertCards?.length > 0 ||
          onlineCards?.length > 0 ||
          redditCards?.length > 0 ||
          studyCards?.length > 0 ||
          xCards?.length > 0 ||
          youtubeCards?.length > 0) && (
            <DiscussionsSection
              expertCards={expertCards || []}
              onlineCards={onlineCards || []}
              redditCards={redditCards || []}
              studyCards={studyCards || []}
              xCards={xCards || []}
              youtubeCards={youtubeCards || []}
            />
          )}

        <NewsletterSection />

        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} />
        )}
      </main>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default ResearchTemplate;