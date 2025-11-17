import { useState, useEffect } from 'react';
import { Send, Copy, Check, ArrowRight } from 'lucide-react';
import { TRANSLATIONS } from './translations';
import { TONE_OPTIONS } from './constants';
import { initializeClaudeAPI } from './api';
import './styles.css';

const appLocale = '{{APP_LOCALE}}';
const browserLocale = navigator.languages?.[0] || navigator.language || 'en-US';

const findMatchingLocale = (locale) => {
    if (TRANSLATIONS[locale]) return locale;
    const lang = locale.split('-')[0];
    const match = Object.keys(TRANSLATIONS).find(key => key.startsWith(lang + '-'));
    return match || 'en-US';
};

const locale = (appLocale !== '{{APP_LOCALE}}') ? findMatchingLocale(appLocale) : findMatchingLocale(browserLocale);
const t = (key) => TRANSLATIONS[locale]?.[key] || TRANSLATIONS['en-US'][key] || key;

export default function EmailWriterApp() {
    // Initialize Claude API on component mount
    useEffect(() => {
        initializeClaudeAPI();
    }, []);

    // State management
    const [rawThoughts, setRawThoughts] = useState('');
    const [tone, setTone] = useState('professional');
    const [contextEmail, setContextEmail] = useState('');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [showContext, setShowContext] = useState(false);
    const [error, setError] = useState('');

    const tones = TONE_OPTIONS.map(option => ({
        ...option,
        label: t(option.labelKey),
        description: t(option.descriptionKey)
    }));

    const generateEmail = async () => {
        if (!rawThoughts.trim()) return;

        setIsLoading(true);
        setError('');
        try {
            const contextPart = contextEmail.trim()
                ? `\n\nContext - I am responding to this email:\n"${contextEmail}"\n\n`
                : '';

            const prompt = `You are an expert email writer. Transform the following raw thoughts into a well-crafted email with a ${tone} tone.

Raw thoughts: "${rawThoughts}"${contextPart}

Instructions:
- Write a complete, professional email body
- Use a ${tone} tone throughout
- Make it clear, engaging, and well-structured
- Ensure proper email etiquette
- Do not include a subject line

Please respond in ${locale} language.

Respond with ONLY the email body content. Do not include any explanations or additional text outside of the email.`;

            const response = await window.claude.complete(prompt);
            setGeneratedEmail(response.trim());
        } catch (error) {
            console.error('Error generating email:', error);
            setError(error.message || 'An error occurred while generating your email. Please try again.');
            setGeneratedEmail('');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(generatedEmail);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            generateEmail();
        }
    };

    return (
        <div className="app-container">
            <div className="app-wrapper">

                {/* Header */}
                <header className="header">
                    <h1 className="title">{t('emailWritingAssistant')}</h1>
                    <p className="subtitle">{t('transformThoughtsDescription')}</p>
                </header>

                {/* Main Form */}
                <main className="main">

                    {/* Thoughts Input */}
                    <div className="field">
                        <label className="label">{t('yourThoughts')}</label>
                        <p className="field-description">
                            Type your ideas, key points, or rough draft here. Don't worry about perfect grammar or structure - just jot down what you want to communicate.
                        </p>
                        <textarea
                            value={rawThoughts}
                            onChange={(e) => setRawThoughts(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={t('thoughtsPlaceholder')}
                            className="textarea"
                            rows={6}
                        />
                    </div>

                    {/* Tone Selection */}
                    <div className="field">
                        <label className="label">{t('emailTone')}</label>
                        <p className="field-description">
                            Choose the tone that matches your relationship with the recipient and the purpose of your email. This will shape the language and formality level.
                        </p>
                        <div className="tone-options">
                            {tones.map((toneOption) => (
                                <button
                                    key={toneOption.value}
                                    onClick={() => setTone(toneOption.value)}
                                    className={`tone-option ${tone === toneOption.value ? 'active' : ''}`}
                                >
                                    {toneOption.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Context (Optional) */}
                    <div className="field">
                        <div className="label-row">
                            <label className="label">{t('contextOptional')}</label>
                            <button
                                onClick={() => setShowContext(!showContext)}
                                className="toggle-link"
                            >
                                {showContext ? t('hide') : t('show')}
                            </button>
                        </div>
                        <p className="field-description">
                            If you're replying to an email, paste it here for better context. This helps generate a more relevant and accurate response.
                        </p>
                        {showContext && (
                            <textarea
                                value={contextEmail}
                                onChange={(e) => setContextEmail(e.target.value)}
                                placeholder={t('contextPlaceholder')}
                                className="textarea"
                                rows={4}
                            />
                        )}
                    </div>

                    {/* Generate Button */}
                    <button
                        onClick={generateEmail}
                        disabled={isLoading || !rawThoughts.trim()}
                        className="btn-primary"
                    >
                        {isLoading ? (
                            <>
                                <div className="spinner"></div>
                                <span>{t('craftingEmail')}</span>
                            </>
                        ) : (
                            <>
                                <span>{t('generateEmail')}</span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    {/* Output */}
                    {(generatedEmail || error) && (
                        <>
                            <div className="divider"></div>

                            <div className="field">
                                <div className="label-row">
                                    <label className="label">{t('generatedEmail')}</label>
                                    {generatedEmail && (
                                        <button
                                            onClick={copyToClipboard}
                                            className="btn-copy"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check size={16} />
                                                    <span>{t('copied')}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy size={16} />
                                                    <span>{t('copy')}</span>
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                {error && (
                                    <div className="error">
                                        ❌ {error}
                                    </div>
                                )}

                                {generatedEmail && (
                                    <div className="output">
                                        {generatedEmail}
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                </main>

                {/* Footer */}
                <footer className="footer">
                    <div className="footer-text">
                        Developed by <strong>XaviLab, LLC</strong>
                    </div>
                </footer>

            </div>
        </div>
    );
}
