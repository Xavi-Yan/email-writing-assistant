import { useState, useEffect } from 'react';
import { Send, Copy, Check, Mail, Sparkles, MessageSquare, User } from 'lucide-react';
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
            {/* Header */}
            <header className="app-header">
                <div className="header-background"></div>
                <div className="header-content">
                    <div className="header-text-center">
                        <div className="header-icon-wrapper">
                            <Mail className="header-icon" />
                        </div>
                        <h1 className="header-title">
                            {t('emailWritingAssistant')}
                        </h1>
                        <p className="header-subtitle">
                            {t('transformThoughtsDescription')}
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                <div className="content-grid">

                    {/* Input Section */}
                    <div className="input-section">
                        {/* Thoughts Input */}
                        <div className="card">
                            <div className="card-header">
                                <div className="icon-wrapper icon-wrapper-blue">
                                    <MessageSquare className="icon" />
                                </div>
                                <h2 className="card-title">{t('yourThoughts')}</h2>
                            </div>

                            <textarea
                                value={rawThoughts}
                                onChange={(e) => setRawThoughts(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder={t('thoughtsPlaceholder')}
                                className="thoughts-textarea"
                            />

                            <div className="tip-text">
                                {t('tipKeyboardShortcut')}
                            </div>
                        </div>

                        {/* Tone Selection */}
                        <div className="card">
                            <div className="card-header">
                                <div className="icon-wrapper icon-wrapper-indigo">
                                    <Sparkles className="icon" />
                                </div>
                                <h2 className="card-title">{t('emailTone')}</h2>
                            </div>

                            <div className="tone-grid">
                                {tones.map((toneOption) => (
                                    <button
                                        key={toneOption.value}
                                        onClick={() => setTone(toneOption.value)}
                                        className={`tone-button ${tone === toneOption.value ? 'tone-button-active' : ''}`}
                                    >
                                        <div className="tone-label">{toneOption.label}</div>
                                        <div className="tone-description">{toneOption.description}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Context Email Section */}
                        <div className="card">
                            <div className="card-header-between">
                                <div className="card-header">
                                    <div className="icon-wrapper icon-wrapper-slate">
                                        <User className="icon" />
                                    </div>
                                    <h2 className="card-title">{t('contextOptional')}</h2>
                                </div>
                                <button
                                    onClick={() => setShowContext(!showContext)}
                                    className="toggle-button"
                                >
                                    {showContext ? t('hide') : t('show')}
                                </button>
                            </div>

                            {showContext && (
                                <>
                                    <p className="context-description">
                                        {t('contextDescription')}
                                    </p>
                                    <textarea
                                        value={contextEmail}
                                        onChange={(e) => setContextEmail(e.target.value)}
                                        placeholder={t('contextPlaceholder')}
                                        className="context-textarea"
                                    />
                                </>
                            )}
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={generateEmail}
                            disabled={isLoading || !rawThoughts.trim()}
                            className="generate-button"
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner"></div>
                                    {t('craftingEmail')}
                                </>
                            ) : (
                                <>
                                    <Send className="button-icon" />
                                    {t('generateEmail')}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Output Section */}
                    <div className="output-section">
                        <div className="card output-card">
                            <div className="card-header-between">
                                <div className="card-header">
                                    <div className="icon-wrapper icon-wrapper-green">
                                        <Mail className="icon" />
                                    </div>
                                    <h2 className="card-title">{t('generatedEmail')}</h2>
                                </div>

                                {generatedEmail && (
                                    <button
                                        onClick={copyToClipboard}
                                        className="copy-button"
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="button-icon-success" />
                                                {t('copied')}
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="button-icon-small" />
                                                {t('copy')}
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {error && (
                                <div className="error-message">
                                    <p>❌ {error}</p>
                                </div>
                            )}

                            {generatedEmail ? (
                                <div className="email-output">
                  <pre className="email-text">
                    {generatedEmail}
                  </pre>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <Mail className="empty-state-icon" />
                                    <p className="empty-state-text">{t('emailWillAppearHere')}</p>
                                    <p className="empty-state-subtext">{t('getStartedPrompt')}</p>
                                </div>
                            )}
                        </div>

                        {/* Tips */}
                        <div className="tips-card">
                            <h3 className="tips-title">{t('proTips')}</h3>
                            <ul className="tips-list">
                                <li>{t('tipBeSpecific')}</li>
                                <li>{t('tipIncludeDetails')}</li>
                                <li>{t('tipTryTones')}</li>
                                <li>{t('tipAddContext')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}