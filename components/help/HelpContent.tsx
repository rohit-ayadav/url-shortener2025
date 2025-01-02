// src/components/help/HelpContent.tsx
import { Info, FileText, Zap, Code, User, Calendar, Github, Globe } from 'lucide-react';

export const HelpContent = {
    terms: {
        icon: FileText,
        title: 'Terms of Use',
        content: () => (
            <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">
                    URL Shortener Guidelines
                </h3>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    {['Create short URLs responsibly', 'No spam or malicious content', 'Respect privacy rights'].map((text) => (
                        <div key={text} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                            <p>{text}</p>
                        </div>
                    ))}
                </div>
            </div>
        )
    },
    useCases: {
        icon: Zap,
        title: 'Use Cases',
        content: () => (
            <div className="grid sm:grid-cols-3 gap-4">
                {[
                    { title: 'Social Media', desc: 'Compact links for character-limited platforms', color: 'blue' },
                    { title: 'Marketing', desc: 'Track engagement and clicks', color: 'green' },
                    { title: 'Print Media', desc: 'Memorable URLs for print materials', color: 'purple' }
                ].map(({ title, desc, color }) => (
                    <div key={title} className={`bg-gradient-to-br from-${color}-50 to-${color}-100 dark:from-${color}-900/30 dark:to-${color}-900/50 p-4 rounded-xl shadow-sm`}>
                        <h4 className={`font-semibold text-${color}-800 dark:text-${color}-200 mb-2`}>{title}</h4>
                        <p className="text-gray-600 dark:text-gray-300">{desc}</p>
                    </div>
                ))}
            </div>
        )
    },
    howTo: {
        icon: Info,
        title: 'How to Use',
        content: () => (
            <div className="space-y-3 text-gray-700 dark:text-gray-300">
                {[
                    { color: 'blue', title: 'Single URL', desc: 'Paste URL and click "Shorten"' },
                    { color: 'green', title: 'Bulk Shortening', desc: 'Shorten multiple URLs at once' },
                    { color: 'purple', title: 'Text Mode', desc: 'Auto-detect URLs in text' }
                ].map(({ color, title, desc }, index) => (
                    <div key={title} className="flex space-x-3 items-start">
                        <div className={`w-6 h-6 bg-${color}-600 text-white rounded-full flex items-center justify-center font-bold`}>
                            {index + 1}
                        </div>
                        <div>
                            <p className="font-medium">{title}</p>
                            <p className="text-sm">{desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        )
    },
    about: {
        icon: Info,
        title: 'About',
        content: () => (
            <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                    {[
                        { icon: User, title: 'Author', content: 'Rohit Kumar Yadav' },
                        { icon: Calendar, title: 'Updated', content: 'December 11, 2024' },
                        { icon: Code, title: 'Tech Stack', content: ['React', 'TypeScript', 'Tailwind CSS', 'shadcn/ui'] },
                        {
                            icon: Github,
                            title: 'Source',
                            content: <a href="https://github.com/rohit-ayadav/url-shortener" target="_blank" rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-2">
                                <Globe className="h-4 w-4" />Repository
                            </a>
                        }
                    ].map(({ icon: Icon, title, content }) => (
                        <div key={title} className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                            <div className="flex items-center gap-3 mb-2">
                                <Icon className="h-5 w-5 text-blue-600" />
                                <h4 className="font-semibold">{title}</h4>
                            </div>
                            {Array.isArray(content) ? (
                                <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                                    {content.map(item => <li key={item}>• {item}</li>)}
                                </ul>
                            ) : (
                                <div className="text-gray-600 dark:text-gray-400">{content}</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )
    }
};
