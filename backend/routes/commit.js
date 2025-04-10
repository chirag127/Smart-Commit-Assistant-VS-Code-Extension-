const express = require('express');
const router = express.Router();
const geminiClient = require('../services/geminiClient');
const diffParser = require('../utils/diffParser');

/**
 * Generate commit message suggestions
 * POST /generate-commit
 * Body: { diff: string, tone: string, apiKey?: string }
 * Response: { suggestions: Array<{ message: string, explanation: string }> }
 */
router.post('/generate-commit', async (req, res, next) => {
    try {
        const { diff, tone, apiKey } = req.body;

        // Validate request
        if (!diff) {
            return res.status(400).json({ error: 'No diff provided' });
        }

        if (!tone) {
            return res.status(400).json({ error: 'No tone provided' });
        }

        // Parse the diff to get a more structured representation
        const parsedDiff = diffParser.parseDiff(diff);

        // Generate commit message suggestions
        const suggestions = await geminiClient.generateCommitMessages(parsedDiff, tone, apiKey);

        // Return the suggestions
        res.status(200).json({ suggestions });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
