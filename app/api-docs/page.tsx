import { documentation } from "../api/urlshortener/docs";

type DocumentationKeys = keyof typeof documentation;

export default function Page() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">API Documentation</h1>
            <p className="text-lg text-gray-600">
                Welcome to the API documentation for RUshort. Here you will find
                information on how to interact with the API to shorten URLs and retrieve
                statistics.
            </p>

            <h2 className="text-xl font-semibold mt-8">Documentation</h2>
            <p className="text-lg text-gray-600">
                The following endpoints are available:
            </p>
            <ul className="list-disc pl-8 mt-4">
                {Object.keys(documentation).map((key) => {
                    const docKey = key as DocumentationKeys;
                    return (
                        <li key={docKey}>
                            <h3 className="text-lg font-semibold mt-4">{docKey}</h3>
                            <p className="text-gray-600">{documentation[docKey].description}</p>
                            <h4 className="text-md font-semibold mt-2">Response</h4>
                            <ul className="list-disc pl-8 mt-2">
                                {Object.keys(documentation[docKey].response).map((resKey) => {
                                    const responseKey = resKey as keyof typeof documentation[typeof docKey]['response'];
                                    return (
                                        <li key={responseKey}>
                                            <span className="font-semibold">{responseKey}</span>:{" "}
                                            {documentation[docKey].response[responseKey]}
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
