import { InferGetServerSidePropsType } from "next";
import ReactMarkdown from "react-markdown";

import PageFooter from "@/components/page-footer";
import PageNav from "@/components/page-nav";

import { getServerSideProps } from "./client-terms";

export default function ClientPrivacy({
  deployment,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="w-screen h-screen overflow-y-auto bg-background">
      <PageNav />
      <main>
        <section className="max-w-3xl mx-auto p-8 prose prose-sm prose-headings:font-bold dark:prose-invert">
          <h1>{deployment?.l2.name} Privacy Policy</h1>
          <ReactMarkdown>{deployment?.tos?.customPrivacyPolicy}</ReactMarkdown>
        </section>
      </main>
      <PageFooter />
    </div>
  );
}

export { getServerSideProps };
