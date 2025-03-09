'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import ResumeEditor from '@/components/ResumeEditor';

export default function ResumeClient() {
  const { isAuthenticated, isLoading } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  
  // Wait for authentication to load
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setShowEditor(true);
    }
  }, [isAuthenticated, isLoading]);
  
  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-12">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Resume</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Data Scientist
            </p>
          </div>
          <div className="flex space-x-4">
            <button 
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-colors"
            >
              Download PDF
            </button>
            
            {isAuthenticated && (
              <button 
                onClick={() => setShowEditor(!showEditor)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {showEditor ? 'Hide Editor' : 'Edit Resume'}
              </button>
            )}
          </div>
        </div>
        
        {showEditor && (
          <section className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Resume Editor</h2>
            <ResumeEditor />
          </section>
        )}

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Professional Summary</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Data Scientist with 6+ years of experience using statistics and exploratory data analysis to find actionable business insights. 
            Experienced in presenting insights through custom dashboards, automated reports, and presenting higher level takeaways to the c-level suite.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Experience</h2>
          <div className="space-y-8">
            <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Senior Data Scientist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Capgemini / Sogeti • October 2019 - Present</p>
              <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Using Python & Databricks, created a package that contextualized billions of data points to enable manufacturing engineers to identify non conformances</li>
                <li>Using composite design patterns, scaled non conformances package to 8 lines by only adding json configurations for each new line</li>
                <li>Created an NLP classification model that identified precursors to serious injuries and fatalities through written incident reports</li>
                <li>Mentored 3 data scientists on how to productionize and deploy their machine learning models</li>
                <li>Pipelined multiple datasets and enabled access to other business and advanced analytics users</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Data Scientist</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">AJ Madison • August 2018 - October 2019</p>
              <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Used statistical modeling to identify potential changes in metrics after altering business strategies</li>
                <li>Used network analytics to identify individual customers and how they connect to similar customers</li>
                <li>Mentored other analysts to help grow their python, sql, and excel programming skill set</li>
                <li>Created dashboarding environment for sales, marketing, merchandising, and warehousing functions using Power BI</li>
                <li>Automated ETL process Google Analytics & Fullstory Data</li>
                <li>Built and Documented a Data Warehouse using SQL SERVER</li>
              </ul>
            </div>
            
            <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-900 dark:text-gray-100">Senior Insights Analyst</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tempur-Sealy International • January 2017 - August 2018</p>
              <ul className="mt-4 space-y-2 list-disc list-inside text-gray-600 dark:text-gray-400">
                <li>Used regression & minimization techniques to develop media mix models and find time decay of various advertising channels</li>
                <li>Automated scripts to run and distribute company reporting using SQL, Python, Powerpoint, & Tableau</li>
                <li>Managed a centralized Postgresql database and automated ETL activities</li>
                <li>Represented analytics team and consistently presented in executive meetings (C, EVP, & VP levels)</li>
                <li>Planned analytics strategies and projects while managing team expectations throughout the organization</li>
                <li>Designed, Wireframed, and developed executive level reports using Tableau</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Data Science Tools</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Python',
                  'SQL',
                  'Machine Learning',
                  'Pandas',
                  'Numpy',
                  'Scikit-Learn',
                  'Statsmodels',
                  'SciPy',
                  'Matplotlib',
                  'Seaborn',
                  'Azure ML',
                  'Pyspark / Databricks',
                ].map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Software</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Github',
                  'Tableau',
                  'PowerBI',
                  'Jupyter',
                  'VBA',
                  'MS Office Suite',
                ].map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-3">Business Skills</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Presenting business findings',
                  'Strategizing with Decision Makers',
                  'Identifying Cost Value Trade Offs',
                  'Consumer Journey Analytics',
                ].map((skill) => (
                  <span 
                    key={skill}
                    className="px-3 py-1 bg-primary/10 dark:bg-primary/20 text-primary dark:text-accent rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Education</h2>
          <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Bachelor of Science, Business Administration</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">University of Massachusetts - Lowell • Marketing & Management Track • 2004 - 2008</p>
          </div>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Certifications</h2>
          <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">Springboard Datascience Career Track</h3>
          </div>
        </section>
        
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Interests</h2>
          <div className="p-6 bg-gray-100 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400">
              Apart from being a data scientist, I am a life long learner. You'll find me studying anything from data & tech to anything business related. 
              Also, I'm extremely interested in personal finance and talking this with anyone I can.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-4">
              Other than data, my life consists of rough housing with my toddler, spending a lot of time with my wife, traveling, 
              and the future impact technology will have on our everyday lives.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
} 