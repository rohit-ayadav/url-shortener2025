import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqItems = [
    {
      question: "How long do shortened links last?",
      answer: "Free links last up to 30 days. Pro and Enterprise links can be set to expire up to 5 years from creation or never expire."
    },
    {
      question: "Can I customize my shortened links?",
      answer: "Yes! You can create custom aliases, add prefixes, and even use your own domain with our Pro and Enterprise plans."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, we offer a RESTful API for Pro and Enterprise users to integrate URL shortening into their applications."
    },
    {
      question: "What analytics are provided?",
      answer: "Our platform provides comprehensive analytics including click counts, geographic data, device types, referral sources, and time-based statistics. Pro and Enterprise users get access to advanced analytics features."
    },
    {
      question: "Is bulk URL shortening supported?",
      answer: "Yes! You can shorten multiple URLs at once by uploading a CSV file or using our bulk shortening interface. This feature is available on all paid plans."
    },
    {
      question: "How secure are the shortened links?",
      answer: "We use industry-standard security measures including HTTPS encryption, rate limiting, and spam protection. Enterprise users can also enable additional security features like password protection and access controls."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600">
            Everything you need to know about our URL shortening service
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-white mb-4 rounded-lg border border-gray-200"
            >
              <AccordionTrigger className="px-6 hover:no-underline hover:bg-gray-50 transition-colors duration-200">
                <span className="text-left font-semibold text-lg">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 text-gray-600">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Still have questions?{" "}
            <a 
              href="/contact" 
              className="text-blue-600 hover:text-blue-700 font-medium underline-offset-4 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faq;