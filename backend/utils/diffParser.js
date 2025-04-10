/**
 * Parse a Git diff string into a structured object
 * @param {string} diff The Git diff string
 * @returns {Object} Parsed diff information
 */
function parseDiff(diff) {
    // Store the raw diff for reference
    const result = {
        rawDiff: diff,
        files: []
    };

    // Split the diff by file
    const fileRegex = /^diff --git a\/(.*?) b\/(.*?)$/gm;
    const chunkRegex = /^@@ -(\d+),(\d+) \+(\d+),(\d+) @@/gm;
    
    let fileMatch;
    let lastIndex = 0;
    
    while ((fileMatch = fileRegex.exec(diff)) !== null) {
        const filePath = fileMatch[1]; // Use the path from the diff
        const fileStartIndex = fileMatch.index;
        const nextFileIndex = diff.indexOf('diff --git', fileMatch.index + 1);
        const fileEndIndex = nextFileIndex !== -1 ? nextFileIndex : diff.length;
        const fileContent = diff.substring(fileStartIndex, fileEndIndex);
        
        // Count additions and deletions
        let additions = 0;
        let deletions = 0;
        
        // Process each line in the file diff
        const lines = fileContent.split('\n');
        for (const line of lines) {
            if (line.startsWith('+') && !line.startsWith('+++')) {
                additions++;
            } else if (line.startsWith('-') && !line.startsWith('---')) {
                deletions++;
            }
        }
        
        // Extract chunks
        const chunks = [];
        let chunkMatch;
        const chunkRegexCopy = new RegExp(chunkRegex);
        
        while ((chunkMatch = chunkRegexCopy.exec(fileContent)) !== null) {
            chunks.push({
                oldStart: parseInt(chunkMatch[1], 10),
                oldLines: parseInt(chunkMatch[2], 10),
                newStart: parseInt(chunkMatch[3], 10),
                newLines: parseInt(chunkMatch[4], 10)
            });
        }
        
        // Add file info to result
        result.files.push({
            path: filePath,
            additions,
            deletions,
            chunks
        });
        
        lastIndex = fileEndIndex;
    }
    
    return result;
}

module.exports = {
    parseDiff
};
