/**
 * Claude API Integration via Proxy Server
 * This file handles communication with our backend proxy
 */

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api/generate';

/**
 * Completes a prompt using Claude API via proxy server
 * @param {string} prompt - The prompt to send to Claude
 * @returns {Promise<string>} - The generated text response
 */
export async function completePrompt(prompt) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: prompt,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || `API request failed: ${response.status}`
            );
        }

        const data = await response.json();

        if (data.text) {
            return data.text;
        }

        throw new Error('Unexpected API response format');
    } catch (error) {
        console.error('Error calling Claude API:', error);

        // More helpful error messages
        if (error.message.includes('Failed to fetch')) {
            throw new Error(
                'Cannot connect to server. Make sure the backend server is running on port 3001.'
            );
        }

        throw error;
    }
}

/**
 * Create a window.claude object for compatibility
 * This mimics the interface you were using before
 */
export function initializeClaudeAPI() {
    if (typeof window !== 'undefined') {
        window.claude = {
            complete: completePrompt,
        };
    }
}