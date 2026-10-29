/*
 * Certificate catalogue.
 * Add one object per certificate. Keep the original file in assets/certificates/.
 * For PDFs, add a first-page preview image in assets/certificates/previews/.
 * See assets/certificates/README.md for the exact fields and workflow.
 */
window.PORTFOLIO_CERTIFICATES = [
  {
    id: "edunet-foundation-frontend-web-development",
    title: "Frontend Web Development Internship",
    issuer: "Edunet Foundation · AICTE",
    category: "web-development",
    categoryLabel: "Web Development",
    date: "2025-09-30",
    dateLabel: "August–September 2025",
    description: "Certificate of completion for a six-week Front End Web Development internship, completed from 21 August to 30 September 2025 in collaboration with the All India Council for Technical Education (AICTE).",
    tags: ["Frontend", "Internship", "AICTE", "Web Development"],
    file: "/assets/certificates/edunet-foundation-internship.pdf",
    fileType: "pdf",
    preview: "/assets/certificates/previews/edunet-foundation-internship.webp",
  }
];
