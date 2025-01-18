
const documentation = {
    POST: {
        description: "Shorten a URL",
        body: {
            originalUrl: "string",
            alias: "string (optional)",
            length: "number (optional)",
            prefix: "string (optional)"
        },
        response: {
            message: "string",
            success: "boolean",
            shortenURL: "string (optional)",
            error: "string (optional)"
        }
    },
    GET: {
        description: "Get URL statistics",
        response: {
            totalClicks: "number",
            totalShortenedURLs: "number",
            documentation: "object"
        }
    }
};

const help = {
    POST: {
        description: "Shorten a URL",
        body: {
            originalUrl: "The URL to shorten",
            alias: "An optional alias for the shortened URL"
        },
        response: {
            message: "A message indicating the status of the operation",
            success: "A boolean indicating if the operation was successful",
            shortenURL: "The shortened URL (if successful)",
            error: "An error message (if unsuccessful)"
        }
    },
    GET: {
        description: "Get URL statistics",
        response: {
            totalClicks: "The total number of clicks on all shortened URLs",
            totalShortenedURLs: "The total number of shortened URLs",
            documentation: "An object containing the API documentation"
        }
    }
};

const howtouse = {
    POST: {
        description: "Shorten a URL",
        body: {
            originalUrl: "The URL to shorten",
            alias: "An optional alias for the shortened URL"
        },
        response: {
            message: "A message indicating the status of the operation",
            success: "A boolean indicating if the operation was successful",
            shortenURL: "The shortened URL (if successful)",
            error: "An error message (if unsuccessful)"
        }
    },
    GET: {
        description: "Get URL statistics",
        response: {
            totalClicks: "The total number of clicks on all shortened URLs",
            totalShortenedURLs: "The total number of shortened URLs",
            documentation: "An object containing the API documentation"
        }
    }
};


export { documentation, help, howtouse };