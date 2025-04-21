import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ResearchTemplate from '../../components/ResearchTemplate';
import { useTranslations } from '../../utils/i18n';

export default function ResearchPost() {
  const router = useRouter();
  const { uid } = router.query;
  const { locale, getDatabaseLocale } = useTranslations();
  const [research, setResearch] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (!uid) return;

    const fetchResearch = async () => {
      try {
        const dbLocale = getDatabaseLocale(locale);
        const response = await fetch(`/api/research/${uid}?lang=${dbLocale}`);
        if (!response.ok) throw new Error('Failed to fetch research');
        const data = await response.json();
        setResearch(data);
        // console.log("Research Data", data);
      } catch (error) {
        console.error('Error fetching research:');
      } finally {
        setLoading(false);
      }
    };

    fetchResearch();
  }, [uid, locale, getDatabaseLocale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Research not found</h1>
          <button
            onClick={() => router.back()}
            className="text-primary hover:underline"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }
  console.log("POST>{IOD}2:", research);
  // Transform mentions into card format
  const expertCards = research.mentions?.expert?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

  const onlineCards = research.mentions?.online?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

  const redditCards = research.mentions?.reddit?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

  const studyCards = research.mentions?.studies?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

  const xCards = research.mentions?.x?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

  const youtubeCards = research.mentions?.youtube?.map(mention => ({
    title: mention.title || '',
    outboundLink: mention.url || '',
    author: mention.author || ''
  })) || [];

 
  return (
    <div className="min-h-screen bg-background">
      <Head>
        <title>{`${research.title} - Dediabetes`}</title>
        <meta name="description" content={research.summary} />
      </Head>

      <ResearchTemplate
        title={research.title}
        publisher={research.publisher}
        publishDate={research.publishDate}
        summary={research.summary}
        studyDesign={{
          interventions: research.studyDesign?.interventions || [],
          outcomes: research.studyDesign?.outcomes || [],
          studyType: research.studyDesign?.studyType || '',
          duration: research.studyDesign?.duration || '',
          size: research.studyDesign?.size || ''
        }}
        studyPopulation={{
          ageRange: research.studyPopulation?.ageRange || '',
          sex: research.studyPopulation?.sex || '',
          geography: Array.isArray(research.studyPopulation?.geography) 
            ? research.studyPopulation.geography 
            : [research.studyPopulation?.geography].filter(Boolean),
          others: Array.isArray(research.studyPopulation?.others)
            ? research.studyPopulation.others
            : [research.studyPopulation?.others].filter(Boolean)
        }}
        methodology={research.methodology || ''}
        interventions={research.interventions || ''}
        keyFindings={research.keyFindings || ''}
        comparison={research.comparison || ''}
        biasScore={research.biasScore || ''}
        effectivenessAnalysis={{
          intervention: research.effectivenessAnalysis?.intervention || '',
          effectiveness: research.effectivenessAnalysis?.effectiveness || ''
        }}
        journalReference={{
          full: research.journalReference?.full || ''
        }}
        expertCards={expertCards}
        onlineCards={onlineCards}
        redditCards={redditCards}
        studyCards={studyCards}
        xCards={xCards}
        youtubeCards={youtubeCards}
        copyright_license={research.copyright_license || ""}
      />
    </div>
  );
}
