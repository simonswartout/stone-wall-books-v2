export const DEFAULT_DATA = {
    shop: {
        name: "Stone Wall Books",
        tagline: "A cozy New England book shop — powered by community and curated finds.",
        ebayStoreUrl: "https://www.ebay.com/sch/i.html?item=366103084195&rt=nc&_trksid=p4429486.m3561.l161211&_ssn=stonewallbooks",
        contactEmail: "simon@luminarylabs.dev",
        locationLine: "New England (online via eBay)",
        librarianEmail: "", // Set this to your Google email to lock the desk
    },
    procurementProgram: {
        title: "Community Procurement Program",
        summary: "Donate books to be sold through our eBay storefront. When they sell, proceeds are split 65/35 in your favor.",
        split: { collaboratorPercent: 65, shopPercent: 35 },
        steps: [
            { title: "1) Donate & Intake", body: "You donate books to the program. We log titles/conditions, then prepare listings for our eBay seller profile." },
            { title: "2) Listing & Sale", body: "We list eligible books on eBay. Buyers purchase through eBay using our Stone Wall Books seller account." },
            { title: "3) Revenue Confirmation", body: "Once eBay shows final revenue for each sold item, we calculate your share (65%) and our share (35%)." },
            { title: "4) Payout", body: "We pay out collaborator proceeds on an agreed cadence (e.g., monthly), based on finalized eBay revenue." },
            { title: "5) Unsold Books", body: "Books that do not sell are recycled into mystery boxes or returned to the collaborator if requested." },
        ],
        policies: [
            { title: "Split on sold items", body: "Collaborator receives 65% of finalized revenue and Stone Wall Books receives 35%." },
            { title: "Return option", body: "Collaborators can request unsold books be returned. Return shipping costs are paid by the collaborator." },
        ],
        disclaimer: "This page is informational. Final terms can be confirmed via our intake form / written agreement.",
    },
    categories: [
        "New Arrivals", "Fiction", "Non-Fiction", "Fantasy & Sci-Fi",
        "Mystery & Thriller", "Poetry", "Local & New England"
    ],
    genres: [
        "Classics", "Literary Fiction", "Poetry", "History", "Fantasy & Sci-Fi", "Mystery & Thriller", "Local & New England", "Textbooks"
    ],
    featured: [null, null],
    catalog: [
        {
            id: "swb-0001",
            title: "The Old Man and the Sea",
            author: "Ernest Hemingway",
            category: "Fiction",
            genre: "Classics",
            condition: "Very Good",
            shortDescription: "A classic tale of an aging fisherman's struggle with a giant marlin.",
            ebayUrl: "https://www.ebay.com/",
            tags: ["classic", "hardcover"],
        },
    ],
};
