"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { m } from "framer-motion";

const faqs = [
  {
    question: "What makes EasyEnglish different from other language learning platforms?",
    answer:
      "EasyEnglish uses advanced AI technology to provide personalized, real-time feedback on your grammar, pronunciation, and vocabulary. Our adaptive learning system adjusts to your pace and learning style, making your journey more effective and enjoyable. Plus, our interactive content keeps you engaged while building practical English skills.",
  },
  {
    question: "Do I need any prior English knowledge to start?",
    answer:
      "Not at all! EasyEnglish is designed for learners at all levels, from absolute beginners to advanced speakers. Our initial assessment helps us understand your current level and creates a customized learning path tailored to your needs. You'll start exactly where you need to and progress at your own pace.",
  },
  {
    question: "How much time do I need to dedicate each day?",
    answer:
      "You can learn at your own pace! Whether you have 5 minutes or an hour, our bite-sized lessons fit into your schedule. Studies show that consistent practice, even just 15-20 minutes daily, leads to significant improvement. Our mobile app makes it easy to practice anytime, anywhere.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer:
      "Yes, absolutely! You can cancel your subscription at any time with no cancellation fees. You'll continue to have access to Premium features until the end of your billing period. We also offer a 30-day money-back guarantee if you're not completely satisfied.",
  },
  {
    question: "Is the certificate recognized by employers and educational institutions?",
    answer:
      "Yes! Upon completing our comprehensive course, you'll receive a digital certificate that demonstrates your English proficiency level. Our certificates are recognized by many employers and institutions worldwide. You can also share it directly on LinkedIn to showcase your achievement.",
  },
  {
    question: "Do you offer a free trial?",
    answer:
      "Yes! We offer a 7-day free trial of our Premium plan with full access to all features. No credit card required to start. This gives you plenty of time to explore the platform and see if it's the right fit for your learning goals. After the trial, you can choose to continue with Premium or use our free tier.",
  },
  {
    question: "What devices can I use EasyEnglish on?",
    answer:
      "EasyEnglish works seamlessly across all your devices. Access our platform via web browser on desktop or laptop computers, or download our mobile apps for iOS and Android. Your progress syncs automatically across all devices, so you can start a lesson on your phone and finish it on your computer.",
  },
  {
    question: "How does the AI feedback work?",
    answer:
      "Our AI tutor analyzes your writing and speaking in real-time, checking for grammar, vocabulary usage, pronunciation, and context. It provides instant, personalized feedback with specific suggestions for improvement. The more you use it, the better it understands your learning patterns and adapts to help you improve faster.",
  },
];

export function FAQSection() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <m.h2
            className="mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </m.h2>
          <m.p
            className="mx-auto max-w-2xl text-balance text-lg text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Have questions? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?
            Contact our support team.
          </m.p>
        </div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="glass-hover rounded-lg border-2 px-6 transition-all duration-300 data-[state=open]:border-primary/50"
              >
                <AccordionTrigger className="text-left hover:no-underline">
                  <span className="text-base font-semibold">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="pb-4 pt-2 leading-relaxed text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </m.div>

        <m.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            Still have questions?{" "}
            <a
              href="mailto:support@easyenglish.com"
              className="focus-ring rounded font-semibold text-primary hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </m.div>
      </div>
    </section>
  );
}
