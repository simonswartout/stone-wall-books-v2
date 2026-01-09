export function parseCSV(csvText) {
    const lines = csvText.trim().split(/\r?\n/);
    if (lines.length === 0) return [];

    // Check for TSV (Tab Separated Values) since user input looks like tabs from the request example
    // The user pasted what looks like Excel/Sheets copy-paste which is often TSV.
    const isTSV = lines[0].includes('\t');

    // Naive split by comma, handling quotes optionally would be better but simple regex for now
    // Actually, handling quotes is important for descriptions. 
    // Let's use a slightly more robust regex match.

    const parseLine = (line) => {
        if (isTSV) return line.split('\t'); // TSV is much simpler usually

        const result = [];
        let start = 0;
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
                inQuotes = !inQuotes;
            } else if (line[i] === ',' && !inQuotes) {
                let cell = line.substring(start, i);
                // Strip quotes if present
                if (cell.startsWith('"') && cell.endsWith('"')) {
                    cell = cell.substring(1, cell.length - 1).replace(/""/g, '"');
                }
                result.push(cell);
                start = i + 1;
            }
        }
        // Last cell
        let cell = line.substring(start);
        if (cell.startsWith('"') && cell.endsWith('"')) {
            cell = cell.substring(1, cell.length - 1).replace(/""/g, '"');
        }
        result.push(cell);

        return result;
    };

    const headers = parseLine(lines[0]).map(h => h.trim());
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const values = parseLine(lines[i]);
        if (values.length < headers.length) continue; // Skip malformed lines

        const rawObj = {};
        headers.forEach((h, index) => {
            rawObj[h] = values[index];
        });

        // Determine Auction ID / Item Number
        const itemNumber = rawObj["Item number"] || rawObj["Auction ID"];

        // Determine Title
        const rawTitle = rawObj["Title"] || rawObj["Name"] || "Untitled";
        let title = rawTitle;
        let author = "Unknown";

        // Try to extract author from title if "by " is present (common in eBay listings)
        if (title.includes(" by ")) {
            const parts = title.split(/\s+by\s+/i);
            if (parts.length > 1) {
                title = parts[0].trim();
                author = parts[1].trim();
            }
        }

        // Determine Category (favor Category 2 as it is usually more specific, falling back to 1)
        const category = rawObj["eBay category 2 name"] || rawObj["eBay category 1 name"] || rawObj["Genre"] || "General";

        // Determine Price (Start price for auction starting price disclaimer)
        const price = rawObj["Start price"] || rawObj["Current bid"] || rawObj["Price"];

        const finalObj = {
            id: itemNumber ? `swb-${itemNumber}` : `swb-${Date.now()}-${i}`,
            title: title,
            author: author,
            category: category,
            condition: rawObj["Condition"] || "Good",
            shortDescription: "",
            ebayUrl: itemNumber ? `https://www.ebay.com/itm/${itemNumber}` : "",
            tags: price ? [`Price: ${price.startsWith('$') ? price : '$' + price}`] : []
        };

        // If the CSV matches our internal export format, override
        if (rawObj["title"] || rawObj["author"]) {
            if (rawObj["id"]) finalObj.id = rawObj["id"];
            if (rawObj["title"]) finalObj.title = rawObj["title"];
            if (rawObj["author"]) finalObj.author = rawObj["author"];
            if (rawObj["category"]) finalObj.category = rawObj["category"];
            if (rawObj["condition"]) finalObj.condition = rawObj["condition"];
            if (rawObj["ebayUrl"]) finalObj.ebayUrl = rawObj["ebayUrl"];
            if (rawObj["shortDescription"]) finalObj.shortDescription = rawObj["shortDescription"];
        }

        result.push(finalObj);
    }

    return result;
}
