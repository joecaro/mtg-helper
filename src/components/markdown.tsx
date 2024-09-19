import ReactMarkdown from "react-markdown";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default function Markdown({ markdown }: { markdown: string }) {
    return (
        <ReactMarkdown
            rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
            ]}
        >
            {markdown}
        </ReactMarkdown>
    );
}
