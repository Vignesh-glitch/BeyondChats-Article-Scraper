import axios from "axios";
import OpenAI from "openai";
import dotenv from "dotenv";
import * as cheerio from "cheerio";


dotenv.config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const BACKEND_API = "http://localhost:5000/articles";

// Scrape main article content from ranking URLs
async function scrapeContent(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  return $("article").text() || $("body").text();
}

async function processArticles() {
  const articles = await axios.get(BACKEND_API);

  for (let art of articles.data) {
    const query = `${art.title} blog article`;
    console.log("Searching Google for:", query);

    const googleRes = await axios.get(
      `https://serpapi.com/search.json?q=${encodeURIComponent(query)}&api_key=${process.env.SERP_API}`
    );

    const links = googleRes.data.organic_results
      .filter(r => r.link.includes("blog") || r.link.includes("article"))
      .slice(0, 2)
      .map(r => r.link);

    console.log("Top ranking references:", links);

    const refContents = [];
    for (let l of links) {
      const c = await scrapeContent(l);
      refContents.push(c);
      refContents.push("\n--- Reference End ---\n");
    }

    const prompt = `
Rewrite this article to match formatting & tone similar to the references:

TITLE: ${art.title}
CONTENT: ${art.content}

REFERENCES:
${refContents.join("\n")}
`;

    const llmOut = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const newArticle = llmOut.choices[0].message.content;

    await axios.put(`${BACKEND_API}/${art.id}`, {
      title: art.title,
      content: newArticle,
      source_url: art.source_url
    });

    console.log("Updated & published:", art.title);
  }
}

processArticles();
